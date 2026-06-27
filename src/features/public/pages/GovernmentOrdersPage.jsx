import { useMemo, useState } from 'react';
import { usePublicCollection } from '@/features/public/hooks/useWebsiteData';
import { COLLECTIONS } from '@/firebase/collections';
import { PublicPageHero, SearchBar } from '@/features/public/components/PublicPageShell';
import {
  Tabs,
  Tab,
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Button,
  Skeleton,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { formatDateTime } from '@/utils/formatters';
import { FadeIn } from '@/features/public/components/AnimatedCounter';

const CATEGORIES = ['All', "GO's", 'Proceedings', 'Circulars', 'Notifications', 'Court Orders'];

function DocumentCard({ item }) {
  const pdfUrl = item.file_url;

  return (
    <Card sx={{ overflow: 'hidden' }}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ sm: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, flexWrap: 'wrap', gap: 1 }}>
              {item.category && <Chip size="small" label={item.category} color="primary" variant="outlined" />}
              {pdfUrl && (
                <Chip size="small" icon={<PictureAsPdfIcon />} label="PDF" color="error" variant="outlined" />
              )}
            </Stack>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              {item.title}
            </Typography>
            {item.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {item.description}
              </Typography>
            )}
            {item.created_at && (
              <Typography variant="caption" color="text.secondary">
                {formatDateTime(item.created_at)}
              </Typography>
            )}
          </Box>
          {pdfUrl && (
            <Stack direction="row" spacing={1} flexShrink={0}>
              <Button
                href={pdfUrl}
                target="_blank"
                rel="noopener"
                variant="outlined"
                size="small"
                startIcon={<OpenInNewIcon />}
              >
                Open
              </Button>
              <Button
                href={pdfUrl}
                download
                target="_blank"
                rel="noopener"
                variant="contained"
                size="small"
                startIcon={<DownloadIcon />}
              >
                Download
              </Button>
            </Stack>
          )}
        </Stack>

        {pdfUrl ? (
          <Box
            sx={{
              mt: 2,
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'grey.100',
              height: { xs: 360, md: 520 },
            }}
          >
            <Box
              component="iframe"
              src={`${pdfUrl}#toolbar=1&navpanes=0`}
              title={item.title}
              sx={{ width: '100%', height: '100%', border: 0, display: 'block' }}
            />
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            PDF not attached yet.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default function GovernmentOrdersPage() {
  const { items, loading } = usePublicCollection(COLLECTIONS.GOVERNMENT_ORDERS, { status: 'published' });
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);

  const filtered = useMemo(() => {
    let list = items.filter((i) => i.status === 'published' || !i.status);
    const cat = CATEGORIES[tab];
    if (cat !== 'All') list = list.filter((i) => (i.category || '').toLowerCase() === cat.toLowerCase());
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((i) => [i.title, i.description, i.category].some((v) => String(v || '').toLowerCase().includes(q)));
    }
    return list;
  }, [items, search, tab]);

  return (
    <>
      <PublicPageHero title="GO's / Government Orders" subtitle="Official orders, circulars and proceedings" />
      <SearchBar value={search} onChange={setSearch} placeholder="Search documents..." />
      <Box sx={{ px: 2, maxWidth: 1200, mx: 'auto' }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
          {CATEGORIES.map((c) => (
            <Tab key={c} label={c} />
          ))}
        </Tabs>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {loading ? (
          <Stack spacing={2}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rounded" height={200} />
            ))}
          </Stack>
        ) : !filtered.length ? (
          <Typography textAlign="center" color="text.secondary" sx={{ py: 6 }}>
            No documents available yet. Check back soon.
          </Typography>
        ) : (
          <Stack spacing={3}>
            {filtered.map((item) => (
              <FadeIn key={item.id}>
                <DocumentCard item={item} />
              </FadeIn>
            ))}
          </Stack>
        )}
      </Container>
    </>
  );
}
