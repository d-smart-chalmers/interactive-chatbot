import { CircleCheckBig, CircleX } from 'lucide-react';

interface MessageBubbleProps {
  userMessage: string;
  timestamp: number;
  feedbackContent: string;
  feedbackCorrect: boolean;
}

export default function FeedbackBubble({
  userMessage,
  timestamp,
  feedbackContent,
  feedbackCorrect,
}: MessageBubbleProps) {
  const time = new Date(timestamp).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const bubbleStyle = feedbackCorrect
    ? ' bg-green-50 text-green-900 border-green-200'
    : ' bg-red-100 text-red-900 border-red-200';
  const textStyle = feedbackCorrect ? 'text-green-500' : 'text-red-500';

  return (
    <div className={`mb-4 flex flex-col gap-1`}>
      {/* Label */}
      <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
        {feedbackCorrect ? (
          <span className={`flex items-center gap-1 ${textStyle}`}>
            <CircleCheckBig className="h-4 w-4" />
            Correct
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <CircleX className="h-4 w-4" />
            Incorrect
          </span>
        )}
      </span>

      {/* Bubble */}
      <div className={`w-full rounded-2xl px-4 py-2 shadow-sm border ${bubbleStyle}`}>
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
