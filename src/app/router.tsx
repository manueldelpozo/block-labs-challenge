import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';
import { AppShell } from '@/components/layout/AppShell';
import { LoadingFallback } from '@/components/common/LoadingFallback';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

const Dashboard = lazy(() => import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const Profile = lazy(() => import('@/pages/Profile').then((m) => ({ default: m.Profile })));
const Settings = lazy(() => import('@/pages/Settings').then((m) => ({ default: m.Settings })));
const Deposit = lazy(() => import('@/pages/Deposit').then((m) => ({ default: m.Deposit })));
const NotFound = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFound })));

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <AppShell />
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback message="Retrieving dashboard metrics..." />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<LoadingFallback message="Loading user profile..." />}>
            <Profile />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<LoadingFallback message="Loading settings configurations..." />}>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: 'deposit',
        element: (
          <Suspense fallback={<LoadingFallback message="Preparing deposit form..." />}>
            <Deposit />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<LoadingFallback message="Locating resource..." />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);
