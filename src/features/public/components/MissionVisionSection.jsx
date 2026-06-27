import { Box, Container, Typography, Card, CardContent } from '@mui/material';
import { FadeIn } from '@/features/public/components/AnimatedCounter';

export default function MissionVisionSection({ mission, vision }) {
  return (
    <Box sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <FadeIn>
            <Card sx={{ height: '100%', borderTop: 4, borderColor: 'primary.main' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom color="primary">
                  Our Mission
                </Typography>
                <Typography variant="body1" color="text.secondary" lineHeight={1.9}>
                  {mission.text}
                </Typography>
              </CardContent>
            </Card>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Card sx={{ height: '100%', borderTop: 4, borderColor: 'secondary.main' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom color="secondary.dark">
                  Our Vision
                </Typography>
                <Typography variant="body1" color="text.secondary" lineHeight={1.9}>
                  {vision.text}
                </Typography>
              </CardContent>
            </Card>
          </FadeIn>
        </Box>
      </Container>
    </Box>
  );
}
