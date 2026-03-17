import express, { type Request, type Response } from "express";
import asyncHandler from "express-async-handler";
import { ScenariosService } from "../service/scenarios";
import { DescriptionsResponse } from "../../../shared/scenarios/api";

let scenariosService: ScenariosService;
export function initScenariosRouter(scenarios: ScenariosService) {
  scenariosService = scenarios;
}
export const scenariosRouter = express.Router();

scenariosRouter.get(
  "/descriptions",
  asyncHandler((_req: Request, res: Response<DescriptionsResponse>) => {
    const descriptions = scenariosService.getDescriptions();
    res.status(200).send({descriptions})
  }),
);
