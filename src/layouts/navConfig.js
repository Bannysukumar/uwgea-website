import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';
import ArticleIcon from '@mui/icons-material/Article';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import EventIcon from '@mui/icons-material/Event';
import PollIcon from '@mui/icons-material/Poll';
import CommentIcon from '@mui/icons-material/Comment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CampaignIcon from '@mui/icons-material/Campaign';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import DownloadIcon from '@mui/icons-material/Download';
import MapIcon from '@mui/icons-material/Map';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import BusinessIcon from '@mui/icons-material/Business';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import FeedbackIcon from '@mui/icons-material/Feedback';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import TimerIcon from '@mui/icons-material/Timer';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

import { adminPath } from '@/utils/paths';

export const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', path: adminPath(), icon: DashboardIcon, module: 'dashboard' },
  { key: 'website-settings', label: 'Website CMS', path: adminPath('/website-settings'), icon: ViewCarouselIcon, module: 'settings' },
  { key: 'website_statistics', label: 'Home Statistics', path: adminPath('/website_statistics'), icon: AnalyticsIcon, module: 'website_statistics' },
  { key: 'website_quick_actions', label: 'Quick Actions', path: adminPath('/website_quick_actions'), icon: CampaignIcon, module: 'website_quick_actions' },
  { key: 'users', label: 'Users', path: adminPath('/users'), icon: PeopleIcon, module: 'users' },
  { key: 'leaders', label: 'Leaders', path: adminPath('/leaders'), icon: StarIcon, module: 'leaders' },
  { key: 'news', label: 'News', path: adminPath('/news'), icon: ArticleIcon, module: 'news' },
  { key: 'posts', label: 'Posts', path: adminPath('/posts'), icon: DynamicFeedIcon, module: 'posts' },
  { key: 'media', label: 'Media', path: adminPath('/media'), icon: PermMediaIcon, module: 'media' },
  { key: 'gallery', label: 'Gallery', path: adminPath('/gallery'), icon: PhotoLibraryIcon, module: 'gallery' },
  { key: 'videos', label: 'Videos', path: adminPath('/videos'), icon: OndemandVideoIcon, module: 'videos' },
  { key: 'live', label: 'Live Streaming', path: adminPath('/live'), icon: LiveTvIcon, module: 'live' },
  { key: 'events', label: 'Events', path: adminPath('/events'), icon: EventIcon, module: 'events' },
  { key: 'polls', label: 'Polls', path: adminPath('/polls'), icon: PollIcon, module: 'polls' },
  { key: 'comments', label: 'Comments', path: adminPath('/comments'), icon: CommentIcon, module: 'comments' },
  { key: 'notifications', label: 'Notifications', path: adminPath('/notifications'), icon: NotificationsIcon, module: 'notifications' },
  { key: 'advertisements', label: 'Advertisements', path: adminPath('/advertisements'), icon: CampaignIcon, module: 'advertisements' },
  { key: 'banners', label: 'Banners', path: adminPath('/banners'), icon: ViewCarouselIcon, module: 'banners' },
  { key: 'downloads', label: 'Downloads', path: adminPath('/downloads'), icon: DownloadIcon, module: 'downloads' },
  { key: 'district_committees', label: 'District Committees', path: adminPath('/district_committees'), icon: MapIcon, module: 'district_committees' },
  { key: 'employee_issues', label: 'Employee Issues', path: adminPath('/employee_issues'), icon: AssessmentIcon, module: 'employee_issues' },
  { key: 'welfare_schemes', label: 'Welfare Schemes', path: adminPath('/welfare_schemes'), icon: VolunteerActivismIcon, module: 'welfare_schemes' },
  { key: 'government_orders', label: 'Government Orders', path: adminPath('/government_orders'), icon: ArticleIcon, module: 'government_orders' },
  { key: 'grievances', label: 'Grievances', path: adminPath('/grievances'), icon: FeedbackIcon, module: 'grievances' },
  { key: 'contact_messages', label: 'Contact Messages', path: adminPath('/contact_messages'), icon: CommentIcon, module: 'contact_messages' },
  { key: 'districts', label: 'Districts', path: adminPath('/districts'), icon: MapIcon, module: 'districts' },
  { key: 'mandals', label: 'Mandals', path: adminPath('/mandals'), icon: LocationCityIcon, module: 'mandals' },
  { key: 'villages', label: 'Villages', path: adminPath('/villages'), icon: HomeWorkIcon, module: 'villages' },
  { key: 'departments', label: 'Departments', path: adminPath('/departments'), icon: BusinessIcon, module: 'departments' },
  { key: 'membership', label: 'Membership', path: adminPath('/membership'), icon: CardMembershipIcon, module: 'membership' },
  { key: 'subscription_plans', label: 'Subscription Plans', path: adminPath('/subscription-plans'), icon: SubscriptionsIcon, module: 'subscription_plans' },
  { key: 'subscribers', label: 'Subscribers', path: adminPath('/subscribers'), icon: PeopleAltIcon, module: 'subscribers' },
  { key: 'trial_settings', label: 'Trial Settings', path: adminPath('/trial-settings'), icon: TimerIcon, module: 'trial_settings' },
  { key: 'payment_gateway', label: 'Payment Gateway', path: adminPath('/payment-gateway'), icon: PaymentIcon, module: 'payment_gateway' },
  { key: 'payment_transactions', label: 'Transactions', path: adminPath('/payment_transactions'), icon: ReceiptLongIcon, module: 'payment_transactions' },
  { key: 'invoices', label: 'Invoices', path: adminPath('/invoices'), icon: ReceiptLongIcon, module: 'invoices' },
  { key: 'subscription_history', label: 'Sub History', path: adminPath('/subscription_history'), icon: HistoryIcon, module: 'subscription_history' },
  { key: 'volunteers', label: 'Volunteers', path: adminPath('/volunteers'), icon: VolunteerActivismIcon, module: 'volunteers' },
  { key: 'feedback', label: 'Feedback', path: adminPath('/feedback'), icon: FeedbackIcon, module: 'feedback' },
  { key: 'reports', label: 'Reports', path: adminPath('/reports'), icon: AssessmentIcon, module: 'reports' },
  { key: 'analytics', label: 'Analytics', path: adminPath('/analytics'), icon: AnalyticsIcon, module: 'analytics' },
  { key: 'roles', label: 'Roles', path: adminPath('/roles'), icon: AdminPanelSettingsIcon, module: 'roles' },
  { key: 'permissions', label: 'Permissions', path: adminPath('/permissions'), icon: SecurityIcon, module: 'permissions' },
  { key: 'settings', label: 'Settings', path: adminPath('/settings'), icon: SettingsIcon, module: 'settings' },
  { key: 'logs', label: 'Logs', path: adminPath('/logs'), icon: HistoryIcon, module: 'logs' },
  { key: 'profile', label: 'Profile', path: adminPath('/profile'), icon: PersonIcon, module: 'profile' },
];
