import { Box, Container, Typography, Button, Stack, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { motion } from 'framer-motion';
import { uwgeaBrand } from '@/features/public/theme/publicTheme';

export default function HeroSection({ hero }) {
  const bg = hero.background_image_url || '/logo.jpg';

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: '85vh', md: '92vh' },
        display: 'flex',
        alignItems: 'center',
        color: '#fff',
        overflow: 'hidden',
        backgroundImage: `${uwgeaBrand.heroOverlay}, url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 8, md: 10 } }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Chip label={hero.unity} sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600 }} />
          <Typography variant="h2" component="h1" fontWeight={800} sx={{ fontSize: { xs: '2rem', md: '3.25rem' } }}>
            {hero.heading}
          </Typography>
          <Typography variant="h5" sx={{ mt: 1.5, opacity: 0.95, maxWidth: 720, fontWeight: 500 }}>
            {hero.subheading}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2, fontFamily: 'inherit', opacity: 0.9 }}>
            {hero.tagline_te}
          </Typography>
          <Typography variant="body1" sx={{ mt: 0.5, opacity: 0.85, maxWidth: 640 }}>
            {hero.tagline_en}
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 3, fontWeight: 600, letterSpacing: 0.5 }}>
            {hero.motto}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
            <Button component={RouterLink} to={hero.cta_primary_link} variant="contained" size="large" color="secondary">
              {hero.cta_primary_label}
            </Button>
            <Button
              component={RouterLink}
              to={hero.cta_secondary_link}
              variant="outlined"
              size="large"
              sx={{ borderColor: '#fff', color: '#fff', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              {hero.cta_secondary_label}
            </Button>
            <Button
              component={RouterLink}
              to={hero.cta_tertiary_link}
              variant="text"
              size="large"
              sx={{ color: '#fff' }}
            >
              {hero.cta_tertiary_label}
            </Button>
          </Stack>
        </motion.div>
      </Container>
      {hero.show_scroll_indicator && (
        <Box sx={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', opacity: 0.7 }}>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
            <KeyboardArrowDownIcon sx={{ fontSize: 36 }} />
          </motion.div>
        </Box>
      )}
    </Box>
  );
}
