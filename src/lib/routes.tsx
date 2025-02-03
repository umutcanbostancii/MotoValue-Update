import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Landing } from '../components/pages/Landing';
import { LoginPage } from '../components/auth/LoginPage';
import { RegisterPage } from '../components/auth/RegisterPage';
import { Dashboard } from '../components/pages/Dashboard';
import { Calculator } from '../components/pages/Calculator';
import { History } from '../components/pages/History';
import { Guide } from '../components/pages/Guide';
import { Settings } from '../components/pages/Settings';
import { Admin } from '../components/pages/Admin';

export const router = createBrowserRouter([
  {
    path: '/',
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
    path: '/landing',
    element: <Landing />,
  },
  {
    path: '/auth/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/register',
    element: <RegisterPage />,
  },
]);