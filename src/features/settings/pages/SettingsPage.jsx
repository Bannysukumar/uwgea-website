import { useEffect, useState } from 'react';
import { Card, CardContent, TextField, Button, Stack, Typography } from '@mui/material';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/app';
import { COLLECTIONS } from '@/firebase/collections';
import PageHeader from '@/components/common/PageHeader';
import { toast } from 'react-toastify';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    app_name: 'SGSW',
    maintenance_mode: false,
    privacy_url: '',
    terms_url: '',
    contact_email: '',
  });

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, COLLECTIONS.SETTINGS, 'app'));
      if (snap.exists()) setSettings((s) => ({ ...s, ...snap.data() }));
    })();
  }, []);

  const save = async () => {
    await setDoc(doc(db, COLLECTIONS.SETTINGS, 'app'), settings, { merge: true });
    toast.success('Settings saved');
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="App configuration for Android client" />
      <Card>
        <CardContent>
          <Stack spacing={2} maxWidth={560}>
            <TextField label="App Name" value={settings.app_name} onChange={(e) => setSettings({ ...settings, app_name: e.target.value })} />
            <TextField label="Contact Email" value={settings.contact_email} onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })} />
            <TextField label="Privacy Policy URL" value={settings.privacy_url} onChange={(e) => setSettings({ ...settings, privacy_url: e.target.value })} />
            <TextField label="Terms URL" value={settings.terms_url} onChange={(e) => setSettings({ ...settings, terms_url: e.target.value })} />
            <Typography variant="body2" color="text.secondary">
              Maintenance mode: configure via Firebase Remote Config for production rollout.
            </Typography>
            <Button variant="contained" onClick={save}>Save Settings</Button>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
