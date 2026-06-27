import { Box, Container, Typography, Link, Stack, Divider, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Link as RouterLink } from 'react-router-dom';
import { PUBLIC_NAV } from '@/features/public/constants/defaults';

const socialIconSx = {
  color: '#fff',
  bgcolor: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.15)',
  transition: 'transform 0.2s ease, background-color 0.2s ease',
  '&:hover': { transform: 'translateY(-2px)' },
};

function SocialButton({ href, label, icon: Icon, hoverColor }) {
  return (
    <IconButton
      component="a"
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={label}
      title={label}
      sx={{
        ...socialIconSx,
        '&:hover': { ...socialIconSx['&:hover'], bgcolor: hoverColor, borderColor: hoverColor },
      }}
    >
      <Icon />
    </IconButton>
  );
}

function FooterLink({ item }) {
  const isExternal = item.path?.startsWith('http');
  if (isExternal) {
    return (
      <Link href={item.path} target="_blank" rel="noopener" color="inherit" underline="hover" variant="body2" sx={{ opacity: 0.85 }}>
        {item.label}
      </Link>
    );
  }
  return (
    <Link component={RouterLink} to={item.path || '/'} color="inherit" underline="hover" variant="body2" sx={{ opacity: 0.85 }}>
      {item.label}
    </Link>
  );
}

export default function PublicFooter({ settings }) {
  const org = settings.organization || {};
  const founder = settings.founder || {};
  const contact = settings.contact || {};
  const footer = settings.footer || {};

  const quickLinks =
    footer.quick_links?.length > 0
      ? footer.quick_links
      : PUBLIC_NAV.map(({ label, path }) => ({ label, path }));

  const bgColor = footer.background_color || '#1A1A1A';

  const socialItems = [
    { key: 'facebook', url: contact.facebook, icon: FacebookIcon, color: '#1877F2', show: footer.show_facebook !== false },
    { key: 'twitter', url: contact.twitter, icon: TwitterIcon, color: '#1DA1F2', show: footer.show_twitter !== false },
    { key: 'instagram', url: contact.instagram, icon: InstagramIcon, color: '#E4405F', show: footer.show_instagram !== false },
    { key: 'youtube', url: contact.youtube, icon: YouTubeIcon, color: '#FF0000', show: footer.show_youtube !== false },
    { key: 'whatsapp', url: contact.whatsapp, icon: WhatsAppIcon, color: '#25D366', show: footer.show_whatsapp !== false },
  ].filter((s) => s.show && s.url);

  return (
    <Box component="footer" sx={{ bgcolor: bgColor, color: '#fff', pt: 6, pb: 3, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' }, gap: 4 }}>
          {/* Brand column */}
          <Box>
            <Typography variant="h6" fontWeight={800} gutterBottom>
              {org.name}
            </Typography>
            {org.full_name && (
              <Typography variant="body2" sx={{ opacity: 0.85, mb: 1 }}>
                {org.full_name}
              </Typography>
            )}
            {org.tagline_te && (
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                {org.tagline_te}
              </Typography>
            )}
            {org.tagline_en && (
              <Typography variant="body2" sx={{ opacity: 0.75, mb: 2 }}>
                {org.tagline_en}
              </Typography>
            )}
            {org.unity && (
              <Typography variant="body2" sx={{ opacity: 0.75 }}>
                {org.unity}
              </Typography>
            )}
            {footer.extra_text && (
              <Typography variant="body2" sx={{ opacity: 0.75, mt: 2 }}>
                {footer.extra_text}
              </Typography>
            )}
            {footer.show_founder !== false && founder.name && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  {founder.name}
                </Typography>
                {founder.designation && (
                  <Typography variant="caption" sx={{ opacity: 0.75 }}>
                    {founder.designation}
                  </Typography>
                )}
              </Box>
            )}
            {org.website_url && (
              <Link href={org.website_url} target="_blank" rel="noopener" sx={{ color: 'secondary.light', display: 'block', mt: 1 }}>
                {org.website_url.replace(/^https?:\/\//, '')}
              </Link>
            )}
          </Box>

          {/* Quick links */}
          {footer.show_quick_links !== false && (
            <Box>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                {footer.quick_links_title || 'Quick Links'}
              </Typography>
              <Stack spacing={0.5}>
                {quickLinks.map((item) => (
                  <FooterLink key={`${item.path}-${item.label}`} item={item} />
                ))}
              </Stack>
            </Box>
          )}

          {/* Contact & social */}
          <Box>
            {footer.show_contact_info !== false && (
              <>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  {footer.contact_title || 'Contact'}
                </Typography>
                {contact.address && <Typography variant="body2" sx={{ opacity: 0.85 }}>{contact.address}</Typography>}
                {contact.phone && <Typography variant="body2" sx={{ opacity: 0.85 }}>{contact.phone}</Typography>}
                {contact.email && (
                  <Link href={`mailto:${contact.email}`} color="inherit" variant="body2" sx={{ opacity: 0.85, display: 'block' }}>
                    {contact.email}
                  </Link>
                )}
              </>
            )}

            {footer.show_social_links !== false && socialItems.length > 0 && (
              <Box sx={{ mt: footer.show_contact_info !== false ? 2 : 0 }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  {footer.connect_title || 'Connect with Us'}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {socialItems.map((s) => (
                    <SocialButton key={s.key} href={s.url} label={s.key} icon={s.icon} hoverColor={s.color} />
                  ))}
                </Stack>
              </Box>
            )}

            {footer.show_privacy_terms !== false && (
              <Stack spacing={0.5} sx={{ mt: 2 }}>
                {footer.privacy_path && (
                  <Link component={RouterLink} to={footer.privacy_path} color="inherit" variant="body2">
                    {footer.privacy_label || 'Privacy Policy'}
                  </Link>
                )}
                {footer.terms_path && (
                  <Link component={RouterLink} to={footer.terms_path} color="inherit" variant="body2">
                    {footer.terms_label || 'Terms & Conditions'}
                  </Link>
                )}
              </Stack>
            )}
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
