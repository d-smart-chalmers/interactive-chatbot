import { useEffect, useState } from 'react';
import { api } from '~/service/api';
import type {
  StartScenarioRequest,
  StartScenarioResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
} from '@shared/scenarios/api';
import { useChatHistoryStore, useUserRoleStore } from '~/store/state';
import ChatHeader from './header';
import ChatWindowComponent from './chatwindow';
import MessageInputComponent from './messageinput';
import { useNavigate } from 'react-router';
import { withDeviceType } from '~/service/withDeviceType';
import FeedbackWindow from './feedbackwindow';
import { Drawer, DrawerContent } from '~/components/ui/drawer';

interface ChatinterfaceProps {
  id: string;
  isMobile?: boolean;
}

function Chatinterface({ id, isMobile }: ChatinterfaceProps) {
  const userRoleStore = useUserRoleStore();
  const chatHistoryStore = useChatHistoryStore();
  const [description, setDescription] = useState('');
  const [disableRetry, setDisableRetry] = useState(true);
  const navigate = useNavigate();
  const [openFeedback, setOpenFeedback] = useState(false);


  useEffect(() => {
    async function fetchData() {
      const response = await api.post(`/scenarios/start-scenario/${id}`, {
        userRole: userRoleStore.userRole,
      } as StartScenarioRequest);
      if (response.status === 200) {
        const data = response.data as StartScenarioResponse;
        setDescription(data.description);
        chatHistoryStore.setHistory(data.history);
      } else {
        navigate('/');
      }
    }
    fetchData();
  }, [id]);

  function onRetry() {
    //TODO: Implement logic for resetting scenario
    setDisableRetry(true);
  }

  function onFeedback() {
    setOpenFeedback(true);
  }
  async function submitMessage(message: string, timestamp: number) {
    const response = await api.post(`/scenarios/submit-answer/${id}`, {
      answer: message,
      timestamp,
    } as SubmitAnswerRequest);
    if (response.status === 200) {
      const data = response.data as SubmitAnswerResponse;
      //TODO: Update when Submitanswerresponse is changed based on faulty answers etc.
      chatHistoryStore.addTurn(data.userTurn);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      chatHistoryStore.addTurn(data.chatbotTurn);
      chatHistoryStore.setInstruction(data.instruction);
      setDisableRetry(false);
    } else {
      console.log('Error submitting message');
    }
  }
 return (
  <div className="flex h-dvh flex-col overflow-hidden">
    <ChatHeader
      description={description}
      onRetry={onRetry}
      onFeedback={onFeedback}
      disableRetry={disableRetry}
    />
    
    <div className='flex flex-row flex-1 min-h-0'> 
      <div className="flex flex-col flex-1 min-w-0"> 
        <div className="flex-1 min-h-0">
          <ChatWindowComponent instruction={chatHistoryStore.intruction} />
        </div>
        <div className="shrink-0">
          <MessageInputComponent onSubmit={submitMessage}/>
        </div>
      </div>

      {!isMobile && (
        <div className="w-100 shrink-0 border-l border-gray-200 overflow-y-auto">
          <FeedbackWindow/>
        </div>
      )}
      {isMobile && (
        <Drawer defaultOpen={false} open={openFeedback} onOpenChange={() => setOpenFeedback(!openFeedback)} direction='right'>
          <DrawerContent>
            <FeedbackWindow/>
          </DrawerContent>
          
        </Drawer>
      )}
    </div>
  </div>
);
}

export default withDeviceType(Chatinterface as React.FC);
