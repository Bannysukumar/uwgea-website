import { useMemo, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { db } from '@/firebase/app';
import { COLLECTIONS } from '@/firebase/collections';
import { usePublicCollection } from '@/features/public/hooks/useWebsiteData';
import { PublicPageHero, ContentGrid, SearchBar, RichTextSection } from '@/features/public/components/PublicPageShell';

export default function NewsMediaPage() {
  const { id } = useParams();
  const { items, loading } = usePublicCollection(COLLECTIONS.NEWS, { status: 'published' });
  const [search, setSearch] = useState('');
  const [article, setArticle] = useState(null);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, COLLECTIONS.NEWS, id)).then((snap) => {
      if (snap.exists()) setArticle({ id: snap.id, ...snap.data() });
    });
  }, [id]);

  const filtered = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter((i) => [i.title, i.description, i.category].some((v) => String(v || '').toLowerCase().includes(q)));
  }, [items, search]);

  if (id && article) {
    return (
      <>
        <PublicPageHero title={article.title} subtitle={article.category} />
        <RichTextSection html={article.content} fallback={article.description} />
        <Container sx={{ pb: 4 }}>
          <Button component={RouterLink} to="/news-media">← Back to News</Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <PublicPageHero title="News & Media" subtitle="Latest news, press notes and updates" />
      <SearchBar value={search} onChange={setSearch} placeholder="Search news..." />
      <ContentGrid items={filtered} loading={loading} basePath="/news-media" />
    </>
  );
}
