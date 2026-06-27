import { usePublicCollection } from '@/features/public/hooks/useWebsiteData';
import { COLLECTIONS } from '@/firebase/collections';
import { PublicPageHero, ContentGrid } from '@/features/public/components/PublicPageShell';

export default function WelfareSchemesPage() {
  const { items, loading } = usePublicCollection(COLLECTIONS.WELFARE_SCHEMES, { status: 'published' });

  return (
    <>
      <PublicPageHero title="Welfare Schemes" subtitle="Benefits and support programs for members" />
      <ContentGrid items={items} loading={loading} />
    </>
  );
}
