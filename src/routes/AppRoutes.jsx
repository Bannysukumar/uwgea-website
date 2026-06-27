import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import { ProtectedRoute, PermissionRoute } from './ProtectedRoute';
import ResourceListPage from '@/features/shared/ResourceListPage';
import ResourceFormPage from '@/features/shared/ResourceFormPage';
import { MODULES } from '@/config/modules';

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const AnalyticsPage = lazy(() => import('@/features/analytics/pages/AnalyticsPage'));
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'));
const PermissionsPage = lazy(() => import('@/features/permissions/pages/PermissionsPage'));
const LogsPage = lazy(() => import('@/features/logs/pages/LogsPage'));
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'));
const UsersPage = lazy(() => import('@/features/users/pages/UsersPage'));
const PlansPage = lazy(() => import('@/features/subscriptions/pages/PlansPage'));
const PlanFormPage = lazy(() => import('@/features/subscriptions/pages/PlanFormPage'));
const SubscribersPage = lazy(() => import('@/features/subscriptions/pages/SubscribersPage'));
const TrialSettingsPage = lazy(() => import('@/features/subscriptions/pages/TrialSettingsPage'));
const PaymentSettingsPage = lazy(() => import('@/features/subscriptions/pages/PaymentSettingsPage'));

const Loader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
    <CircularProgress />
  </Box>
);

const CUSTOM_ROUTES = new Set(['users']);

const moduleRoutes = Object.keys(MODULES)
  .filter((key) => !CUSTOM_ROUTES.has(key))
  .flatMap((key) => [
    <Route
      key={`${key}-list`}
      path={`/${key}`}
      element={
        <PermissionRoute module={key}>
          <ResourceListPage moduleKey={key} />
        </PermissionRoute>
      }
    />,
    <Route
      key={`${key}-new`}
      path={`/${key}/new`}
      element={
        <PermissionRoute module={key} action="write">
          <ResourceFormPage moduleKey={key} />
        </PermissionRoute>
      }
    />,
    <Route
      key={`${key}-edit`}
      path={`/${key}/:id/edit`}
      element={
        <PermissionRoute module={key} action="edit">
          <ResourceFormPage moduleKey={key} />
        </PermissionRoute>
      }
    />,
  ]);

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="/users" element={<PermissionRoute module="users"><UsersPage /></PermissionRoute>} />
          <Route path="/users/new" element={<PermissionRoute module="users" action="write"><ResourceFormPage moduleKey="users" /></PermissionRoute>} />
          <Route path="/users/:id/edit" element={<PermissionRoute module="users" action="edit"><ResourceFormPage moduleKey="users" /></PermissionRoute>} />
          {moduleRoutes}
          <Route path="/analytics" element={<PermissionRoute module="analytics"><AnalyticsPage /></PermissionRoute>} />
          <Route path="/subscription-plans" element={<PermissionRoute module="subscription_plans"><PlansPage /></PermissionRoute>} />
          <Route path="/subscription-plans/new" element={<PermissionRoute module="subscription_plans" action="write"><PlanFormPage /></PermissionRoute>} />
          <Route path="/subscription-plans/:id/edit" element={<PermissionRoute module="subscription_plans" action="edit"><PlanFormPage /></PermissionRoute>} />
          <Route path="/subscribers" element={<PermissionRoute module="subscribers"><SubscribersPage /></PermissionRoute>} />
          <Route path="/trial-settings" element={<PermissionRoute module="trial_settings"><TrialSettingsPage /></PermissionRoute>} />
          <Route path="/payment-gateway" element={<PermissionRoute module="payment_gateway"><PaymentSettingsPage /></PermissionRoute>} />
          <Route path="/settings" element={<PermissionRoute module="settings"><SettingsPage /></PermissionRoute>} />
          <Route path="/permissions" element={<PermissionRoute module="permissions"><PermissionsPage /></PermissionRoute>} />
          <Route path="/logs" element={<PermissionRoute module="logs"><LogsPage /></PermissionRoute>} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
