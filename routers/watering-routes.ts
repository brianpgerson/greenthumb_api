import { Router, Request, Response } from "express";

import { sequelize } from '../database';

import { createWatering, updateWatering } from '../services/watering-service';
import { verifyJwt } from "../middleware/auth/jwt-middleware";
import { Watering, Schedule } from "../database";
import { STATUS } from "../database/models/Watering";
import { getDatesFromLastWatered } from "../util/general-utils";

export const configureWateringRoutes = async (router: Router) => {

  router.put('/waterings/:wateringId', verifyJwt, async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    if (loggedInUser === undefined) {
      return res.status(401).json({ errors: `Couldn't authenticate request, please log out and log back in.`})
    }
    const wateringId = Number(req.params.wateringId);
    const wateringDate = req.body.wateringDate;

    const txn = await sequelize.transaction();

    try {
      const watering = await Watering.findByPk(wateringId);
      if (watering === null) {
        return res.status(404).json({ errors: `Watering not found!`})
      }

      const { plantId } = watering;
      const schedule = await Schedule.findOne({ where: { plantId }})
      if (schedule === null) {
        return res.status(404).json({ errors: `Schedule not found!`})
      }

      const lastWatered = await updateWatering(watering, { 
        plantId, 
        startDate: watering.startDate, 
        endDate: watering.endDate, 
        wateringDate,
        status: STATUS.COMPLETE,
      }, txn);
      if (lastWatered === null) {
        return res.status(400).json({ errors: `Couldn't update completed watering!`})
      }

      const [ startDate, endDate ] = getDatesFromLastWatered(schedule, lastWatered.wateringDate);
      const nextWatering = await createWatering({ plantId, startDate, endDate,}, txn);
      if (nextWatering === null) {
        return res.status(400).json({ errors: `Couldn't create next pending watering!`})
      }

      await txn.commit();
      return res.status(200).json({ success: true })
    } catch (e) {
      await txn.rollback();
      return res.status(500).json({ errors: e.message })
    }
  })

  return router;
}