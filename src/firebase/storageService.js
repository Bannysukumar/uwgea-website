import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './app';

export const uploadFile = async (path, file, onProgress) => {
  const storageRef = ref(storage, `${path}${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  if (onProgress) onProgress(100);
  const url = await getDownloadURL(snapshot.ref);
  return { url, path: snapshot.ref.fullPath };
};

export const deleteFile = async (fullPath) => {
  if (!fullPath) return;
  await deleteObject(ref(storage, fullPath));
};

export const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
};
