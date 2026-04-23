import { AnswerAccuracy } from '@shared/scenarios/model';
import { CircleCheck, CircleCheckBig, CircleX } from 'lucide-react';

interface MessageBubbleProps {
  userMessage: string;
  timestamp: number;
  feedbackContent: string;
  feedbackAccuracy: AnswerAccuracy;
}

export default function FeedbackBubble({
  userMessage,
  timestamp,
  feedbackContent,
  feedbackAccuracy,
}: MessageBubbleProps) {
  const time = new Date(timestamp).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const bubbleStyleMap = {
    [AnswerAccuracy.Correct]: ' bg-green-50 text-green-900 border-green-200 dark:bg-green-950 dark:border-green-900 dark:text-green-300',
    [AnswerAccuracy.Incorrect]: ' bg-red-100 text-red-900 border-red-200 dark:bg-red-950 dark:border-red-900 dark:text-red-300',
    [AnswerAccuracy.PartiallyCorrect]: ' bg-yellow-100 text-yellow-900 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-900 dark:text-yellow-300',
  }
  const textStyleMap = {
    [AnswerAccuracy.Correct]: 'text-green-500',
    [AnswerAccuracy.Incorrect]: 'text-red-500',
    [AnswerAccuracy.PartiallyCorrect]: 'text-yellow-500',
  }
  const bubbleStyle = bubbleStyleMap[feedbackAccuracy];
  const textStyle = textStyleMap[feedbackAccuracy];

  return (
    <div className={`mb-4 flex flex-col gap-1`}>
      {/* Label */}
      <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
        {feedbackAccuracy === AnswerAccuracy.Correct ? (
          <span className={`flex items-center gap-1 ${textStyle}`}>
            <CircleCheckBig className="h-4 w-4" />
            Correct
          </span>
        ) : feedbackAccuracy === AnswerAccuracy.PartiallyCorrect ? (
          <span className={`flex items-center gap-1 ${textStyle}`}>
            <CircleCheck className="h-4 w-4" />
            Partially correct
          </span>
        ) : (
          <span className={`flex items-center gap-1 ${textStyle}`}>
            <CircleX className="h-4 w-4" />
            Incorrect
          </span>
        )}
      </span>

      {/* Bubble */}
      <div
        className={`w-full rounded-2xl border px-4 py-2 shadow-sm ${bubbleStyle}`}
      >
        <p className="text-sm leading-relaxed italic">"{userMessage}"</p>
        <p className="text-sm leading-relaxed">{feedbackContent}</p>
      </div>

      {/* Timestamp */}
      <span className="text-muted-foreground text-[10px] opacity-70">
        {time}
      </span>
    </div>
  );
}
