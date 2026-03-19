import type { Route } from './+types/home';
import Dashboard from '~/dashboard/Dashboard';

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'Maritime Communications Trainer' },
    {
      name: 'description',
      content:
        'Practice and master standard maritime radio protocols including distress calls, position reports, and weather communications in realistic scenarios.',
    },
  ];
}

export default function Home() {
  return <Dashboard />;
}
