import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  getCountFromServer,
  Timestamp,
} from 'firebase/firestore';
import { db } from './app';

export const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate();
  if (value?.toDate) return value.toDate();
  return new Date(value);
};

const toSortableTime = (value) => {
  if (!value) return 0;
  if (value instanceof Timestamp) return value.toMillis();
  if (value?.toMillis) return value.toMillis();
  if (value?.seconds) return value.seconds * 1000;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const createCrudService = (collectionName) => {
  const colRef = collection(db, collectionName);

  return {
    collectionName,

    async list({
      filters = [],
      orderByField = 'created_at',
      orderDirection = 'desc',
      pageSize = 25,
      cursor = null,
    } = {}) {
      const constraints = [];
      filters.forEach(([field, op, value]) => {
        if (value !== '' && value !== undefined && value !== null) {
          constraints.push(where(field, op, value));
        }
      });
      constraints.push(orderBy(orderByField, orderDirection));
      constraints.push(limit(pageSize));
      if (cursor) constraints.push(startAfter(cursor));

      const q = query(colRef, ...constraints);
      const snap = await getDocs(q);
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const lastDoc = snap.docs[snap.docs.length - 1] || null;
      return { items, lastDoc, hasMore: snap.docs.length === pageSize };
    },

    async getAll(orderByField = 'created_at') {
      // Fetch all docs first — server-side orderBy excludes documents missing the sort field
      const snap = await getDocs(colRef);
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return items.sort((a, b) => toSortableTime(b[orderByField]) - toSortableTime(a[orderByField]));
    },

    async getById(id) {
      const ref = doc(db, collectionName, id);
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      return { id: snap.id, ...snap.data() };
    },

    async create(data, id = null) {
      const payload = {
        ...data,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      };
      if (id) {
        const ref = doc(db, collectionName, id);
        await setDoc(ref, payload);
        return id;
      }
      const ref = await addDoc(colRef, payload);
      return ref.id;
    },

    async update(id, data) {
      const ref = doc(db, collectionName, id);
      await updateDoc(ref, { ...data, updated_at: serverTimestamp() });
    },

    async remove(id) {
      await deleteDoc(doc(db, collectionName, id));
    },

    async count(filters = []) {
      const constraints = filters.map(([field, op, value]) => where(field, op, value));
      const q = constraints.length ? query(colRef, ...constraints) : colRef;
      const snap = await getCountFromServer(q);
      return snap.data().count;
    },

    async countToday(dateField = 'created_at') {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const q = query(colRef, where(dateField, '>=', Timestamp.fromDate(start)));
      const snap = await getCountFromServer(q);
      return snap.data().count;
    },
  };
};

export const logActivity = async (action, module, details = {}, userId = null) => {
  try {
    await addDoc(collection(db, 'logs'), {
      action,
      module,
      details,
      user_id: userId,
      created_at: serverTimestamp(),
    });
  } catch {
    // non-blocking
  }
};
