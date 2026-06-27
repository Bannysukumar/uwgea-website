import { useEffect, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import {
  Box, Button, Card, CardContent, Stack, TextField, Typography, Tabs, Tab, Switch, FormControlLabel,
} from '@mui/material';
import { db } from '@/firebase/app';
import { COLLECTIONS } from '@/firebase/collections';
import PageHeader from '@/components/common/PageHeader';
import { DEFAULT_WEBSITE } from '@/features/public/constants/defaults';
import { toast } from 'react-toastify';

function SectionFields({ title, children }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>{title}</Typography>
        <Stack spacing={2}>{children}</Stack>
      </CardContent>
    </Card>
  );
}

export default function WebsiteSettingsPage() {
  const [tab, setTab] = useState(0);
  const [data, setData] = useState(DEFAULT_WEBSITE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, COLLECTIONS.WEBSITE_SETTINGS, 'main'));
      if (snap.exists()) {
        setData((prev) => ({
          ...prev,
          ...snap.data(),
          hero: { ...prev.hero, ...snap.data().hero },
          organization: { ...prev.organization, ...snap.data().organization },
          founder: { ...prev.founder, ...snap.data().founder },
          mission: { ...prev.mission, ...snap.data().mission },
          vision: { ...prev.vision, ...snap.data().vision },
          contact: { ...prev.contact, ...snap.data().contact },
          footer: { ...prev.footer, ...snap.data().footer },
          seo: { ...prev.seo, ...snap.data().seo },
          section_visibility: { ...prev.section_visibility, ...snap.data().section_visibility },
        }));
      }
      setLoading(false);
    })();
  }, []);

  const set = (section, field, value) => {
    setData((d) => ({ ...d, [section]: { ...d[section], [field]: value } }));
  };

  const save = async () => {
    await setDoc(doc(db, COLLECTIONS.WEBSITE_SETTINGS, 'main'), { ...data, updated_at: serverTimestamp() }, { merge: true });
    toast.success('Website settings saved — changes appear on the public site instantly');
  };

  if (loading) return null;

  return (
    <Box>
      <PageHeader title="Website CMS" subtitle="Manage public website content — updates live without redeploy" />
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }} variant="scrollable">
        <Tab label="Hero" />
        <Tab label="Organization" />
        <Tab label="Founder" />
        <Tab label="Mission & Vision" />
        <Tab label="Contact & Footer" />
        <Tab label="SEO & Pages" />
        <Tab label="Sections" />
      </Tabs>

      {tab === 0 && (
        <SectionFields title="Hero Banner">
          {['heading', 'subheading', 'tagline_te', 'tagline_en', 'unity', 'motto', 'background_image_url', 'cta_primary_label', 'cta_primary_link', 'cta_secondary_label', 'cta_secondary_link', 'cta_tertiary_label', 'cta_tertiary_link'].map((f) => (
            <TextField key={f} label={f.replace(/_/g, ' ')} value={data.hero[f] || ''} onChange={(e) => set('hero', f, e.target.value)} fullWidth />
          ))}
          <FormControlLabel control={<Switch checked={!!data.hero.show_scroll_indicator} onChange={(e) => set('hero', 'show_scroll_indicator', e.target.checked)} />} label="Show scroll indicator" />
        </SectionFields>
      )}

      {tab === 1 && (
        <SectionFields title="Organization">
          {['name', 'full_name', 'tagline_te', 'tagline_en', 'unity', 'website_url', 'logo_url'].map((f) => (
            <TextField key={f} label={f.replace(/_/g, ' ')} value={data.organization[f] || ''} onChange={(e) => set('organization', f, e.target.value)} fullWidth />
          ))}
        </SectionFields>
      )}

      {tab === 2 && (
        <SectionFields title="Founder">
          {['name', 'designation', 'org_line', 'photo_url', 'biography', 'message', 'signature_url', 'facebook', 'twitter', 'instagram', 'linkedin'].map((f) => (
            <TextField key={f} label={f.replace(/_/g, ' ')} value={data.founder[f] || ''} onChange={(e) => set('founder', f, e.target.value)} fullWidth multiline={f === 'biography' || f === 'message'} rows={f === 'biography' || f === 'message' ? 4 : 1} />
          ))}
        </SectionFields>
      )}

      {tab === 3 && (
        <>
          <SectionFields title="Mission">
            <TextField multiline rows={4} fullWidth value={data.mission.text} onChange={(e) => set('mission', 'text', e.target.value)} />
          </SectionFields>
          <SectionFields title="Vision">
            <TextField multiline rows={4} fullWidth value={data.vision.text} onChange={(e) => set('vision', 'text', e.target.value)} />
          </SectionFields>
        </>
      )}

      {tab === 4 && (
        <>
          <SectionFields title="Contact">
            {['address', 'phone', 'email', 'map_embed_url', 'facebook', 'twitter', 'instagram', 'youtube', 'whatsapp'].map((f) => (
              <TextField key={f} label={f.replace(/_/g, ' ')} value={data.contact[f] || ''} onChange={(e) => set('contact', f, e.target.value)} fullWidth />
            ))}
          </SectionFields>
          <SectionFields title="Footer">
            <TextField label="Copyright" value={data.footer.copyright} onChange={(e) => set('footer', 'copyright', e.target.value)} fullWidth />
            <FormControlLabel control={<Switch checked={!!data.footer.show_founder} onChange={(e) => set('footer', 'show_founder', e.target.checked)} />} label="Show founder in footer" />
          </SectionFields>
        </>
      )}

      {tab === 5 && (
        <>
          <SectionFields title="SEO">
            {['title', 'description', 'keywords'].map((f) => (
              <TextField key={f} label={f} value={data.seo[f] || ''} onChange={(e) => set('seo', f, e.target.value)} fullWidth multiline={f !== 'title'} rows={f === 'description' ? 3 : 1} />
            ))}
          </SectionFields>
          <SectionFields title="About Page (HTML)">
            <TextField multiline rows={8} fullWidth value={data.about?.content || ''} onChange={(e) => setData((d) => ({ ...d, about: { content: e.target.value } }))} />
          </SectionFields>
          <SectionFields title="Privacy Policy (HTML)">
            <TextField multiline rows={6} fullWidth value={data.privacy?.content || ''} onChange={(e) => setData((d) => ({ ...d, privacy: { content: e.target.value } }))} />
          </SectionFields>
          <SectionFields title="Terms (HTML)">
            <TextField multiline rows={6} fullWidth value={data.terms?.content || ''} onChange={(e) => setData((d) => ({ ...d, terms: { content: e.target.value } }))} />
          </SectionFields>
        </>
      )}

      {tab === 6 && (
        <SectionFields title="Homepage Section Visibility">
          {Object.entries(data.section_visibility || {}).map(([key, val]) => (
            <FormControlLabel
              key={key}
              control={<Switch checked={!!val} onChange={(e) => setData((d) => ({ ...d, section_visibility: { ...d.section_visibility, [key]: e.target.checked } }))} />}
              label={key.replace(/_/g, ' ')}
            />
          ))}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Statistics and Quick Actions are managed under Website Statistics and Quick Actions collections (use Firestore or add list pages later).
          </Typography>
        </SectionFields>
      )}

      <Button variant="contained" size="large" onClick={save} sx={{ mt: 2 }}>
        Save Website Settings
      </Button>
    </Box>
  );
}
