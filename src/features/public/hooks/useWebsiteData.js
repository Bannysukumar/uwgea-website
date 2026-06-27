import { useEffect, useState } from 'react';
import { doc, onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/app';
import { COLLECTIONS } from '@/firebase/collections';
import { DEFAULT_WEBSITE, DEFAULT_STATISTICS, DEFAULT_QUICK_ACTIONS } from '@/features/public/constants/defaults';

const mergeDefaults = (data) => ({
  hero: { ...DEFAULT_WEBSITE.hero, ...(data?.hero || {}) },
  organization: { ...DEFAULT_WEBSITE.organization, ...(data?.organization || {}) },
  mission: { ...DEFAULT_WEBSITE.mission, ...(data?.mission || {}) },
  vision: { ...DEFAULT_WEBSITE.vision, ...(data?.vision || {}) },
  founder: { ...DEFAULT_WEBSITE.founder, ...(data?.founder || {}) },
  footer: { ...DEFAULT_WEBSITE.footer, ...(data?.footer || {}) },
  contact: { ...DEFAULT_WEBSITE.contact, ...(data?.contact || {}) },
  seo: { ...DEFAULT_WEBSITE.seo, ...(data?.seo || {}) },
  section_visibility: { ...DEFAULT_WEBSITE.section_visibility, ...(data?.section_visibility || {}) },
  about: data?.about || { content: '' },
  privacy: data?.privacy || { content: '' },
  terms: data?.terms || { content: '' },
});

export function useWebsiteSettings() {
  const [settings, setSettings] = useState(() => mergeDefaults(null));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, COLLECTIONS.WEBSITE_SETTINGS, 'main'),
      (snap) => {
        setSettings(mergeDefaults(snap.exists() ? snap.data() : null));
        setLoading(false);
      },
      () => {
        setSettings(mergeDefaults(null));
        setLoading(false);
      },
    );
    return unsub;
  }, []);

  return { settings, loading };
}

export function useWebsiteStatistics() {
  const [items, setItems] = useState(DEFAULT_STATISTICS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, COLLECTIONS.WEBSITE_STATISTICS),
      where('is_active', '==', true),
      orderBy('display_order', 'asc'),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        if (snap.empty) {
          setItems(DEFAULT_STATISTICS);
        } else {
          setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
        setLoading(false);
      },
      () => {
        setItems(DEFAULT_STATISTICS);
        setLoading(false);
      },
    );
    return unsub;
  }, []);

  return { items, loading };
}

export function useQuickActions() {
  const [items, setItems] = useState(DEFAULT_QUICK_ACTIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, COLLECTIONS.WEBSITE_QUICK_ACTIONS),
      where('is_active', '==', true),
      orderBy('display_order', 'asc'),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        if (snap.empty) {
          setItems(DEFAULT_QUICK_ACTIONS);
        } else {
          setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
        setLoading(false);
      },
      () => {
        setItems(DEFAULT_QUICK_ACTIONS);
        setLoading(false);
      },
    );
    return unsub;
  }, []);

  return { items, loading };
}

export function usePublicCollection(collectionName, { status, orderField = 'created_at', limitCount } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let fallbackUnsub = null;
    const constraints = [];
    if (status) constraints.push(where('status', '==', status));
    if (orderField) constraints.push(orderBy(orderField, 'desc'));
    const q = constraints.length
      ? query(collection(db, collectionName), ...constraints)
      : collection(db, collectionName);

    const mapDocs = (snap) => {
      let docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      if (limitCount) docs = docs.slice(0, limitCount);
      return docs;
    };

    const unsub = onSnapshot(
      q,
      (snap) => {
        setItems(mapDocs(snap));
        setLoading(false);
      },
      () => {
        fallbackUnsub = onSnapshot(collection(db, collectionName), (snap) => {
          setItems(mapDocs(snap));
          setLoading(false);
        });
      },
    );
    return () => {
      unsub();
      fallbackUnsub?.();
    };
  }, [collectionName, status, orderField, limitCount]);

  return { items, loading };
}
