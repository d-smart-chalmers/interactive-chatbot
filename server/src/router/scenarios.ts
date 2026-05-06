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
import { ScenarioDescriptionList } from "@shared/scenarios/model.js";

let scenariosService: ScenariosService;

export function initScenariosRouter(scenarios: ScenariosService) {
  scenariosService = scenarios;
}
export const scenariosRouter = express.Router();
/**
 * @route GET /scenarios/descriptions
 * @desc Get the descriptions of all scenarios
 * @access Public (but requires session to track user)
 * @res {200} - An array of scenario description lists, each containing a header and an array of scenario descriptions
 * 
 */
scenariosRouter.get(
  "/descriptions",
  asyncHandler((req: Request, res: Response<DescriptionsResponse>) => {
    const scenarioDescriptionLists: ScenarioDescriptionList[] =
      scenariosService.getDescriptions();
    req.session.userId = req.sessionID;
    res.status(200).send({ scenarioDescriptionLists });
  }),
);

/**
 * @route POST /scenarios/start-scenario/:id
 * @desc Start a scenario with the given id and user role. If the user has already started this scenario, it will be resumed.
 * @access Private (requires active session)
 * @param {string} id - The id of the scenario to start
 * @body {UserRole} userRole - The role of the user in the scenario (starter or responder)
 * @res {200} - The description of the scenario, the initial chat history, and a boolean indicating whether this is a new scenario or a resumed one
 * @res {404} - If the scenario with the given id is not found
 */
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

/**
 * @route POST /scenarios/submit-answer/:id
 * @desc Submit an answer for the current turn in the scenario. The scenario manager will process the answer and update the chat history accordingly.
 * @access Private (requires active session)
 * @param {string} id - The id of the scenario for which to submit the answer
 * @body {string} answer - The user's answer to submit
 * @body {number} timestamp - The timestamp of when the answer was submitted
 * @res {200} - The updated user turn after submitting the answer
 * @res {404} - If there is no active scenario for the user or if the scenario id does not match the active scenario
 */
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

/**
 * @route GET /scenarios/get-feedback/:userTurnId
 * @desc Get feedback for a specific user turn. The scenario manager will return the user turn with the feedback included once it's ready.
 * @access Private (requires active session)
 * @param {number} userTurnId - The id of the user turn for which to get feedback
 * @res {200} - The user turn with feedback included
 * @res {404} - If there is no active scenario for the user or if the user turn id does not match any user turn in the active scenario
 */
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

/**
 * @route GET /scenarios/get-next-turn
 * @desc Get the next chatbot turn and instruction for the current scenario. The scenario manager will return the next chatbot turns and instruction based on the current state of the scenario.
 * @access Private (requires active session)
 * @res {200} - The next chatbot turns and instruction for the current scenario
 * @res {404} - If there is no active scenario for the user
 */
scenariosRouter.get(
  "/get-next-turn",
  requireUser,
  asyncHandler((_req: Request, res: Response<GetNextTurnResponse>) => {
    const userId = _req.session.userId!;
    const { chatbotTurns, instruction } = scenariosService.getNextTurn(userId);
    res.status(200).send({ chatbotTurns, instruction });
  }),
);

/**
 * @route POST /scenarios/retry-scenario
 * @desc Retry the current scenario from the beginning. The scenario manager will reset the scenario state and return the initial chat history.
 * @access Private (requires active session)
 * @res {200} - The initial chat history after resetting the scenario
 * @res {404} - If there is no active scenario for the user
 */
scenariosRouter.post(
  "/retry-scenario",
  requireUser,
  asyncHandler((req: Request, res: Response<RetryScenarioResponse>) => {
    const userId = req.session.userId!;
    const history = scenariosService.retryScenario(userId);
    res.status(200).send({ history });
  }),
);

