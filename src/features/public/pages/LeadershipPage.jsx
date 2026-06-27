import { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/app';
import { COLLECTIONS } from '@/firebase/collections';
import { PublicPageHero, ContentGrid, SearchBar } from '@/features/public/components/PublicPageShell';

export default function LeadershipPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const q = query(collection(db, COLLECTIONS.LEADERS), where('is_active', '==', true), orderBy('priority', 'asc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      () => {
        onSnapshot(collection(db, COLLECTIONS.LEADERS), (snap) => {
          setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
          setLoading(false);
        });
      },
    );
    return unsub;
  }, []);

  const filtered = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter((i) =>
      [i.name, i.designation, i.district, i.mobile, i.email].some((v) => String(v || '').toLowerCase().includes(q)),
    );
  }, [items, search]);

  return (
    <>
      <PublicPageHero title="Leadership" subtitle="State and district leadership of UWGEA" />
      <SearchBar value={search} onChange={setSearch} placeholder="Search by name, designation, district..." />
      <ContentGrid items={filtered.map((l) => ({ ...l, title: l.name, description: l.designation, image_url: l.image_url }))} loading={loading} />
    </>
  );
}
