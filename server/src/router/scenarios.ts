import express, { type Request, type Response } from "express";
import asyncHandler from "express-async-handler";
import { ScenariosService } from "../service/scenarios";
import {
  DescriptionsResponse,
  GetFeedbackResponse,
  GetNextTurnResponse,
  RetryScenarioResponse,
  StartScenarioRequest,
  StartScenarioResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
} from "@shared/scenarios/api";
import { requireUser } from "@src/middleware/requireUser";
import CerebrasLLMService from "@src/service/cerebrasllmservice";

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
      const { description, history, newScenario } =
        scenariosService.startScenario(userId, scenarioId, userRole);
      res.status(200).send({ description, history, newScenario });
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
      const { userTurn } = scenariosService.submitAnswer(
        userId,
        scenarioId,
        answer,
        timestamp,
      );
      res.status(200).send({ userTurn });
    },
  ),
);

scenariosRouter.get(
  "/get-feedback/:userTurnId",
  requireUser,
  asyncHandler(
    (
      req: Request<{ userTurnId: string }>,
      res: Response<GetFeedbackResponse>,
    ) => {
      const userTurnId = parseInt(req.params.userTurnId);
      const userId = req.session.userId!;
      const turnWithFeedback = scenariosService.getFeedback(userId, userTurnId);
      res.status(200).send({ turnWithFeedback });
    },
  ),
);

scenariosRouter.get(
  "/get-next-turn",
  requireUser,
  asyncHandler((_req: Request, res: Response<GetNextTurnResponse>) => {
    const userId = _req.session.userId!;
    const { chatbotTurn, instruction } = scenariosService.getNextTurn(userId);
    res.status(200).send({ chatbotTurn, instruction });
  }),
);

scenariosRouter.post(
  "/retry-scenario",
  requireUser,
  asyncHandler((req: Request, res: Response<RetryScenarioResponse>) => {
    const userId = req.session.userId!;
    const history = scenariosService.retryScenario(userId);
    res.status(200).send({ history });
  }),
);

//TODO: REMOVE: Used for manual testing
scenariosRouter.get(
  "/feedback",
  asyncHandler(async (_req: Request, res: Response) => {
    const llmservice = new CerebrasLLMService();
    const correct = await llmservice.correctSpelling(
      "testnsing testning",
      "testing testing",
    );
    res.status(200).send({ correct });
  }),
);
scenariosRouter.get(
  "/compare",
  asyncHandler(async (_req: Request, res: Response) => {
    const llmservice = new CerebrasLLMService();
    const correct = await llmservice.compareMeaning(
      "it's very cold outside",
      "the weather is cold",
    );
    res.status(200).send({ correct });
  }),
);
