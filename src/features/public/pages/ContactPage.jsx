import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Container, TextField, Button, Stack, Typography, Alert, Box } from '@mui/material';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/app';
import { COLLECTIONS } from '@/firebase/collections';
import { PublicPageHero } from '@/features/public/components/PublicPageShell';
import { toast } from 'react-toastify';

export default function ContactPage() {
  const { settings } = useOutletContext();
  const contact = settings.contact;
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, COLLECTIONS.CONTACT_MESSAGES), {
      ...form,
      status: 'new',
      created_at: serverTimestamp(),
    });
    setSent(true);
    toast.success('Message sent successfully');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <>
      <PublicPageHero title="Contact Us" subtitle="Reach the UWGEA state office and district teams" />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          <Box>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Office Details
            </Typography>
            {contact.address && <Typography paragraph>{contact.address}</Typography>}
            {contact.phone && <Typography paragraph>Phone: {contact.phone}</Typography>}
            {contact.email && <Typography paragraph>Email: {contact.email}</Typography>}
            {contact.map_embed_url && (
              <Box component="iframe" src={contact.map_embed_url} sx={{ width: '100%', height: 280, border: 0, borderRadius: 2, mt: 2 }} title="Map" />
            )}
          </Box>
          <Box component="form" onSubmit={submit}>
            {sent && <Alert severity="success" sx={{ mb: 2 }}>Thank you! We will respond shortly.</Alert>}
            <Stack spacing={2}>
              <TextField label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth />
              <TextField label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} fullWidth />
              <TextField label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} fullWidth />
              <TextField label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} fullWidth />
              <TextField label="Message" required multiline rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} fullWidth />
              <Button type="submit" variant="contained" size="large">
                Send Message
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </>
  );
}
