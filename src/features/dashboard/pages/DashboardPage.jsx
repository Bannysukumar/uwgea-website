import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemText, Skeleton } from '@mui/material';
import Chart from 'react-apexcharts';
import { motion } from 'framer-motion';
import { createCrudService } from '@/firebase/firestoreService';
import { COLLECTIONS } from '@/firebase/collections';
import PageHeader from '@/components/common/PageHeader';
import { brand } from '@/theme';
import { formatDateTime } from '@/utils/formatters';

const StatCard = ({ title, value, loading }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
    <Card sx={{ background: brand.gradient, color: '#fff' }}>
      <CardContent>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={800}>
          {loading ? <Skeleton width={60} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} /> : value}
        </Typography>
      </CardContent>
    </Card>
  </motion.div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState({});
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const services = {
        users: createCrudService(COLLECTIONS.USERS),
        posts: createCrudService(COLLECTIONS.POSTS),
        news: createCrudService(COLLECTIONS.NEWS),
        videos: createCrudService(COLLECTIONS.VIDEOS),
        events: createCrudService(COLLECTIONS.EVENTS),
        notifications: createCrudService(COLLECTIONS.NOTIFICATIONS),
        polls: createCrudService(COLLECTIONS.POLLS),
        downloads: createCrudService(COLLECTIONS.DOWNLOADS),
        live: createCrudService(COLLECTIONS.LIVE),
      };

      try {
        const [
          totalUsers,
          todayUsers,
          todayPosts,
          todayNews,
          todayVideos,
          todayEvents,
          todayNotifications,
          todayPolls,
          totalDownloads,
          liveCount,
          users,
        ] = await Promise.all([
          services.users.count(),
          services.users.countToday(),
          services.posts.countToday(),
          services.news.countToday(),
          services.videos.countToday(),
          services.events.countToday(),
          services.notifications.countToday(),
          services.polls.countToday(),
          services.downloads.count(),
          services.live.count([['is_live', '==', true]]),
          services.users.list({ pageSize: 5 }),
        ]);

        setStats({
          totalUsers,
          todayUsers,
          todayPosts,
          todayNews,
          todayVideos,
          todayEvents,
          todayNotifications,
          todayPolls,
          totalDownloads,
          liveCount,
        });
        setRecentUsers(users.items);
      } catch {
        // demo zeros if rules block
        setStats({});
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const chartOptions = {
    chart: { toolbar: { show: false }, foreColor: '#888' },
    xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    colors: ['#5B4CFF', '#00C9A7'],
    stroke: { curve: 'smooth' },
  };

  const userGrowth = {
    options: chartOptions,
    series: [
      { name: 'Users', data: [12, 18, 22, 28, 35, 42, stats.todayUsers || 48] },
      { name: 'Posts', data: [5, 8, 12, 15, 20, 25, stats.todayPosts || 30] },
    ],
  };

  const cards = [
    ['Today Users', stats.todayUsers],
    ['Today Posts', stats.todayPosts],
    ['Today News', stats.todayNews],
    ['Today Videos', stats.todayVideos],
    ['Today Events', stats.todayEvents],
    ['Today Notifications', stats.todayNotifications],
    ['Today Polls', stats.todayPolls],
    ['Total Downloads', stats.totalDownloads],
    ['Total Users', stats.totalUsers],
    ['Live Streams', stats.liveCount],
  ];

  return (
    <Box>
      <PageHeader title="Dashboard" subtitle="SGSW — realtime overview" />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        {cards.map(([title, value]) => (
          <StatCard key={title} title={title} value={value ?? 0} loading={loading} />
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 2 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Growth & Activity
              </Typography>
              <Chart options={userGrowth.options} series={userGrowth.series} type="area" height={320} />
            </CardContent>
          </Card>
        <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Latest Registered Users
              </Typography>
              <List dense>
                {recentUsers.map((u) => (
                  <ListItem key={u.id} divider>
                    <ListItemText primary={u.name || u.email} secondary={formatDateTime(u.created_at)} />
                  </ListItem>
                ))}
                {!recentUsers.length && !loading && (
                  <Typography variant="body2" color="text.secondary">
                    No users yet
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
      </Box>
    </Box>
  );
}
