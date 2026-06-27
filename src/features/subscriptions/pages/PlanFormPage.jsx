import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Button, Card, CardContent, Checkbox, FormControlLabel, Stack,
  Switch, TextField, Typography,
} from '@mui/material';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/app';
import { COLLECTIONS, STORAGE_PATHS } from '@/firebase/collections';
import PageHeader from '@/components/common/PageHeader';
import FileDropzone from '@/components/forms/FileDropzone';
import { PERMISSION_KEYS, emptyPermissions } from '@/config/subscriptionPermissions';
import { toast } from 'react-toastify';

const defaultPlan = {
  name: '',
  description: '',
  price: 300,
  currency: 'INR',
  validity_days: 365,
  features: '',
  is_active: true,
  is_recommended: false,
  display_order: 1,
  trial_eligible: false,
  icon_url: '',
  permissions: emptyPermissions(),
};

export default function PlanFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id) && id !== 'new';
  const [plan, setPlan] = useState(defaultPlan);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit || id === 'new') return;
    (async () => {
      const snap = await getDoc(doc(db, COLLECTIONS.PLANS, id));
      if (snap.exists()) {
        const data = snap.data();
        setPlan({
          ...defaultPlan,
          ...data,
          features: Array.isArray(data.features) ? data.features.join('\n') : data.features || '',
          permissions: { ...emptyPermissions(), ...(data.permissions || {}) },
        });
      }
    })();
  }, [id, isEdit]);

  const setPermission = (key, value) => {
    setPlan((p) => ({ ...p, permissions: { ...p.permissions, [key]: value } }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const docId = isEdit ? id : plan.name.toLowerCase().replace(/\s+/g, '_').slice(0, 48) || `plan_${Date.now()}`;
      const payload = {
        ...plan,
        price: Number(plan.price),
        validity_days: Number(plan.validity_days),
        display_order: Number(plan.display_order),
        features: plan.features.split('\n').map((f) => f.trim()).filter(Boolean),
        updated_at: serverTimestamp(),
        ...(isEdit ? {} : { created_at: serverTimestamp() }),
      };
      await setDoc(doc(db, COLLECTIONS.PLANS, docId), payload, { merge: true });
      toast.success('Plan saved');
      navigate('/subscription-plans');
    } catch (e) {
      toast.error(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onIconUpload = (url) => setPlan((p) => ({ ...p, icon_url: url }));

  return (
    <>
      <PageHeader title={isEdit ? 'Edit Plan' : 'New Plan'} subtitle="Configure pricing, validity, and feature permissions" />
      <Card>
        <CardContent>
          <Stack spacing={2} maxWidth={720}>
            <TextField label="Plan Name" value={plan.name} onChange={(e) => setPlan({ ...plan, name: e.target.value })} required />
            <TextField label="Description" multiline rows={2} value={plan.description} onChange={(e) => setPlan({ ...plan, description: e.target.value })} />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField type="number" label="Price (₹)" value={plan.price} onChange={(e) => setPlan({ ...plan, price: e.target.value })} />
              <TextField type="number" label="Validity (Days)" value={plan.validity_days} onChange={(e) => setPlan({ ...plan, validity_days: e.target.value })} />
              <TextField label="Currency" value={plan.currency} onChange={(e) => setPlan({ ...plan, currency: e.target.value })} />
              <TextField type="number" label="Display Order" value={plan.display_order} onChange={(e) => setPlan({ ...plan, display_order: e.target.value })} />
            </Stack>
            <TextField label="Features (one per line)" multiline rows={4} value={plan.features} onChange={(e) => setPlan({ ...plan, features: e.target.value })} />
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <FormControlLabel control={<Switch checked={plan.is_active} onChange={(e) => setPlan({ ...plan, is_active: e.target.checked })} />} label="Active" />
              <FormControlLabel control={<Switch checked={plan.is_recommended} onChange={(e) => setPlan({ ...plan, is_recommended: e.target.checked })} />} label="Recommended" />
              <FormControlLabel control={<Switch checked={plan.trial_eligible} onChange={(e) => setPlan({ ...plan, trial_eligible: e.target.checked })} />} label="Trial Eligible" />
            </Stack>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Plan Icon</Typography>
              <FileDropzone storagePath={STORAGE_PATHS.PLANS} onUploaded={onIconUpload} accept={{ 'image/*': [] }} />
              {plan.icon_url && <Typography variant="caption">{plan.icon_url}</Typography>}
            </Box>
            <Typography variant="h6">Feature Permissions</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
              {PERMISSION_KEYS.map(({ key, label }) => (
                <FormControlLabel
                  key={key}
                  control={<Checkbox checked={!!plan.permissions[key]} onChange={(e) => setPermission(key, e.target.checked)} />}
                  label={label}
                />
              ))}
            </Box>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Plan'}</Button>
              <Button onClick={() => navigate('/subscription-plans')}>Cancel</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
