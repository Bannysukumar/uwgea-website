import { useMemo, useState } from 'react';
import { usePublicCollection } from '@/features/public/hooks/useWebsiteData';
import { COLLECTIONS } from '@/firebase/collections';
import { PublicPageHero, ContentGrid, SearchBar } from '@/features/public/components/PublicPageShell';
import { Tabs, Tab, Box } from '@mui/material';

const CATEGORIES = ['All', "GO's", 'Proceedings', 'Circulars', 'Notifications', 'Court Orders'];

export default function GovernmentOrdersPage() {
  const { items, loading } = usePublicCollection(COLLECTIONS.GOVERNMENT_ORDERS, { status: 'published' });
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);

  const filtered = useMemo(() => {
    let list = items;
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
      <ContentGrid items={filtered} loading={loading} />
    </>
  );
}
