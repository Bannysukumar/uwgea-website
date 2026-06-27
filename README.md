# Party Connect Admin

Enterprise admin panel for managing the **Party Connect** Android application. Built with React 19, Vite, Material UI, Redux Toolkit, and Firebase.

## Features

- Role-based authentication (Super Admin, Admin, District/State/Mandal/Village Admin, Moderator, Editor, Viewer)
- Dashboard with realtime stats and ApexCharts analytics
- CRUD modules for users, leaders, news, posts, media, events, polls, notifications, and more
- Material React Table lists with search, filter, export
- React Hook Form + Yup validation, CKEditor 5 rich text, file uploads to Firebase Storage
- Dark/light theme, responsive layout, activity audit logs
- Firebase: Auth, Firestore, Storage, Hosting

## Prerequisites

- Node.js 20+
- Firebase project (`uwgea32`) with a **Web app** registered in Firebase Console
- Firestore and Authentication enabled

## Quick Start

```bash
cd party-connect-admin
cp .env.example .env
# Edit .env with your Firebase Web app credentials
npm install
npm run dev
```

Open http://localhost:5173

## First Admin User

1. Create a user in **Firebase Authentication** (Email/Password).
2. In **Firestore**, create document `admins/{uid}`:

```json
{
  "name": "Super Admin",
  "email": "admin@example.com",
  "role": "super_admin",
  "status": "active",
  "created_at": "<server timestamp>"
}
```

Alternatively, set `role: "super_admin"` on `users/{uid}` if using the users collection.

## Project Structure

```
src/
  config/modules.js      # Module registry (columns, forms, collections)
  features/              # Feature-based modules (auth, dashboard, users, …)
  firebase/              # Firebase SDK services
  layouts/               # Dashboard & auth layouts
  redux/                 # Store and slices
  routes/                # App routing + protected routes
  components/            # Shared UI components
  utils/                 # Permissions, formatters, export helpers
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | Run oxlint |

## Firebase Collections

`users`, `admins`, `roles`, `permissions`, `leaders`, `posts`, `comments`, `news`, `events`, `gallery`, `videos`, `media`, `downloads`, `notifications`, `polls`, `feedback`, `reports`, `analytics`, `banners`, `advertisements`, `districts`, `mandals`, `villages`, `departments`, `membership`, `volunteers`, `settings`, `logs`, `live`

## Security

- Deploy Firestore and Storage rules from the repository root
- Never commit `.env` or service account JSON files
- Use role-based permissions in the admin panel and enforce via Firestore rules

See [DEPLOYMENT.md](./DEPLOYMENT.md) for hosting and production setup.
