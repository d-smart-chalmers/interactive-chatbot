import express, { type Request, type Response } from "express";
import asyncHandler from "express-async-handler";
import { ScenariosService } from "../service/scenarios";
import { DescriptionsResponse, StartScenarioRequest, StartScenarioResponse } from "@shared/scenarios/api";
import { requireUser } from "@src/middleware/requireUser";

let scenariosService: ScenariosService;
export function initScenariosRouter(scenarios: ScenariosService) {
  scenariosService = scenarios;
}
export const scenariosRouter = express.Router();

scenariosRouter.get(
  "/descriptions",
  asyncHandler((req: Request, res: Response<DescriptionsResponse>) => {
    const descriptions = scenariosService.getDescriptions();
    //TODO: ful lösning, får ändra senare
    req.session.userId = req.sessionID;
    res.status(200).send({descriptions})
  }),
);

scenariosRouter.post(
  "/start-scenario/:id",
  requireUser,
  asyncHandler((req: Request<{ id: string }, never, StartScenarioRequest>, res: Response<StartScenarioResponse>) => {
    const scenarioId = req.params.id;
    const userRole = req.body.userRole;
    const userId = req.session.userId!;
    const { description, history } = scenariosService.startScenario(userId, scenarioId, userRole);
    res.status(200).send({description, history});
  }),
)
