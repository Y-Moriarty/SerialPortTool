import Home from '@/pages/Home';
import { createBrowserRouter } from 'react-router-dom';
// const Home = lazy(() => import("@/pages/Home"))
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  }
]);

export default router;
