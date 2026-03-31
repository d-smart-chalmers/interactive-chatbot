import { use, useEffect, useRef, useState } from 'react';
import { api } from '~/service/api';
import type {
  GetFeedbackResponse,
  GetNextTurnResponse,
  RetryScenarioResponse,
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
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from '~/components/ui/drawer';

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
  const [disableSubmit, setDisableSubmit] = useState(
    chatHistoryStore.scenarioEnded,
  );
  const [mounted, setMounted] = useState(false);
  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) {
      return;
    }
    hasFetched.current = true;
    setMounted(true);
    async function fetchData() {
      const response = await api.post(`/scenarios/start-scenario/${id}`, {
        userRole: userRoleStore.userRole,
      } as StartScenarioRequest);
      if (response.status === 200) {
        const data = response.data as StartScenarioResponse;
        setDescription(data.description);
        chatHistoryStore.setHistory(data.history);
        if (data.newScenario) {
          chatHistoryStore.setScenarioEnded(false);
          setDisableSubmit(false);
          setDisableRetry(true);
        } else {
          setDisableRetry(false);
        }
      } else {
        navigate('/');
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    if (chatHistoryStore.scenarioEnded) {
      setDisableSubmit(true);
      setDisableRetry(false);
    }
  }, [chatHistoryStore.scenarioEnded]);

  async function onRetry() {
    setDisableRetry(true);
    setDisableSubmit(false);
    chatHistoryStore.setScenarioEnded(false);
    const response = await api.post(`/scenarios/retry-scenario`);
    if (response.status === 200) {
      const data = response.data as RetryScenarioResponse;
      chatHistoryStore.setHistory(data.history);
    }
  }

  function onFeedback() {
    setOpenFeedback(true);
  }
  async function submitMessage(message: string, timestamp: number) {
    setDisableSubmit(true);
    const submitResponse = await api.post(`/scenarios/submit-answer/${id}`, {
      answer: message,
      timestamp,
    } as SubmitAnswerRequest);

    if (submitResponse.status === 200) {
      const data = submitResponse.data as SubmitAnswerResponse;
      const userTurnId = data.userTurn.id;
      chatHistoryStore.addTurn(data.userTurn);
      setDisableRetry(false);

      await new Promise((resolve) => setTimeout(resolve, 500));
      const feedbackResponse = await api.get(
        `/scenarios/get-feedback/${userTurnId}`,
      );
      if (feedbackResponse.status === 200) {
        const feedbackData = feedbackResponse.data as GetFeedbackResponse;
        chatHistoryStore.updateTurn(feedbackData.turnWithFeedback);
        if (feedbackData.turnWithFeedback.correct) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const nextTurnResponse = await api.get(`/scenarios/get-next-turn`);
          if (nextTurnResponse.status === 200) {
            const nextTurnData = nextTurnResponse.data as GetNextTurnResponse;
            if (
              nextTurnData.instruction === '' ||
              nextTurnData.chatbotTurn === undefined
            ) {
              chatHistoryStore.setScenarioEnded(true);
            } else {
              chatHistoryStore.setInstruction(nextTurnData.instruction);
              chatHistoryStore.addTurn(nextTurnData.chatbotTurn);
              setDisableSubmit(false);
            }
          } else {
            console.log('Error getting next turn');
          }
        } else {
          setDisableSubmit(false);
        }
      } else {
        console.log('Error getting feedback');
      }
    } else {
      console.log('Error submitting message');
    }
  }
  if (!mounted) {
    return <div className="flex h-screen items-center justify-center"></div>; //empty screen before mount to avoid hydration error
  }
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <ChatHeader
        description={description}
        onRetry={onRetry}
        onFeedback={onFeedback}
        disableRetry={disableRetry}
      />

      <div className="flex min-h-0 flex-1 flex-row">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="min-h-0 flex-1">
            <ChatWindowComponent instruction={chatHistoryStore.intruction} />
          </div>
          <div className="shrink-0">
            <MessageInputComponent
              onSubmit={submitMessage}
              disableSubmit={disableSubmit}
            />
          </div>
        </div>

        {!isMobile && (
          <div className="w-100 shrink-0 overflow-y-auto border-l">
            <FeedbackWindow />
          </div>
        )}
        {isMobile && (
          <Drawer
            defaultOpen={false}
            open={openFeedback}
            onOpenChange={() => setOpenFeedback(!openFeedback)}
            direction="right"
          >
            <DrawerTitle aria-describedby="Real-time feedback" />
            <DrawerContent>
              <DrawerDescription className="sr-only">
                Track your performance and protocol adherence
              </DrawerDescription>
              <FeedbackWindow />
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </div>
  );
}

export default withDeviceType(Chatinterface as React.FC);
