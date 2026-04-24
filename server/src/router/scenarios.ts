import express, { type Request, type Response } from "express";
import asyncHandler from "express-async-handler";
import { ScenariosService } from "../service/scenarios.js";
import {
  DescriptionsResponse,
  GetFeedbackResponse,
  GetNextTurnResponse,
  RetryScenarioResponse,
  StartScenarioRequest,
  StartScenarioResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
} from "@shared/scenarios/api.js";
import { requireUser } from "@src/middleware/requireUser.js";
import OpenAILLMService from "@src/service/openaillmservice.js";
import LLMService from "@src/service/llmservice.interface.js";

let scenariosService: ScenariosService;
let LLM_Service: LLMService;

export function initScenariosRouter(scenarios: ScenariosService) {
  scenariosService = scenarios;
  LLM_Service = new OpenAILLMService();
}
export const scenariosRouter = express.Router();

scenariosRouter.get(
  "/descriptions",
  asyncHandler((req: Request, res: Response<DescriptionsResponse>) => {
    const descriptions = scenariosService.getDescriptions();
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
    async (
      req: Request<{ userTurnId: string }>,
      res: Response<GetFeedbackResponse>,
    ) => {
      const userTurnId = parseInt(req.params.userTurnId);
      const userId = req.session.userId!;

      const userTurnWithFeedback = await scenariosService.getFeedback(
        userId,
        userTurnId,
      );

      res.status(200).send({ turnWithFeedback: userTurnWithFeedback });
    },
  ),
);

scenariosRouter.get(
  "/get-next-turn",
  requireUser,
  asyncHandler((_req: Request, res: Response<GetNextTurnResponse>) => {
    const userId = _req.session.userId!;
    const { chatbotTurns, instruction } = scenariosService.getNextTurn(userId);
    res.status(200).send({ chatbotTurns, instruction });
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
/* scenariosRouter.get(
  "/feedback",
  asyncHandler(async (_req: Request, res: Response) => {
    const llmservice = LLM_Service;
    const correct = await llmservice.correctSpelling(
      "Europe VTS, this is MV Sunrise. INFORMAToin. We are enterin VTS area in transit to Hamburg. Over.",
    );
    res.status(200).send({ correct });
  }),
);
scenariosRouter.get(
  "/compare",
  asyncHandler(async (_req: Request, res: Response) => {
    const llmservice = LLM_Service;
    const correct = await llmservice.compareMeaning(
      "We are enterin VTS area in transit to Hamburg",
      "we are soon entering hamburg",
    );
    res.status(200).send({ correct });
  }), 
  
);*/
