import { usePublicCollection } from '@/features/public/hooks/useWebsiteData';
import { COLLECTIONS } from '@/firebase/collections';
import { PublicPageHero, ContentGrid } from '@/features/public/components/PublicPageShell';

export default function GalleryPage() {
  const { items, loading } = usePublicCollection(COLLECTIONS.GALLERY, {});

  return (
    <>
      <PublicPageHero title="Gallery" subtitle="Photos, events and albums" />
      <ContentGrid items={items} loading={loading} />
    </>
  );
}
