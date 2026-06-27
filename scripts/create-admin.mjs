/**
 * Creates a super_admin user in Firebase Auth + Firestore admins/{uid}.
 *
 * Usage:
 *   node scripts/create-admin.mjs
 *   node scripts/create-admin.mjs --email user@example.com --password "same-as-email"
 *   node scripts/create-admin.mjs --email user@example.com --name "Display Name" --role admin
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';
import { initializeApp, cert, deleteApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccountPath = join(__dirname, '../../uwgea32-firebase-adminsdk-fbsvc-69aab71bc9.json');

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i !== -1 ? process.argv[i + 1] : fallback;
}

const email = arg('--email', 'admin@example.com');
const password = arg('--password', `PcAdmin-${randomBytes(6).toString('hex')}!`);
const name = arg('--name', email.split('@')[0] || 'Admin');
const role = arg('--role', 'super_admin');

const ADMIN = {
  email,
  name,
  role,
  status: 'active',
};

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

const app = initializeApp({
  credential: cert(serviceAccount),
});

const auth = getAuth(app);
const db = getFirestore(app);

async function main() {
  let userRecord;

  try {
    userRecord = await auth.createUser({
      email: ADMIN.email,
      password,
      displayName: ADMIN.name,
      emailVerified: true,
    });
    console.log(`Created Auth user: ${userRecord.uid}`);
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      userRecord = await auth.getUserByEmail(ADMIN.email);
      await auth.updateUser(userRecord.uid, {
        password,
        displayName: ADMIN.name,
        emailVerified: true,
      });
      console.log(`Auth user already exists, updated password: ${userRecord.uid}`);
    } else {
      throw error;
    }
  }

  await db
    .collection('admins')
    .doc(userRecord.uid)
    .set(
      {
        email: ADMIN.email,
        name: ADMIN.name,
        role: ADMIN.role,
        status: ADMIN.status,
        created_at: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

  console.log('\nAdmin ready.');
  console.log(`  UID:      ${userRecord.uid}`);
  console.log(`  Email:    ${ADMIN.email}`);
  console.log(`  Password: ${password}`);
  console.log(`  Role:     ${ADMIN.role}`);
  console.log(`  Firestore: admins/${userRecord.uid}`);
}

main()
  .catch((error) => {
    console.error('Failed to create admin:', error.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await deleteApp(app);
  });
