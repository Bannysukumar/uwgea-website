import { useAppSelector } from '@/redux/hooks';
import { can } from '@/utils/permissions';

export const usePermissions = () => {
  const permissions = useAppSelector((s) => s.auth.permissions);
  const profile = useAppSelector((s) => s.auth.profile);

  return {
    permissions,
    profile,
    can: (module, action = 'read') => can(permissions, module, action),
    role: profile?.role,
  };
};
