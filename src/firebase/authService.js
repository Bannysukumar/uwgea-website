import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './app';
import { COLLECTIONS } from './collections';

const ADMIN_ROLES = [
  'super_admin',
  'admin',
  'district_admin',
  'state_admin',
  'mandal_admin',
  'village_admin',
  'moderator',
  'editor',
  'viewer',
];

export const isAdminRole = (role) => ADMIN_ROLES.includes(role);

export const login = async (email, password, rememberMe = true) => {
  await setPersistence(
    auth,
    rememberMe ? browserLocalPersistence : browserSessionPersistence,
  );

  let credential;
  try {
    credential = await signInWithEmailAndPassword(auth, email, password);

    const adminDoc = await getDoc(doc(db, COLLECTIONS.ADMINS, credential.user.uid));
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, credential.user.uid));

    const profile = adminDoc.exists()
      ? adminDoc.data()
      : userDoc.exists()
        ? userDoc.data()
        : null;

    if (!profile || !isAdminRole(profile.role)) {
      throw new Error('Access denied. Admin role required.');
    }

    if (profile.status === 'suspended' || profile.status === 'inactive') {
      throw new Error('Account is suspended or inactive.');
    }

    await setDoc(
      doc(db, COLLECTIONS.ADMINS, credential.user.uid),
      { last_login: serverTimestamp() },
      { merge: true },
    );

    return { user: credential.user, profile: { uid: credential.user.uid, ...profile } };
  } catch (error) {
    if (auth.currentUser) {
      await signOut(auth);
    }
    throw error;
  }
};

export const logout = () => signOut(auth);

export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

export const changePassword = (newPassword) => {
  if (!auth.currentUser) throw new Error('Not authenticated');
  return updatePassword(auth.currentUser, newPassword);
};

export const subscribeAuth = (callback) => onAuthStateChanged(auth, callback);

export const fetchAdminProfile = async (uid) => {
  const adminSnap = await getDoc(doc(db, COLLECTIONS.ADMINS, uid));
  if (adminSnap.exists()) return { uid, ...adminSnap.data() };
  const userSnap = await getDoc(doc(db, COLLECTIONS.USERS, uid));
  if (userSnap.exists()) return { uid, ...userSnap.data() };
  return null;
};
