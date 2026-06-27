import { Box, Container, Typography, Divider } from '@mui/material';
import { FadeIn } from '@/features/public/components/AnimatedCounter';

function AccountRow({ label, value }) {
  if (!value) return null;
  return (
    <Typography variant="body2" sx={{ mb: 0.75, lineHeight: 1.6 }}>
      <Box component="span" sx={{ fontWeight: 700, mr: 0.5 }}>
        {label}:
      </Box>
      {value}
    </Typography>
  );
}

export default function SponsorshipDonationSection({ donation, sponsors = [] }) {
  const activeSponsors = sponsors.filter((s) => s.is_active !== false);
  const hasDonation =
    donation?.account_name ||
    donation?.account_number ||
    donation?.bank_name ||
    donation?.ifsc_code ||
    donation?.qr_code_url;
  const hasContent = activeSponsors.length > 0 || hasDonation;

  if (!hasContent) return null;

  return (
    <Box sx={{ py: { xs: 5, md: 7 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <FadeIn>
          <Typography
            variant="h4"
            fontWeight={800}
            textAlign="center"
            gutterBottom
            sx={{ mb: { xs: 3, md: 4 } }}
          >
            {donation?.section_title || 'Sponsorship & Donation'}
          </Typography>

          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              bgcolor: 'grey.50',
              p: { xs: 2.5, md: 4 },
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: { xs: 3, md: 4 },
                alignItems: 'stretch',
              }}
            >
              {/* Sponsors */}
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={800}
                  letterSpacing={1}
                  sx={{ mb: 2, textTransform: 'uppercase' }}
                >
                  {donation?.sponsors_heading || 'Sponsors'}
                </Typography>
                {activeSponsors.length ? (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(2, 1fr)' },
                      gap: 2,
                    }}
                  >
                    {activeSponsors.map((sponsor) => (
                      <Box
                        key={sponsor.id}
                        sx={{
                          bgcolor: '#fff',
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2,
                          p: 2,
                          textAlign: 'center',
                          minHeight: 120,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'box-shadow 0.2s',
                          '&:hover': { boxShadow: 2 },
                        }}
                      >
                        {sponsor.logo_url ? (
                          <Box
                            component="img"
                            src={sponsor.logo_url}
                            alt={sponsor.name}
                            sx={{
                              maxWidth: '100%',
                              maxHeight: 56,
                              objectFit: 'contain',
                              mb: 1,
                              filter: 'grayscale(20%)',
                            }}
                          />
                        ) : (
                          <Typography variant="h6" fontWeight={800} color="text.secondary" sx={{ mb: 1 }}>
                            {sponsor.name}
                          </Typography>
                        )}
                        {(sponsor.description || sponsor.name) && (
                          <Typography variant="caption" color="text.secondary">
                            {sponsor.description || sponsor.name}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Sponsor logos will appear here once added from the admin panel.
                  </Typography>
                )}
              </Box>

              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
              <Divider sx={{ display: { xs: 'block', md: 'none' } }} />

              {/* Donation details */}
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={800}
                  letterSpacing={1}
                  sx={{ mb: 0.5, textTransform: 'uppercase' }}
                >
                  {donation?.donation_heading || 'Sponsorship & Donation'}
                </Typography>
                {donation?.show_account_details !== false && (
                  <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 2 }}>
                    Show account Details
                  </Typography>
                )}

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: donation?.qr_code_url ? { xs: '1fr', sm: '1fr auto' } : '1fr',
                    gap: 3,
                    alignItems: 'start',
                  }}
                >
                  <Box>
                    <AccountRow label="Name" value={donation?.account_name} />
                    <AccountRow label="A/C No" value={donation?.account_number} />
                    <AccountRow label="Bank" value={donation?.bank_name} />
                    <AccountRow label="IFSC" value={donation?.ifsc_code} />
                  </Box>

                  {donation?.qr_code_url && (
                    <Box sx={{ textAlign: 'center' }}>
                      <Box
                        component="img"
                        src={donation.qr_code_url}
                        alt="Donation QR Code"
                        sx={{
                          width: { xs: 160, sm: 180 },
                          height: { xs: 160, sm: 180 },
                          objectFit: 'contain',
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2,
                          bgcolor: '#fff',
                          p: 1,
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                        {donation?.qr_caption || 'Scan to Donate (UPI)'}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </FadeIn>
      </Container>
    </Box>
  );
}
