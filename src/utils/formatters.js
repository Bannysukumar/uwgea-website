import dayjs from 'dayjs';
import { toDate } from '@/firebase/firestoreService';

export const formatDate = (value, format = 'DD MMM YYYY') => {
  const d = toDate(value);
  return d ? dayjs(d).format(format) : '—';
};

export const formatDateTime = (value) => formatDate(value, 'DD MMM YYYY, hh:mm A');

export const truncate = (str, len = 60) => {
  if (!str) return '';
  return str.length > len ? `${str.slice(0, len)}…` : str;
};
