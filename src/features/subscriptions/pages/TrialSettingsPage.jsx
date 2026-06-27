import { useEffect, useState } from 'react';
import { Card, CardContent, Button, Stack, TextField, FormControlLabel, Switch, MenuItem } from '@mui/material';
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, collection } from 'firebase/firestore';
import { db } from '@/firebase/app';
import { COLLECTIONS } from '@/firebase/collections';
import PageHeader from '@/components/common/PageHeader';
import { toast } from 'react-toastify';

export default function TrialSettingsPage() {
  const [settings, setSettings] = useState({ enabled: true, trial_days: 4, plan_id: 'member_plan' });
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    getDoc(doc(db, COLLECTIONS.TRIAL_SETTINGS, 'config')).then((snap) => {
      if (snap.exists()) setSettings((s) => ({ ...s, ...snap.data() }));
    });
    return onSnapshot(collection(db, COLLECTIONS.PLANS), (snap) => {
      setPlans(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const save = async () => {
    await setDoc(doc(db, COLLECTIONS.TRIAL_SETTINGS, 'config'), {
      ...settings,
      trial_days: Number(settings.trial_days),
      updated_at: serverTimestamp(),
    }, { merge: true });
    toast.success('Trial settings saved — app will sync instantly');
  };

  return (
    <>
      <PageHeader title="Free Trial Settings" subtitle="Configure trial duration and permissions plan for new users" />
      <Card>
        <CardContent>
          <Stack spacing={2} maxWidth={480}>
            <FormControlLabel
              control={<Switch checked={settings.enabled} onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })} />}
              label="Enable Free Trial for New Users"
            />
            <TextField
              type="number"
              label="Trial Duration (Days)"
              value={settings.trial_days}
              onChange={(e) => setSettings({ ...settings, trial_days: e.target.value })}
              helperText="Default: 4 days. Set to 0 or disable trial above to skip."
            />
            <TextField
              select
              label="Trial Permissions Plan"
              value={settings.plan_id}
              onChange={(e) => setSettings({ ...settings, plan_id: e.target.value })}
              helperText="Users get this plan's permissions during trial (except premium posting features if restricted in plan)"
            >
              {plans.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </TextField>
            <Button variant="contained" onClick={save}>Save Trial Settings</Button>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
