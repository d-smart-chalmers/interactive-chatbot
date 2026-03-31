import { useEffect, useRef } from 'react';
import { useChatHistoryStore, useUserRoleStore } from '~/store/state';
import MessageBubble from './messagebubble';
import { TurnType, UserRole } from '@shared/scenarios/model';
import { AnimatePresence, motion } from 'framer-motion';

interface ChatWindowComponentProps {
  instruction: string;
}

export default function ChatWindowComponent({
  instruction,
}: ChatWindowComponentProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const userRoleStore = useUserRoleStore();
  const historyStore = useChatHistoryStore();
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [historyStore.turns]);
  return (
    <div className="flex h-full w-full flex-col">
      <AnimatePresence mode="wait">
        {!historyStore.scenarioEnded ? (
          <motion.div
            key={instruction}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative z-2 flex w-full shrink-0 flex-col border-b border-amber-200 bg-amber-50 p-5 text-amber-800 shadow-md dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
          >
            <span className="font-bold">Instructions</span>
            {instruction}
          </motion.div>
        ) : (
          <motion.div
            key="ended"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative z-2 flex w-full shrink-0 flex-col border-b border-red-200 bg-red-50 p-5 text-red-800 shadow-md dark:border-red-900 dark:bg-red-950 dark:text-red-200"
          >
            <span className="font-bold">Scenario ended</span>
            {'Navigate back to the home screen to pick another scenario.'}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="dark:bg-card flex min-h-0 flex-1 flex-col justify-end gap-4 overflow-y-auto bg-gray-50 p-5">
        <AnimatePresence initial={false}>
          {historyStore.turns.map((turn) => {
            const isUser = turn.type === TurnType.User;

            return turn.message !== '' ? (
              <motion.div
                layout
                key={turn.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  layout: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 },
                }}
                style={{
                  originX: isUser ? 0.5 : 0,
                  originY: 1,
                }}
              >
                <MessageBubble
                  content={turn.message}
                  role={
                    isUser
                      ? userRoleStore.userRole
                      : userRoleStore.userRole === UserRole.Vessel
                        ? UserRole.VTS
                        : UserRole.Vessel
                  }
                  timestamp={turn.timestamp}
                  messageType={turn.type}
                />
              </motion.div>
            ) : null;
          })}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>
    </div>
  );
}
