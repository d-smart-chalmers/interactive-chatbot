import { useEffect } from 'react';
import { api } from '~/service/api';
import type {
  StartScenarioRequest,
  StartScenarioResponse,
} from '@shared/scenarios/api';
import { useChatHistoryStore, useUserRoleStore } from '~/store/state';

interface ChatinterfaceProps {
  id: string;
}

export default function Chatinterface({ id }: ChatinterfaceProps) {
  const userRoleStore = useUserRoleStore();
  const chatHistoryStore = useChatHistoryStore();
  useEffect(() => {
    async function fetchData() {
      const response = await api.post(`/scenarios/start-scenario/${id}`, {
        userRole: userRoleStore.userRole,
      } as StartScenarioRequest);
      if (response.status === 200) {
        const data = response.data as StartScenarioResponse;
        chatHistoryStore.setHistory(data.history);
      }
    }
    fetchData();
  });
  return (
    <div>
      <h1>Chat interface id is: {id}</h1>
      <h2>Role is: {userRoleStore.userRole}</h2>
      <span>Instruction: {chatHistoryStore.intruction}</span>
    </div>
  );
}
