import { Box, Container, Card, CardContent, Typography, Stack, Link } from '@mui/material';
import { FadeIn } from '@/features/public/components/AnimatedCounter';

export default function FounderSection({ founder }) {
  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <FadeIn>
          <Card>
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 4, alignItems: 'center' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    component="img"
                    src={founder.photo_url || undefined}
                    alt={founder.name}
                    sx={{
                      width: '100%',
                      maxWidth: 280,
                      aspectRatio: '3 / 4',
                      objectFit: 'cover',
                      borderRadius: 3,
                      mx: 'auto',
                      display: 'block',
                      border: '4px solid',
                      borderColor: 'primary.main',
                      boxShadow: 4,
                    }}
                  />
                  {founder.signature_url && (
                    <Box component="img" src={founder.signature_url} alt="Signature" sx={{ mt: 2, maxHeight: 60 }} />
                  )}
                </Box>
                <Box>
                  <Typography variant="overline" color="primary" fontWeight={700}>
                    {founder.org_line}
                  </Typography>
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    {founder.name}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {founder.designation}
                  </Typography>
                  {founder.biography && (
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2, lineHeight: 1.8 }}>
                      {founder.biography}
                    </Typography>
                  )}
                  {founder.message && (
                    <Box sx={{ mt: 3, p: 2.5, bgcolor: 'grey.50', borderLeft: 4, borderColor: 'primary.main', borderRadius: 1 }}>
                      <Typography variant="body1" fontStyle="italic">
                        &ldquo;{founder.message}&rdquo;
                      </Typography>
                    </Box>
                  )}
                  <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: 'wrap' }}>
                    {founder.facebook && <Link href={founder.facebook} target="_blank" rel="noopener">Facebook</Link>}
                    {founder.twitter && <Link href={founder.twitter} target="_blank" rel="noopener">Twitter</Link>}
                    {founder.instagram && <Link href={founder.instagram} target="_blank" rel="noopener">Instagram</Link>}
                    {founder.linkedin && <Link href={founder.linkedin} target="_blank" rel="noopener">LinkedIn</Link>}
                  </Stack>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </FadeIn>
      </Container>
    </Box>
  );
}
