export interface ScenarioDescription {
  id: string;
  description: string;
}

export enum UserRole {
  Vessel = "vessel",
  VTS = "vts",
}

export enum TurnType {
  User = "user",
  Chatbot = "chatbot",
}

export enum AnswerAccuracy {
  Correct = "correct",
  PartiallyCorrect = "partially_correct",
  Incorrect = "incorrect",
}

export interface ScenarioChatHistory {
  turns: TurnHistory[];
  intruction: string;
}

export interface BaseTurn {
  id: number;
  message: string;
  timestamp: number;
  type: TurnType;
  role: UserRole;
}

export interface UserTurn extends BaseTurn {
  feedback?: string;
  answerAccuracy?: AnswerAccuracy;
}

export interface ChatbotTurn extends BaseTurn {}

export type TurnHistory = UserTurn | ChatbotTurn;
