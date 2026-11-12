import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/common/ToastContext';
import { InitialLoader } from './components/common/InitialLoader';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { PortalLayout } from './layouts/PortalLayout';

// Pages
import { LandingPage } from './pages/public/LandingPage';
import { SignInPage } from './pages/public/SignInPage';
import { ApplyPage } from './pages/public/ApplyPage';
import { DashboardPage } from './pages/portal/DashboardPage';
import { PortfolioPage } from './pages/portal/PortfolioPage';
import { TradePage } from './pages/portal/TradePage';
import { OrdersPage } from './pages/portal/OrdersPage';
import { ActivityPage } from './pages/portal/ActivityPage';
import { TransfersPage } from './pages/portal/TransfersPage';
import { StatementsPage } from './pages/portal/StatementsPage';
import { SettingsPage } from './pages/portal/SettingsPage';
import { SupportPage } from './pages/portal/SupportPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
    ],
  },
  {
    path: '/signin',
    element: <SignInPage />,
  },
  {
    path: '/apply',
    element: <ApplyPage />,
  },
  {
    path: '/app',
    element: <PortalLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'portfolio',
        element: <PortfolioPage />,
      },
      {
        path: 'trade',
        element: <TradePage />,
      },
      {
        path: 'orders',
        element: <OrdersPage />,
      },
      {
        path: 'activity',
        element: <ActivityPage />,
      },
      {
        path: 'transfers',
        element: <TransfersPage />,
      },
      {
        path: 'statements',
        element: <StatementsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'support',
        element: <SupportPage />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminDashboardPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default function App() {
  const [showInitialLoader, setShowInitialLoader] = useState(true);

  return (
    <ToastProvider>
      {showInitialLoader ? (
        <InitialLoader onComplete={() => setShowInitialLoader(false)} durationMs={1600} />
      ) : (
        <RouterProvider router={router} />
      )}
    </ToastProvider>
  );
}
