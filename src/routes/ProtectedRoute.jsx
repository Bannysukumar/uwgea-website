import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAppSelector } from '@/redux/hooks';
import { selectIsSessionExpired } from '@/redux/slices/authSlice';
import { usePermissions } from '@/hooks/usePermissions';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAppSelector((s) => s.auth);
  const expired = useAppSelector(selectIsSessionExpired);
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!user || expired) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export function PermissionRoute({ module, action = 'read', children }) {
  const { can } = usePermissions();
  if (!can(module, action)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
