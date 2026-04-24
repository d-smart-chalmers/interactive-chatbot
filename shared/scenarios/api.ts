import type { ChatbotTurn, ScenarioChatHistory, ScenarioDescriptionList, UserRole, UserTurn } from "./model";

export interface DescriptionsResponse {
  scenarioDescriptionLists: ScenarioDescriptionList[];
}

export interface StartScenarioRequest {
  userRole: UserRole;
}

export interface StartScenarioResponse {
  description: string;
  history: ScenarioChatHistory;
  newScenario: boolean;
}

export interface SubmitAnswerRequest {
  answer: string;
  timestamp: number;
}

export interface SubmitAnswerResponse {
  userTurn: UserTurn;
}

export interface GetFeedbackResponse {
  turnWithFeedback: UserTurn;
}

export interface GetNextTurnResponse {
  chatbotTurns: ChatbotTurn[];
  instruction: string;
}

export interface RetryScenarioResponse {
  history: ScenarioChatHistory;
}