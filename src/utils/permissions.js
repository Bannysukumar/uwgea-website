import { ROLES, PERMISSION_ACTIONS } from './constants';

const ALL_MODULES = [
  'dashboard',
  'users',
  'leaders',
  'news',
  'posts',
  'media',
  'gallery',
  'videos',
  'live',
  'events',
  'polls',
  'comments',
  'notifications',
  'advertisements',
  'banners',
  'downloads',
  'districts',
  'mandals',
  'villages',
  'departments',
  'membership',
  'volunteers',
  'feedback',
  'reports',
  'analytics',
  'subscription_plans',
  'subscribers',
  'trial_settings',
  'payment_gateway',
  'payment_transactions',
  'subscription_history',
  'invoices',
  'district_committees',
  'employee_issues',
  'welfare_schemes',
  'government_orders',
  'grievances',
  'contact_messages',
  'website_statistics',
  'website_quick_actions',
  'sponsors',
  'website_settings',
  'roles',
  'permissions',
  'settings',
  'logs',
  'profile',
];

const fullAccess = () =>
  ALL_MODULES.reduce((acc, mod) => {
    acc[mod] = PERMISSION_ACTIONS.reduce((a, p) => ({ ...a, [p]: true }), {});
    return acc;
  }, {});

const readOnly = () =>
  ALL_MODULES.reduce((acc, mod) => {
    acc[mod] = PERMISSION_ACTIONS.reduce((a, p) => ({ ...a, [p]: p === 'read' }), {});
    return acc;
  }, {});

const editorAccess = () =>
  ALL_MODULES.reduce((acc, mod) => {
    acc[mod] = {
      read: true,
      write: true,
      edit: true,
      delete: false,
      export: true,
      import: false,
      approve: mod === 'posts' || mod === 'news',
      reject: mod === 'posts' || mod === 'news',
    };
    return acc;
  }, {});

export const DEFAULT_ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: fullAccess(),
  [ROLES.ADMIN]: fullAccess(),
  [ROLES.STATE_ADMIN]: editorAccess(),
  [ROLES.DISTRICT_ADMIN]: editorAccess(),
  [ROLES.MANDAL_ADMIN]: readOnly(),
  [ROLES.VILLAGE_ADMIN]: readOnly(),
  [ROLES.MODERATOR]: editorAccess(),
  [ROLES.EDITOR]: editorAccess(),
  [ROLES.VIEWER]: readOnly(),
};

export const can = (permissions, module, action = 'read') => {
  if (!permissions) return false;
  if (permissions[module]?.[action]) return true;
  if (action !== 'read' && permissions[module]?.write) return true;
  return false;
};

export const getModules = () => ALL_MODULES;
