import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
    index('routes/home.tsx'),
    route('scenario/:id', 'routes/chatroom.tsx')
] satisfies RouteConfig;
