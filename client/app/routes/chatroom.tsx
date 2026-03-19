import Chatinterface from '~/chatinterface/ChatInterface';
import type { Route } from './+types/chatroom';

export default function Chatroom({ params }: Route.LoaderArgs) {
  return <Chatinterface id={params.id} />;
}
