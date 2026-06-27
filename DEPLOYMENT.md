# Deployment Guide — Party Connect Admin

## 1. Register Web App in Firebase

1. Open [Firebase Console](https://console.firebase.google.com/) → project **uwgea32**
2. Project Settings → Your apps → Add app → **Web**
3. Copy config values into `party-connect-admin/.env`:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=uwgea32.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=uwgea32
VITE_FIREBASE_STORAGE_BUCKET=uwgea32.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## 2. Enable Firebase Services

- **Authentication** → Email/Password
- **Firestore** → production mode (rules deployed from repo)
- **Storage** → enable bucket (required for media uploads)
- **Hosting** → enable

## 3. Build Admin Panel

```bash
cd party-connect-admin
npm install
npm run build
```

Output: `party-connect-admin/dist/`

## 4. Deploy Rules & Hosting

From repository root (`UWGEA/`):

```bash
firebase login
firebase deploy --only firestore:rules,storage:rules
firebase deploy --only hosting
```

Hosting is configured in root `firebase.json` to serve `party-connect-admin/dist`.

## 5. Create Super Admin

After first deploy:

1. Create auth user in Firebase Console
2. Add Firestore doc `admins/{uid}` with `role: "super_admin"` and `status: "active"`
3. Sign in at your Hosting URL

## 6. Custom Domain (Optional)

Firebase Console → Hosting → Add custom domain → follow DNS steps.

## 7. CI/CD (Optional)

Example GitHub Actions step:

```yaml
- run: cd party-connect-admin && npm ci && npm run build
- run: firebase deploy --only hosting --token ${{ secrets.FIREBASE_TOKEN }}
```

## 8. Push Notifications

For FCM from the admin panel, add a Cloud Function or use Firebase Console. The admin stores notification records in `notifications`; the Android app handles FCM delivery via existing client integration.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Login "Access denied" | Ensure `admins/{uid}` exists with valid `role` |
| Firestore permission denied | Deploy updated `firestore.rules` |
| Upload fails | Enable Storage and deploy `storage.rules` |
| Blank page after deploy | Check browser console; verify `.env` was set before `npm run build` |
