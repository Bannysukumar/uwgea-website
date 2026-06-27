import { Box, Container, Typography, Card, CardContent, CardMedia, Button, TextField, Stack, Skeleton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { formatDateTime } from '@/utils/formatters';
import { FadeIn } from '@/features/public/components/AnimatedCounter';

export function PublicPageHero({ title, subtitle }) {
  return (
    <Box sx={{ py: { xs: 5, md: 7 }, background: 'linear-gradient(135deg, #B71C1C 0%, #7F0000 100%)', color: '#fff' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" fontWeight={800} gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 720 }}>
            {subtitle}
          </Typography>
        )}
      </Container>
    </Box>
  );
}

export function ContentGrid({ items, loading, basePath, emptyMessage = 'No content available yet.' }) {
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={2}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={120} />
          ))}
        </Stack>
      </Container>
    );
  }

  if (!items.length) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography textAlign="center" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
        {items.map((item) => (
          <FadeIn key={item.id}>
            <Card sx={{ height: '100%' }}>
              {(item.image_url || item.thumbnail_url) && (
                <CardMedia component="img" height="160" image={item.image_url || item.thumbnail_url} alt={item.title || item.name} />
              )}
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {item.title || item.name}
                </Typography>
                {(item.description || item.designation || item.district) && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {item.description || item.designation || item.district}
                  </Typography>
                )}
                {item.created_at && (
                  <Typography variant="caption" color="text.secondary">
                    {formatDateTime(item.created_at)}
                  </Typography>
                )}
                {basePath && (
                  <Button component={RouterLink} to={`${basePath}/${item.id}`} size="small" sx={{ mt: 1 }}>
                    View Details
                  </Button>
                )}
                {item.file_url && (
                  <Button href={item.file_url} target="_blank" rel="noopener" size="small" sx={{ mt: 1, ml: 1 }}>
                    Download
                  </Button>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </Box>
    </Container>
  );
}

export function RichTextSection({ html, fallback }) {
  const content = html || fallback;
  if (!content) return null;
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography component="div" sx={{ lineHeight: 1.9, '& p': { mb: 2 } }} dangerouslySetInnerHTML={{ __html: content }} />
    </Container>
  );
}

export function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <Container maxWidth="lg" sx={{ pt: 3 }}>
      <TextField fullWidth placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} size="small" />
    </Container>
  );
}
