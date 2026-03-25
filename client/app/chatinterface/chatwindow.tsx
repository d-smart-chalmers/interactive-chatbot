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
      <div className="flex w-full shrink-0 flex-col border-b shadow-md relative z-2 border-amber-200 bg-amber-50 p-5 text-amber-800 dark:bg-amber-950 dark:border-amber-900 dark:text-amber-200">
        <span className="font-bold">Instructions</span>
        {instruction}
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-end gap-4 overflow-y-auto bg-gray-50 dark:bg-card p-5">
        <AnimatePresence initial={false}>
          {historyStore.turns.map((turn) => {
            const isUser = turn.type === TurnType.User;

            return (
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
                  originX: isUser ? 1 : 0,
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
            );
          })}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>
    </div>
  );
}
