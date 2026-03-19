import type { ScenarioChatHistory, ScenarioDescription, UserRole } from "./model";

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