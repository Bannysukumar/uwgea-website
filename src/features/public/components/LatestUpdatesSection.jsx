import { Box, Container, Typography, Card, CardContent, CardMedia, Button, Chip, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { formatDateTime } from '@/utils/formatters';
import { FadeIn } from '@/features/public/components/AnimatedCounter';

function UpdateCard({ item, to }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {item.image_url && (
        <CardMedia component="img" height="160" image={item.image_url} alt={item.title} sx={{ objectFit: 'cover' }} />
      )}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {item.category && <Chip size="small" label={item.category} sx={{ mb: 1, alignSelf: 'flex-start' }} />}
        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ flexGrow: 1 }}>
          {item.title}
        </Typography>
        {item.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} noWrap>
            {item.description}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary">
          {formatDateTime(item.created_at)}
        </Typography>
        <Button component={RouterLink} to={to} size="small" sx={{ mt: 2, alignSelf: 'flex-start' }}>
          Read More
        </Button>
      </CardContent>
    </Card>
  );
}

export default function LatestUpdatesSection({ news, videos, orders }) {
  const combined = [
    ...news.map((n) => ({ ...n, category: n.category || 'News', link: `/news-media/${n.id}` })),
    ...videos.map((v) => ({ ...v, category: 'Video', image_url: v.image_url || v.thumbnail_url, link: '/news-media' })),
    ...orders.slice(0, 3).map((o) => ({ ...o, category: o.category || 'GO', link: '/government-orders' })),
  ].slice(0, 6);

  return (
    <Box sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Latest Updates
          </Typography>
          <Button component={RouterLink} to="/news-media">
            View All
          </Button>
        </Stack>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
          {combined.map((item) => (
            <FadeIn key={item.id + item.category}>
              <UpdateCard item={item} to={item.link} />
            </FadeIn>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
