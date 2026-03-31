import {
  UserRole,
  type ScenarioChatHistory,
  type TurnHistory,
} from '@shared/scenarios/model';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
  scenarioEnded: boolean;
  addTurn: (turn: TurnHistory) => void;
  updateTurn: (turn: TurnHistory) => void;
  setTurns: (turns: TurnHistory[]) => void;
  setInstruction: (instruction: string) => void;
  setHistory: (history: ScenarioChatHistory) => void;
  setScenarioEnded: (ended: boolean) => void;
}

export const useChatHistoryStore = create<ScenarioChatHistoryState>()(persist((set) => ({
  turns: [],
  intruction: '',
  scenarioEnded: false,
  addTurn: (turn) => set((state) => ({ turns: [...state.turns, turn] })),
  updateTurn: (turn) =>
    set((state) => ({
      turns: state.turns.map((t) => (t.id === turn.id ? turn : t)),
    })),
  setTurns: (turns) => set({ turns }),
  setInstruction: (instruction) => set({ intruction: instruction }),
  setHistory: (history) =>
    set({ turns: history.turns, intruction: history.intruction }),
  setScenarioEnded: (ended) => set({ scenarioEnded: ended }),
}),
{
  name: 'scenario-storage',
  storage: createJSONStorage(() => sessionStorage),
  partialize: (state) => ({
    scenarioEnded: state.scenarioEnded
  })
}
)
);
