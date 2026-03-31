import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import { Mic, Send } from 'lucide-react';
import { useState } from 'react';

interface MessageInputComponentProps {
  onSubmit: (message: string, timestamp: number) => void;
  disableSubmit: boolean;
}
export default function MessageInputComponent({
  onSubmit,
  disableSubmit,

}: MessageInputComponentProps) {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      const timestamp = Date.now();
      onSubmit(trimmedMessage, timestamp);
      setMessage(''); // Clear the box after sending
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <div className="border-t-2 p-6">
      <InputGroup>
        <InputGroupTextarea
          id="textarea"
          placeholder="Type your radio transmission here... (Press 'Enter' to send)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-20"
          disabled={disableSubmit}
        />
        <InputGroupAddon align="inline-end">
          <div className="ml-auto flex flex-col items-center gap-2">
            <InputGroupButton
              variant="default"
              size="sm"
              onClick={handleSendMessage}
              disabled={disableSubmit}
            >
              <Send className="h-4 w-4" />
            </InputGroupButton>
            <InputGroupButton variant="ghost" size="sm" disabled={disableSubmit}>
              <Mic className="h-4 w-4" />
            </InputGroupButton>
          </div>
        </InputGroupAddon>
      </InputGroup>
      <span className="text-sm font-bold">Tips:</span>{' '}
      <span className="text-sm font-light italic">
        {' '}
        Use proper radio protocol including vessel names, positions, and
        standard phrases like "OVER" and "OUT"
      </span>
    </div>
  );
}
