import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Landing } from '../components/pages/Landing';
import { Dashboard } from '../components/pages/Dashboard';
import { Calculator } from '../components/pages/Calculator';
import { History } from '../components/pages/History';
import { Guide } from '../components/pages/Guide';
import { Settings } from '../components/pages/Settings';
import { Admin } from '../components/pages/Admin';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/dashboard',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'calculator',
        element: <Calculator />,
      },
      {
        path: 'history',
        element: <History />,
      },
      {
        path: 'guide',
        element: <Guide />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'admin',
        element: <Admin />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);