import { Box, Container, Typography, Link, Stack, Divider, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Link as RouterLink } from 'react-router-dom';
import { PUBLIC_NAV } from '@/features/public/constants/defaults';

const socialIconSx = {
  color: '#fff',
  bgcolor: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.15)',
  transition: 'transform 0.2s ease, background-color 0.2s ease',
  '&:hover': { transform: 'translateY(-2px)' },
};

export default function PublicFooter({ settings }) {
  const org = settings.organization;
  const founder = settings.founder;
  const contact = settings.contact;
  const footer = settings.footer;

  return (
    <Box component="footer" sx={{ bgcolor: '#1A1A1A', color: '#fff', pt: 6, pb: 3, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' }, gap: 4 }}>
          <Box>
            <Typography variant="h6" fontWeight={800} gutterBottom>
              {org.name}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, mb: 1 }}>
              {org.full_name}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              {org.tagline_te}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.75, mb: 2 }}>
              {org.tagline_en}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.75 }}>
              {org.unity}
            </Typography>
            {footer.show_founder && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  {founder.name}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.75 }}>
                  {founder.designation}
                </Typography>
              </Box>
            )}
            {org.website_url && (
              <Link href={org.website_url} target="_blank" rel="noopener" sx={{ color: 'secondary.light', display: 'block', mt: 1 }}>
                {org.website_url.replace(/^https?:\/\//, '')}
              </Link>
            )}
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Quick Links
            </Typography>
            <Stack spacing={0.5}>
              {PUBLIC_NAV.slice(0, 8).map((item) => (
                <Link key={item.path} component={RouterLink} to={item.path} color="inherit" underline="hover" variant="body2" sx={{ opacity: 0.85 }}>
                  {item.label}
                </Link>
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Contact
            </Typography>
            {contact.address && <Typography variant="body2" sx={{ opacity: 0.85 }}>{contact.address}</Typography>}
            {contact.phone && <Typography variant="body2" sx={{ opacity: 0.85 }}>{contact.phone}</Typography>}
            {contact.email && (
              <Link href={`mailto:${contact.email}`} color="inherit" variant="body2" sx={{ opacity: 0.85 }}>
                {contact.email}
              </Link>
            )}
            <Stack direction="row" spacing={1.5} sx={{ mt: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              {contact.facebook && <Link href={contact.facebook} target="_blank" rel="noopener" color="inherit" variant="body2">Facebook</Link>}
              {contact.twitter && <Link href={contact.twitter} target="_blank" rel="noopener" color="inherit" variant="body2">Twitter</Link>}
              {contact.instagram && (
                <IconButton
                  component="a"
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener"
                  aria-label="Instagram"
                  title="Instagram"
                  sx={{
                    ...socialIconSx,
                    '&:hover': { ...socialIconSx['&:hover'], bgcolor: '#E4405F', borderColor: '#E4405F' },
                  }}
                >
                  <InstagramIcon />
                </IconButton>
              )}
              {contact.youtube && (
                <IconButton
                  component="a"
                  href={contact.youtube}
                  target="_blank"
                  rel="noopener"
                  aria-label="YouTube"
                  title="YouTube"
                  sx={{
                    ...socialIconSx,
                    '&:hover': { ...socialIconSx['&:hover'], bgcolor: '#FF0000', borderColor: '#FF0000' },
                  }}
                >
                  <YouTubeIcon />
                </IconButton>
              )}
            </Stack>
            <Stack spacing={0.5} sx={{ mt: 2 }}>
              <Link component={RouterLink} to="/privacy" color="inherit" variant="body2">Privacy Policy</Link>
              <Link component={RouterLink} to="/terms" color="inherit" variant="body2">Terms & Conditions</Link>
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.12)' }} />
        <Typography variant="body2" textAlign="center" sx={{ opacity: 0.65 }}>
          {footer.copyright}
        </Typography>
      </Container>
    </Box>
  );
}
