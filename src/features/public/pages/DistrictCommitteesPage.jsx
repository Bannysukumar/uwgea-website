import { usePublicCollection } from '@/features/public/hooks/useWebsiteData';
import { COLLECTIONS } from '@/firebase/collections';
import { PublicPageHero, ContentGrid } from '@/features/public/components/PublicPageShell';

export default function DistrictCommitteesPage() {
  const { items, loading } = usePublicCollection(COLLECTIONS.DISTRICT_COMMITTEES, { status: 'active', orderField: 'display_order' });

  return (
    <>
      <PublicPageHero title="District Committees" subtitle="26 district teams across Andhra Pradesh" />
      <ContentGrid
        items={items.map((d) => ({
          ...d,
          title: d.district_name || d.name,
          description: [d.president && `President: ${d.president}`, d.secretary && `Secretary: ${d.secretary}`].filter(Boolean).join(' • '),
        }))}
        loading={loading}
        emptyMessage="District committee details will appear here once added from the Admin Panel."
      />
    </>
  );
}
