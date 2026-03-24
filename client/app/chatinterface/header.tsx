import { ArrowLeft } from 'lucide-react';
import { RotateCcw } from 'lucide-react';
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '~/components/ui/button';

interface ChatHeaderProps {
  description: string;
  onRetry: () => void;
  onFeedback: () => void;
  disableRetry: boolean;
}

export default function ChatHeader({ description, onRetry, onFeedback, disableRetry}: ChatHeaderProps) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center border-t-2 border-b-2 pr-2">
      <Button variant={'ghost'} className='m-4' onClick={() => navigate('/')}>
        <ArrowLeft />
      </Button>
      <span className="grow justify-center">{description}</span>
      <div className="m-4 flex flex-col items-center justify-center gap-2">
        <Button variant={'outline'} onClick={onRetry} disabled={disableRetry}>
          <RotateCcw />
          Retry
        </Button>
        <Button variant={'outline'} className='md:hidden' onClick={onFeedback} >
          <MessageSquare/>
          Feedback
        </Button>
      </div>
    </div>
  );
}
