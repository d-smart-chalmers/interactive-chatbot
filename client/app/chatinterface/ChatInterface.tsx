import { useEffect } from 'react';

interface ChatinterfaceProps {
  id: string;
}

export default function Chatinterface({ id }: ChatinterfaceProps) {
  useEffect(() => {});
  return <div>Chat interface id is: {id}</div>;
}
