export const APP_NAME = import.meta.env.VITE_APP_NAME || 'SGSW Admin';

export const SESSION_TIMEOUT_MS =
  (Number(import.meta.env.VITE_SESSION_TIMEOUT_MINUTES) || 60) * 60 * 1000;

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  STATE_ADMIN: 'state_admin',
  DISTRICT_ADMIN: 'district_admin',
  MANDAL_ADMIN: 'mandal_admin',
  VILLAGE_ADMIN: 'village_admin',
  MODERATOR: 'moderator',
  EDITOR: 'editor',
  VIEWER: 'viewer',
};

export const ROLE_LABELS = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  state_admin: 'State Admin',
  district_admin: 'District Admin',
  mandal_admin: 'Mandal Admin',
  village_admin: 'Village Admin',
  moderator: 'Moderator',
  editor: 'Editor',
  viewer: 'Viewer',
};

export const PERMISSION_ACTIONS = [
  'read',
  'write',
  'edit',
  'delete',
  'export',
  'import',
  'approve',
  'reject',
];

export const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'pending', label: 'Pending' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];
