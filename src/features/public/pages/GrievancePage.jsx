import { useState } from 'react';
import { Container, TextField, Button, Stack, MenuItem, FormControlLabel, Switch, Typography, Alert } from '@mui/material';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/app';
import { COLLECTIONS } from '@/firebase/collections';
import { PublicPageHero } from '@/features/public/components/PublicPageShell';
import { toast } from 'react-toastify';

const CATEGORIES = [
  'Complaint Registration',
  'Suggestions',
  'Transfer Issues',
  'Promotion Issues',
  'Welfare Issues',
  'Service Issues',
];

export default function GrievancePage() {
  const [form, setForm] = useState({
    category: CATEGORIES[0],
    name: '',
    employee_id: '',
    district: '',
    mobile: '',
    email: '',
    description: '',
    anonymous: false,
  });
  const [ticketId, setTicketId] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const ref = await addDoc(collection(db, COLLECTIONS.GRIEVANCES), {
      ...form,
      name: form.anonymous ? 'Anonymous' : form.name,
      status: 'submitted',
      created_at: serverTimestamp(),
    });
    setTicketId(ref.id);
    toast.success('Grievance submitted');
    setForm({ category: CATEGORIES[0], name: '', employee_id: '', district: '', mobile: '', email: '', description: '', anonymous: false });
  };

  return (
    <>
      <PublicPageHero title="Employee Grievance Portal" subtitle="Register complaints and track resolution status" />
      <Container maxWidth="sm" sx={{ py: 4 }}>
        {ticketId && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Grievance submitted. Reference ID: <strong>{ticketId}</strong>
          </Alert>
        )}
        <Typography variant="body2" color="text.secondary" paragraph>
          All grievances are reviewed by the UWGEA team. You may submit anonymously if preferred.
        </Typography>
        <Stack component="form" spacing={2} onSubmit={submit}>
          <TextField select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} fullWidth>
            {CATEGORIES.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            control={<Switch checked={form.anonymous} onChange={(e) => setForm({ ...form, anonymous: e.target.checked })} />}
            label="Submit anonymously"
          />
          {!form.anonymous && (
            <TextField label="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth />
          )}
          <TextField label="Employee ID" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} fullWidth />
          <TextField label="District" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} fullWidth />
          <TextField label="Mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} fullWidth />
          <TextField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} fullWidth />
          <TextField label="Description" required multiline rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth />
          <Button type="submit" variant="contained" size="large">
            Submit Grievance
          </Button>
        </Stack>
      </Container>
    </>
  );
}
