import { TurnType, UserRole } from '@shared/scenarios/model';

interface MessageBubbleProps {
  content: string;
  role?: UserRole;
  timestamp: number;
  messageType: TurnType;
}

export default function MessageBubble({
  content,
  role,
  timestamp,
  messageType,
}: MessageBubbleProps) {
  const isVessel = role === UserRole.Vessel;
  const isUser = messageType === TurnType.User;
  const stylingMap = {
    user: 'bg-blue-500 text-white self-end rounded-br-none',
    bot: 'bg-slate-200 dark:bg-slate-700 dark:text-white text-slate-900 self-start rounded-bl-none',
  };
  const bubbleStyle = isUser ? stylingMap.user : stylingMap.bot;
  const time = new Date(timestamp).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return (
    <div
      className={`mb-4 flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}
    >
      {/* Label */}
      <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
        {isVessel ? 'Vessel' : 'VTS'}
      </span>

      {/* Bubble */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${bubbleStyle}`}
      >
        <p className="text-sm leading-relaxed">{content}</p>
      </div>

      {/* Timestamp */}
      <span className="text-muted-foreground text-[10px] opacity-70">
        {time}
      </span>
    </div>
  );
}
