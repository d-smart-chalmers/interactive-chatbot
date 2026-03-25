import type { ChatbotTurn, ScenarioChatHistory, ScenarioDescription, UserRole, UserTurn } from "./model";

export interface DescriptionsResponse {
  descriptions: ScenarioDescription[][];
}

export interface StartScenarioRequest {
  userRole: UserRole;
}

export interface StartScenarioResponse {
  description: string;
  history: ScenarioChatHistory;
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
  chatbotTurn: ChatbotTurn;
  instruction: string;
}

export interface RetryScenarioResponse {
  history: ScenarioChatHistory;
}