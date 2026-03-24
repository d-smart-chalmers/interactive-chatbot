import express, { type Request, type Response } from "express";
import asyncHandler from "express-async-handler";
import { ScenariosService } from "../service/scenarios";
import {
  DescriptionsResponse,
  StartScenarioRequest,
  StartScenarioResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
} from "@shared/scenarios/api";
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
    res.status(200).send({ descriptions });
  }),
);

scenariosRouter.post(
  "/start-scenario/:id",
  requireUser,
  asyncHandler(
    (
      req: Request<{ id: string }, never, StartScenarioRequest>,
      res: Response<StartScenarioResponse>,
    ) => {
      const scenarioId = req.params.id;
      const userRole = req.body.userRole;
      const userId = req.session.userId!;
      const { description, history } = scenariosService.startScenario(
        userId,
        scenarioId,
        userRole,
      );
      console.log("fetching scenario ");
      res.status(200).send({ description, history });
    },
  ),
);

scenariosRouter.post(
  "/submit-answer/:id",
  requireUser,
  asyncHandler(
    (
      req: Request<{ id: string }, never, SubmitAnswerRequest>,
      res: Response<SubmitAnswerResponse>,
    ) => {
      const scenarioId = req.params.id;
      const userId = req.session.userId!;
      const { answer, timestamp } = req.body;
      const { userTurn, chatbotTurn, instruction } =
        scenariosService.submitTurn(userId, scenarioId, answer, timestamp);
      res.status(200).send({ userTurn, chatbotTurn, instruction });
    },
  ),
);
