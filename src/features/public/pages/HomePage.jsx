import { Box } from '@mui/material';
import HeroSection from '@/features/public/components/HeroSection';
import StatisticsSection from '@/features/public/components/StatisticsSection';
import FounderSection from '@/features/public/components/FounderSection';
import MissionVisionSection from '@/features/public/components/MissionVisionSection';
import QuickActionsSection from '@/features/public/components/QuickActionsSection';
import LatestUpdatesSection from '@/features/public/components/LatestUpdatesSection';
import LeadershipPreview from '@/features/public/components/LeadershipPreview';
import {
  useWebsiteSettings,
  useWebsiteStatistics,
  useQuickActions,
  usePublicCollection,
} from '@/features/public/hooks/useWebsiteData';
import { COLLECTIONS } from '@/firebase/collections';

export default function HomePage() {
  const { settings } = useWebsiteSettings();
  const { items: stats } = useWebsiteStatistics();
  const { items: quickActions } = useQuickActions();
  const { items: news } = usePublicCollection(COLLECTIONS.NEWS, { limitCount: 4 });
  const { items: videos } = usePublicCollection(COLLECTIONS.VIDEOS, { limitCount: 2 });
  const { items: orders } = usePublicCollection(COLLECTIONS.GOVERNMENT_ORDERS, { limitCount: 2 });
  const vis = settings.section_visibility;

  return (
    <Box>
      {vis.hero !== false && <HeroSection hero={settings.hero} />}
      {vis.statistics !== false && <StatisticsSection items={stats} />}
      {vis.founder !== false && <FounderSection founder={settings.founder} />}
      {vis.mission_vision !== false && (
        <MissionVisionSection mission={settings.mission} vision={settings.vision} />
      )}
      {vis.quick_actions !== false && <QuickActionsSection actions={quickActions} />}
      {vis.latest_updates !== false && (
        <LatestUpdatesSection news={news} videos={videos} orders={orders} />
      )}
      {vis.leadership_preview !== false && <LeadershipPreview />}
    </Box>
  );
}
