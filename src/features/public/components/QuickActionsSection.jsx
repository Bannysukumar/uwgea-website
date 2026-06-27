import CardMembershipIcon from '@mui/icons-material/CardMembership';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DownloadIcon from '@mui/icons-material/Download';
import PhoneIcon from '@mui/icons-material/Phone';
import { Box, Container, Typography, Card, CardContent, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { FadeIn, StaggerContainer, StaggerItem } from '@/features/public/components/AnimatedCounter';

const ICONS = {
  membership: CardMembershipIcon,
  grievance: ReportProblemIcon,
  download: DownloadIcon,
  phone: PhoneIcon,
};

export default function QuickActionsSection({ actions }) {
  return (
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
          Quick Actions
        </Typography>
        <StaggerContainer>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 3, mt: 3 }}>
            {actions.map((action) => {
              const Icon = ICONS[action.icon] || CardMembershipIcon;
              return (
                <StaggerItem key={action.id}>
                  <FadeIn>
                    <Card
                      sx={{
                        height: '100%',
                        transition: 'transform 0.25s, box-shadow 0.25s',
                        '&:hover': { transform: 'translateY(-6px)', boxShadow: 6 },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            bgcolor: action.color || 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                          }}
                        >
                          <Icon sx={{ color: '#fff', fontSize: 28 }} />
                        </Box>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                          {action.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 48 }}>
                          {action.description}
                        </Typography>
                        <Button component={RouterLink} to={action.link} variant="outlined" size="small" fullWidth>
                          Open
                        </Button>
                      </CardContent>
                    </Card>
                  </FadeIn>
                </StaggerItem>
              );
            })}
          </Box>
        </StaggerContainer>
      </Container>
    </Box>
  );
}
