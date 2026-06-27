import { usePublicCollection } from '@/features/public/hooks/useWebsiteData';
import { COLLECTIONS } from '@/firebase/collections';
import { PublicPageHero, ContentGrid } from '@/features/public/components/PublicPageShell';

export default function EmployeeIssuesPage() {
  const { items, loading } = usePublicCollection(COLLECTIONS.EMPLOYEE_ISSUES, { status: 'published' });

  return (
    <>
      <PublicPageHero title="Employee Issues" subtitle="Guidance on salary, promotion, transfer, leave and service matters" />
      <ContentGrid items={items} loading={loading} basePath="/employee-issues" />
    </>
  );
}
