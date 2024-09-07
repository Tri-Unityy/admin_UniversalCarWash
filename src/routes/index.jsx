import { createBrowserRouter } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import LoginRoutes from './AuthenticationRoutes';
import StandaloneRoutes from './StandAloneRoutes';
// ==============================|| ROUTING RENDER ||============================== //
const router = createBrowserRouter([MainRoutes, LoginRoutes,StandaloneRoutes], {
  basename: import.meta.env.VITE_APP_BASE_NAME
});

export default router;
