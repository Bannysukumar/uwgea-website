import { useEffect, useState } from 'react';
import { Card, CardContent, Button, Stack, TextField, FormControlLabel, Switch, Typography, Alert } from '@mui/material';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/app';
import { COLLECTIONS } from '@/firebase/collections';
import PageHeader from '@/components/common/PageHeader';
import { toast } from 'react-toastify';

export default function PaymentSettingsPage() {
  const [pub, setPub] = useState({
    enabled: false,
    key_id: '',
    merchant_name: 'SGSW',
    merchant_logo_url: '',
    currency: 'INR',
    payment_description: 'Subscription Payment',
    success_url: '',
    failure_url: '',
  });
  const [priv, setPriv] = useState({ key_secret: '', webhook_secret: '' });

  useEffect(() => {
    (async () => {
      const [p, s] = await Promise.all([
        getDoc(doc(db, COLLECTIONS.PAYMENT_SETTINGS, 'public')),
        getDoc(doc(db, COLLECTIONS.PAYMENT_SETTINGS, 'private')),
      ]);
      if (p.exists()) setPub((x) => ({ ...x, ...p.data() }));
      if (s.exists()) setPriv((x) => ({ ...x, ...s.data() }));
    })();
  }, []);

  const save = async () => {
    const now = serverTimestamp();
    await setDoc(doc(db, COLLECTIONS.PAYMENT_SETTINGS, 'public'), { ...pub, updated_at: now }, { merge: true });
    await setDoc(doc(db, COLLECTIONS.PAYMENT_SETTINGS, 'private'), { ...priv, updated_at: now }, { merge: true });
    toast.success('Payment settings saved');
  };

  return (
    <>
      <PageHeader title="Payment Gateway" subtitle="Razorpay configuration — secret keys are never sent to the Android app" />
      <Alert severity="info" sx={{ mb: 2 }}>
        Only Key ID is exposed to the app. Key Secret and Webhook Secret are used server-side in Cloud Functions for verification.
      </Alert>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack spacing={2} maxWidth={560}>
            <FormControlLabel
              control={<Switch checked={pub.enabled} onChange={(e) => setPub({ ...pub, enabled: e.target.checked })} />}
              label="Enable Razorpay Payments"
            />
            <TextField label="Razorpay Key ID" value={pub.key_id} onChange={(e) => setPub({ ...pub, key_id: e.target.value })} />
            <TextField label="Merchant Name" value={pub.merchant_name} onChange={(e) => setPub({ ...pub, merchant_name: e.target.value })} />
            <TextField label="Merchant Logo URL" value={pub.merchant_logo_url} onChange={(e) => setPub({ ...pub, merchant_logo_url: e.target.value })} />
            <TextField label="Currency" value={pub.currency} onChange={(e) => setPub({ ...pub, currency: e.target.value })} />
            <TextField label="Payment Description" value={pub.payment_description} onChange={(e) => setPub({ ...pub, payment_description: e.target.value })} />
            <TextField label="Success URL (optional)" value={pub.success_url} onChange={(e) => setPub({ ...pub, success_url: e.target.value })} />
            <TextField label="Failure URL (optional)" value={pub.failure_url} onChange={(e) => setPub({ ...pub, failure_url: e.target.value })} />
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Server-only credentials</Typography>
          <Stack spacing={2} maxWidth={560}>
            <TextField type="password" label="Razorpay Key Secret" value={priv.key_secret} onChange={(e) => setPriv({ ...priv, key_secret: e.target.value })} />
            <TextField type="password" label="Webhook Secret" value={priv.webhook_secret} onChange={(e) => setPriv({ ...priv, webhook_secret: e.target.value })} />
            <Button variant="contained" onClick={save}>Save Payment Settings</Button>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
