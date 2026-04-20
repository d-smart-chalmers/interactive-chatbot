import { TurnType, type UserTurn } from '@shared/scenarios/model';
import { useChatHistoryStore } from '~/store/state';
import FeedbackBubble from './feedbackbubbel';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function FeedbackWindow() {
  const historyStore = useChatHistoryStore();

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [historyStore.turns]);
  return (
    <div>
      <div className="relative z-2 flex min-h-22 w-full flex-col border-b-2 border-blue-200 bg-blue-100 p-4 shadow-md dark:border-cyan-900 dark:bg-cyan-950 dark:text-white dark:shadow-cyan-950/80">
        <p className="text-2xl font-bold">Real-time feedback</p>
        <p className="text-sm font-light text-zinc-500">
          {' '}
          Track your performance and protocol adherence
        </p>
      </div>
      <div className="p-4">
        <AnimatePresence initial={false}>
          {historyStore.turns.map((turn) =>
            turn.type === TurnType.User &&
            (turn as UserTurn).feedback !== undefined ? (
              <motion.div
                layout
                key={turn.id}
                initial={{ opacity: 0.5, scale: 0.8, y: 200 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  layout: { type: 'tween', stiffness: 10, damping: 10 },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 },
                }}
                style={{
                  originY: 1,
                }}
              >
                <FeedbackBubble
                  key={turn.id}
                  userMessage={turn.message}
                  timestamp={turn.timestamp}
                  feedbackContent={(turn as UserTurn).feedback!}
                  feedbackCorrect={(turn as UserTurn).correct!}
                />
              </motion.div>
            ) : null,
          )}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>
    </div>
  );
}
