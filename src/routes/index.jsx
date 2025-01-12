import { createBrowserRouter } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import StandaloneRoutes from './StandAloneRoutes';
// ==============================|| ROUTING RENDER ||============================== //
const router = createBrowserRouter([AuthenticationRoutes,MainRoutes ,StandaloneRoutes], {
  basename: import.meta.env.VITE_APP_BASE_NAME
});

export default router;
