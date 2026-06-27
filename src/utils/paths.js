/** Admin panel base path — public site uses root routes */
export const ADMIN_BASE = '/admin';

export const adminPath = (segment = '') => {
  if (!segment) return ADMIN_BASE;
  return `${ADMIN_BASE}${segment.startsWith('/') ? segment : `/${segment}`}`;
};

export const PUBLIC_ROUTES = {
  home: '/',
  about: '/about',
  leadership: '/leadership',
  districtCommittees: '/district-committees',
  employeeIssues: '/employee-issues',
  welfareSchemes: '/welfare-schemes',
  newsMedia: '/news-media',
  governmentOrders: '/government-orders',
  gallery: '/gallery',
  joinMembership: '/join-membership',
  contact: '/contact',
  grievance: '/grievance',
  privacy: '/privacy',
  terms: '/terms',
  login: '/login',
  register: '/register',
};
