import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import { AnimatePresence, motion } from 'framer-motion';
import { Mic, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface MessageInputComponentProps {
  onSubmit: (message: string, timestamp: number) => void;
  disableSubmit: boolean;
}
/** 
 * Helper function used to correct common web speech recognition issues.
*/
function correctSpeechResult(text: string): string {
  const numberWords: Record<string, string> = {
    "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four",
    "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine",
  };

  return text
    .replace(/\d/g, (digit) => numberWords[digit] + " ")
    .replace(/ {2,}/g, " ") // collapse double spaces
    .trim()
    .replace(/\bbts\b/gi, "VTS")
    .replace(/\bvts\b/gi, "VTS")
    .replace(/\bmb\b/gi, "MV");
}

export default function MessageInputComponent({
  onSubmit,
  disableSubmit,
}: MessageInputComponentProps) {
  const [message, setMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      const timestamp = Date.now();
      onSubmit(trimmedMessage, timestamp);
      setMessage(''); // Clear the box after sending
    }
  };
  const handleMicrophone = () => {
    const globalWindow = window as any;
    const SpeechRecognition =
      globalWindow.SpeechRecognition || globalWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Browser not supported', {
        description: "Your browser doesn't support Speech Recognition.",
      });
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => {
      setIsSpeaking(true);
    };
    recognition.onend = () => {
      setIsSpeaking(false);
    };

    recognition.onresult = (event: any) => {
      const result: string = event.results[0][0].transcript;
      // Simple fix to avoid web speech recognition from spelling numbers as numerics and misspelling certain words
      const correctedResult = correctSpeechResult(result);
      setMessage(correctedResult);
    };
    recognition.onerror = (event: any) => {
      console.log('SpeechRecognition error', event);
      toast.error(event.message);
      setIsSpeaking(false);
    };
    recognition.start();
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <div className="border-t-2 p-6">
      <InputGroup className="relative overflow-hidden rounded-md border border-slate-200">
        {/* FRAMER MOTION OVERLAY */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-800/20 backdrop-blur-sm"
            >
              <div className="m-4 flex h-16 items-center justify-center gap-1.5">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 rounded-full bg-black"
                    animate={{
                      // Different heights for different bars to look like a real signal
                      height: [
                        '20%',
                        `${Math.random() * 60 + 40}%`,
                        '30%',
                        `${Math.random() * 40 + 20}%`,
                        '20%',
                      ],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.05,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <InputGroupTextarea
          id="textarea"
          placeholder={
            isSpeaking
              ? ''
              : "Type your radio transmission here... (Press 'Enter' to send)"
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-20"
          disabled={disableSubmit || isSpeaking}
        />

        <InputGroupAddon align="inline-end">
          <div className="ml-auto flex flex-col items-center gap-2">
            <InputGroupButton
              variant="default"
              size="sm"
              onClick={handleSendMessage}
              disabled={disableSubmit || isSpeaking}
            >
              <Send className="h-4 w-4" />
            </InputGroupButton>
            <InputGroupButton
              variant="ghost"
              size="sm"
              disabled={disableSubmit || isSpeaking}
              onClick={handleMicrophone}
            >
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
