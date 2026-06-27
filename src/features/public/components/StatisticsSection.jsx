import { Box, Container, Card, CardContent, Typography } from '@mui/material';
import AnimatedCounter, { FadeIn } from '@/features/public/components/AnimatedCounter';
import { uwgeaBrand } from '@/features/public/theme/publicTheme';

export default function StatisticsSection({ items }) {
  return (
    <Box sx={{ py: { xs: 6, md: 8 }, background: uwgeaBrand.gradient }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          {items.map((stat, i) => (
            <FadeIn key={stat.id || i} delay={i * 0.08}>
              <Card sx={{ textAlign: 'center', height: '100%', bgcolor: 'rgba(255,255,255,0.97)' }}>
                <CardContent sx={{ py: 3 }}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix || ''} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
