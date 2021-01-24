import { Router, Request, Response } from "express";

import { sequelize } from '../database/index';

import { createPlant, getPlant, updatePlant, getPlants, PlantRequest, deletePlant } from '../services/plant-service';
import { createSchedule, ScheduleRequest, updateSchedule } from '../services/schedule-service';
import { createWatering, updateWatering } from '../services/watering-service';
import { verifyJwt } from "../middleware/auth/jwt-middleware";
import { STATUS } from "../database/models/Watering";
import { INTERNAL_SERVER_ERROR } from "../util/errors.constants";
import { getDatesFromLastWatered } from "../util/general-utils";

export const configurePlantRoutes = async (router: Router) => {

  router.get('/plants', verifyJwt, async (req: Request, res: Response) => { 
    const { loggedInUser } = req;
    if (loggedInUser === undefined) {
      return res.status(401).json({ errors: `Couldn't authenticate request, please log out and log back in.`})
    }
    const { id: userId } = loggedInUser;

    try {
      const plants = await getPlants(userId);
      return res.status(200).json({ plants });

    } catch (e) {
      console.log(`Error retrieving plants: ${e}`);
      return res.status(500).json({ errors: INTERNAL_SERVER_ERROR })
    }
  })

  router.delete('/plants/:plantId', verifyJwt, async (req: Request, res: Response) => { 
    try {
      const plantId = Number(req.params.plantId);
      const deleted = await deletePlant(plantId);
      if (!deleted) {
        return res.status(404).json({ deleted: false });
      }
      return res.status(200).json({ deleted: !!deleted });
    } catch (e) {
      console.log(`Error deleting plant: ${e}`);
      return res.status(500).json({ errors: INTERNAL_SERVER_ERROR })
    }
  })

  router.post('/plants', verifyJwt, async (req: Request, res: Response) => {  
    const plantRequest: PlantRequest = req.body.plantRequest;
    const scheduleRequest: ScheduleRequest = req.body.scheduleRequest;
    const lastWatered = req.body.lastWatered;

    const { loggedInUser } = req;
    if (!loggedInUser) {
      return res.status(401).json({ errors: `Forbidden`})
    }

    const userId = loggedInUser.id;
    const txn = await sequelize.transaction();

    try {

      const plant = await createPlant({...plantRequest, userId }, txn)
      let schedule = null;
      let nextWatering = null;
      let lastWatering = null;
      if (plant === null) {
        return res.status(500).json({ errors: `Couldn't create plant!`})
      }
      if (scheduleRequest !== null) {
        schedule = await createSchedule({ ...scheduleRequest, plantId: plant.id }, txn)
        if (schedule === null) {
          await txn.rollback();
          return res.status(500).json({ errors: `Couldn't create watering schedule!`})
        }

        lastWatering = await createWatering({
          plantId: plant.id, 
          startDate: lastWatered,
          status: STATUS.COMPLETE,
          wateringDate: lastWatered,
        }, txn)
        if (lastWatering === null) {
          await txn.rollback();
          return res.status(500).json({ errors: `Couldn't create last watering!`})
        }
        
        const [ startDate, endDate ] = getDatesFromLastWatered(schedule, lastWatered);
        nextWatering = await createWatering({ 
          plantId: plant.id, 
          startDate,
          endDate,
        }, txn);

        if (nextWatering === null) {
          await txn.rollback();
          return res.status(500).json({ errors: `Couldn't create upcoming watering!`})
        }
      }
      await txn.commit();
      return res.status(200).json({ plant, schedule, nextWatering })
    } catch (e) {
      await txn.rollback();
      return res.status(500).json({ errors: e.message })
    }
  })

  router.put('/plants/:plantId', verifyJwt, async (req: Request, res: Response) => {  
    const { loggedInUser } = req;
    if (!loggedInUser) {
      return res.status(401).json({ errors: `Forbidden`})
    }
    
    const plantId = Number(req.params.plantId);
    const plantRequest: PlantRequest = req.body.plantRequest;
    const scheduleRequest: ScheduleRequest = req.body.scheduleRequest;

    const lastWatered = req.body.lastWatered;
    const txn = await sequelize.transaction();

    try {
      const originalPlant = await getPlant(plantId);
      if (!originalPlant) {
        return res.status(404).json({ errors: `No plant found!`})
      }

      const updatedPlant = await updatePlant(originalPlant, {...plantRequest }, txn)
      if (updatedPlant === null) {
        return res.status(500).json({ errors: `Couldn't update plant!`})
      }
      
      let nextWatering = null;
      let lastWatering = null;
      if (scheduleRequest !== null) {
        const originalSchedule = originalPlant.schedule;
        const updatedSchedule = await updateSchedule(originalSchedule, { ...scheduleRequest }, txn)
        if (updatedSchedule === null) {
          await txn.rollback();
          return res.status(500).json({ errors: `Couldn't update watering schedule!`})
        }

        const lastComplete = originalPlant.waterings.find(w => w.status === STATUS.COMPLETE);
        if (lastComplete) {
          lastWatering = await updateWatering(
            lastComplete, 
            { 
              plantId: originalPlant.id, 
              startDate: lastComplete.startDate, 
              endDate: lastComplete.endDate, 
              wateringDate: lastWatered,
              status: STATUS.COMPLETE,
            }, 
            txn
          );
        } else {     
          lastWatering = await createWatering({ 
            plantId: originalPlant.id, 
            status: STATUS.COMPLETE, 
            wateringDate: lastWatered,
            startDate: lastWatered,
          }, txn);
        }

        if (lastWatering === null) {
          await txn.rollback();
          return res.status(500).json({ errors: `Couldn't update last watering!`})
        }

        const [ startDate, endDate ] = getDatesFromLastWatered(updatedSchedule, lastWatered);
        const nextPendingWatering = originalPlant.waterings.find(w => w.status === STATUS.PENDING);
        if (nextPendingWatering) {
          nextWatering = await updateWatering(
            nextPendingWatering, 
            { plantId: originalPlant.id, startDate, endDate }, 
            txn
          );
        } else {     
          nextWatering = await createWatering({ plantId: originalPlant.id, startDate, endDate,}, txn);
        }

        
        if (nextWatering === null) {
          await txn.rollback();
          return res.status(500).json({ errors: `Couldn't update upcoming watering!`})
        }
      }
      await txn.commit();
      return res.status(200).json({ plant: updatedPlant, schedule: updateSchedule, nextWatering })
    } catch (e) {
      await txn.rollback();
      return res.status(500).json({ errors: e.message })
    }
  })

  return router;
}