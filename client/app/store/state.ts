import {
  UserRole,
  type ScenarioChatHistory,
  type TurnHistory,
} from '@shared/scenarios/model';
import { create } from 'zustand';

interface UserRoleState {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  switchUseRole: () => void;
}

export const useUserRoleStore = create<UserRoleState>((set) => ({
  userRole: UserRole.Vessel,
  setUserRole: (role) => set({ userRole: role }),
  switchUseRole: () =>
    set((state) => ({
      userRole:
        state.userRole === UserRole.Vessel ? UserRole.VTS : UserRole.Vessel,
    })),
}));

interface ScenarioChatHistoryState {
  turns: TurnHistory[];
  intruction: string;
  addTurn: (turn: TurnHistory) => void;
  updateTurn: (turn: TurnHistory) => void;
  setTurns: (turns: TurnHistory[]) => void;
  setInstruction: (instruction: string) => void;
  setHistory: (history: ScenarioChatHistory) => void;
}

export const useChatHistoryStore = create<ScenarioChatHistoryState>((set) => ({
  turns: [],
  intruction: '',
  addTurn: (turn) => set((state) => ({ turns: [...state.turns, turn] })),
  updateTurn: (turn) =>
    set((state) => ({
      turns: state.turns.map((t) => (t.id === turn.id ? turn : t)),
    })),
  setTurns: (turns) => set({ turns }),
  setInstruction: (instruction) => set({ intruction: instruction }),
  setHistory: (history) =>
    set({ turns: history.turns, intruction: history.intruction }),
}));
