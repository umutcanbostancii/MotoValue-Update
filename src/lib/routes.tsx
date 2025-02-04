import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Landing } from '../components/pages/Landing';
import { Dashboard } from '../components/pages/Dashboard';
import { Calculator } from '../components/pages/Calculator';
import { History } from '../components/pages/History';
import { Guide } from '../components/pages/Guide';
import { Settings } from '../components/pages/Settings';
import { Admin } from '../components/pages/Admin';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
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