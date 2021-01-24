import { Router } from "express";
import { configureAuthRoutes } from "../routers/auth-routes";
import { configureUserRoutes } from "../routers/user-routes";
import { configurePlantRoutes } from "../routers/plant-routes";
import { configureWateringRoutes } from "../routers/watering-routes";

const configureRouter = (router: Router) => {
  configureAuthRoutes(router);
  configurePlantRoutes(router);
  configureUserRoutes(router);
  configureWateringRoutes(router);
  return router;
}

export default configureRouter