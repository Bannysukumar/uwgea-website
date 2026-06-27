import { useEffect, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import {
  Box, Button, Card, CardContent, Stack, TextField, Typography, Tabs, Tab, Switch, FormControlLabel,
} from '@mui/material';
import { db } from '@/firebase/app';
import { COLLECTIONS, STORAGE_PATHS } from '@/firebase/collections';
import PageHeader from '@/components/common/PageHeader';
import FileDropzone from '@/components/forms/FileDropzone';
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

function quickLinksToText(links = []) {
  return links.map((l) => `${l.label}|${l.path}`).join('\n');
}

function textToQuickLinks(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split('|');
      return { label: label?.trim() || '', path: rest.join('|').trim() || '/' };
    })
    .filter((l) => l.label);
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
          donation: { ...prev.donation, ...snap.data().donation },
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

  const pageMap = [
    { page: 'Home — Hero, Founder, Mission', tab: 'Hero / Founder / Mission & Vision tabs' },
    { page: 'Footer (all columns & links)', tab: 'Footer tab' },
    { page: 'Home — Header branding', tab: 'Organization tab' },
    { page: 'Home — Sponsorship & Donation (bank + QR)', tab: 'Sponsorship & Donation tab' },
    { page: 'About, Privacy, Terms pages', tab: 'SEO & Pages tab' },
    { page: 'Contact page details', tab: 'Contact & Footer tab' },
    { page: 'Home statistics, quick actions, sponsors', tab: 'Sidebar → Public Website section' },
    { page: 'Leadership, News, Gallery, GOs, etc.', tab: 'Sidebar → Public Website section' },
  ];

  return (
    <Box>
      <PageHeader
        title="Site Settings & Pages"
        subtitle="Manage homepage sections and static pages — changes appear on uwgea.org instantly"
      />
      <Card sx={{ mb: 2, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.light' }}>
        <CardContent>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom color="primary.main">
            Public website page guide
          </Typography>
          {pageMap.map((row) => (
            <Typography key={row.page} variant="body2" sx={{ mb: 0.5 }}>
              <strong>{row.page}</strong> → {row.tab}
            </Typography>
          ))}
        </CardContent>
      </Card>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }} variant="scrollable">
        <Tab label="Hero" />
        <Tab label="Organization" />
        <Tab label="Founder" />
        <Tab label="Mission & Vision" />
        <Tab label="Contact" />
        <Tab label="Footer" />
        <Tab label="Sponsorship & Donation" />
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
        <SectionFields title="Contact Page & Footer Contact Info">
          {['address', 'phone', 'email', 'map_embed_url', 'facebook', 'twitter', 'instagram', 'youtube', 'whatsapp'].map((f) => (
            <TextField key={f} label={f.replace(/_/g, ' ')} value={data.contact[f] || ''} onChange={(e) => set('contact', f, e.target.value)} fullWidth />
          ))}
          <Typography variant="body2" color="text.secondary">
            Social URLs are used in the footer &quot;Connect with Us&quot; section. Manage visibility in the Footer tab.
          </Typography>
        </SectionFields>
      )}

      {tab === 5 && (
        <>
          <SectionFields title="Footer — Brand Column">
            <Typography variant="body2" color="text.secondary">
              Organization name, taglines and website URL come from the <strong>Organization</strong> tab. Founder block uses the <strong>Founder</strong> tab.
            </Typography>
            <TextField
              label="Extra text (optional)"
              value={data.footer?.extra_text || ''}
              onChange={(e) => set('footer', 'extra_text', e.target.value)}
              fullWidth
              multiline
              rows={2}
              helperText="Additional paragraph below brand info in footer"
            />
            <TextField
              label="Background color"
              value={data.footer?.background_color || '#1A1A1A'}
              onChange={(e) => set('footer', 'background_color', e.target.value)}
              fullWidth
              helperText="Hex color e.g. #1A1A1A"
            />
            <FormControlLabel
              control={<Switch checked={data.footer?.show_founder !== false} onChange={(e) => set('footer', 'show_founder', e.target.checked)} />}
              label="Show founder name & designation"
            />
          </SectionFields>

          <SectionFields title="Footer — Quick Links Column">
            <FormControlLabel
              control={<Switch checked={data.footer?.show_quick_links !== false} onChange={(e) => set('footer', 'show_quick_links', e.target.checked)} />}
              label="Show quick links column"
            />
            <TextField
              label="Quick links heading"
              value={data.footer?.quick_links_title || 'Quick Links'}
              onChange={(e) => set('footer', 'quick_links_title', e.target.value)}
              fullWidth
            />
            <TextField
              label="Quick links (one per line: Label|/path)"
              value={quickLinksToText(data.footer?.quick_links)}
              onChange={(e) => set('footer', 'quick_links', textToQuickLinks(e.target.value))}
              fullWidth
              multiline
              rows={12}
              helperText="Example: About UWGEA|/about — add, remove or reorder links here"
            />
          </SectionFields>

          <SectionFields title="Footer — Contact & Social Column">
            <FormControlLabel
              control={<Switch checked={data.footer?.show_contact_info !== false} onChange={(e) => set('footer', 'show_contact_info', e.target.checked)} />}
              label="Show contact address, phone & email"
            />
            <TextField
              label="Contact column heading"
              value={data.footer?.contact_title || 'Contact'}
              onChange={(e) => set('footer', 'contact_title', e.target.value)}
              fullWidth
            />
            <FormControlLabel
              control={<Switch checked={data.footer?.show_social_links !== false} onChange={(e) => set('footer', 'show_social_links', e.target.checked)} />}
              label="Show social media icons"
            />
            <TextField
              label="Social column heading"
              value={data.footer?.connect_title || 'Connect with Us'}
              onChange={(e) => set('footer', 'connect_title', e.target.value)}
              fullWidth
            />
            <Typography variant="subtitle2" fontWeight={600}>Show social icons</Typography>
            {[
              ['show_facebook', 'Facebook'],
              ['show_twitter', 'Twitter / X'],
              ['show_instagram', 'Instagram'],
              ['show_youtube', 'YouTube'],
              ['show_whatsapp', 'WhatsApp'],
            ].map(([key, label]) => (
              <FormControlLabel
                key={key}
                control={<Switch checked={data.footer?.[key] !== false} onChange={(e) => set('footer', key, e.target.checked)} />}
                label={label}
              />
            ))}
            <Typography variant="body2" color="text.secondary">
              Social URLs are edited in the Contact tab.
            </Typography>
          </SectionFields>

          <SectionFields title="Footer — Legal Links & Copyright">
            <FormControlLabel
              control={<Switch checked={data.footer?.show_privacy_terms !== false} onChange={(e) => set('footer', 'show_privacy_terms', e.target.checked)} />}
              label="Show Privacy & Terms links"
            />
            <TextField label="Privacy label" value={data.footer?.privacy_label || ''} onChange={(e) => set('footer', 'privacy_label', e.target.value)} fullWidth />
            <TextField label="Privacy path" value={data.footer?.privacy_path || '/privacy'} onChange={(e) => set('footer', 'privacy_path', e.target.value)} fullWidth />
            <TextField label="Terms label" value={data.footer?.terms_label || ''} onChange={(e) => set('footer', 'terms_label', e.target.value)} fullWidth />
            <TextField label="Terms path" value={data.footer?.terms_path || '/terms'} onChange={(e) => set('footer', 'terms_path', e.target.value)} fullWidth />
            <TextField label="Copyright text" value={data.footer?.copyright || ''} onChange={(e) => set('footer', 'copyright', e.target.value)} fullWidth multiline rows={2} />
          </SectionFields>
        </>
      )}

      {tab === 6 && (
        <>
          <SectionFields title="Section Headings">
            {['section_title', 'sponsors_heading', 'donation_heading', 'qr_caption'].map((f) => (
              <TextField key={f} label={f.replace(/_/g, ' ')} value={data.donation?.[f] || ''} onChange={(e) => set('donation', f, e.target.value)} fullWidth />
            ))}
            <FormControlLabel
              control={<Switch checked={data.donation?.show_account_details !== false} onChange={(e) => set('donation', 'show_account_details', e.target.checked)} />}
              label="Show account details label on homepage"
            />
          </SectionFields>
          <SectionFields title="Bank Account Details">
            {['account_name', 'account_number', 'bank_name', 'ifsc_code'].map((f) => (
              <TextField key={f} label={f.replace(/_/g, ' ')} value={data.donation?.[f] || ''} onChange={(e) => set('donation', f, e.target.value)} fullWidth />
            ))}
          </SectionFields>
          <SectionFields title="UPI QR Code">
            <FileDropzone
              label="Donation QR Code (Scanner Image)"
              accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
              storagePath={STORAGE_PATHS.WEBSITE}
              currentUrl={data.donation?.qr_code_url}
              onUploaded={(url) => set('donation', 'qr_code_url', url)}
            />
            <TextField
              label="QR image URL (or paste link)"
              value={data.donation?.qr_code_url || ''}
              onChange={(e) => set('donation', 'qr_code_url', e.target.value)}
              fullWidth
            />
            <Typography variant="body2" color="text.secondary">
              Manage sponsor logos under Admin → Sponsors. This section appears on the homepage above Latest Updates.
            </Typography>
          </SectionFields>
        </>
      )}

      {tab === 7 && (
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

      {tab === 8 && (
        <SectionFields title="Homepage Section Visibility">
          {Object.entries(data.section_visibility || {}).map(([key, val]) => (
            <FormControlLabel
              key={key}
              control={<Switch checked={!!val} onChange={(e) => setData((d) => ({ ...d, section_visibility: { ...d.section_visibility, [key]: e.target.checked } }))} />}
              label={key.replace(/_/g, ' ')}
            />
          ))}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Toggle homepage sections on/off. Other website pages are managed from the sidebar under <strong>Public Website</strong>.
          </Typography>
        </SectionFields>
      )}

      <Button variant="contained" size="large" onClick={save} sx={{ mt: 2 }}>
        Save Website Settings
      </Button>
    </Box>
  );
}
