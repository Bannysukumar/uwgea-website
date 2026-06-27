import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { Container, Typography, Card, CardContent, Button, Stack, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { db } from '@/firebase/app';
import { COLLECTIONS } from '@/firebase/collections';
import { PublicPageHero } from '@/features/public/components/PublicPageShell';
import { FadeIn } from '@/features/public/components/AnimatedCounter';

export default function JoinMembershipPage() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const q = query(collection(db, COLLECTIONS.PLANS), where('is_active', '==', true), orderBy('display_order', 'asc'));
    const unsub = onSnapshot(
      q,
      (snap) => setPlans(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      () => onSnapshot(collection(db, COLLECTIONS.PLANS), (snap) => setPlans(snap.docs.map((d) => ({ id: d.id, ...d.data() })))),
    );
    return unsub;
  }, []);

  return (
    <>
      <PublicPageHero title="Join Membership" subtitle="Become a member of UWGEA and access welfare benefits" />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="body1" color="text.secondary" paragraph>
          Download the SGSW mobile app to register and complete membership payment online.
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mt: 2 }}>
          {plans.map((plan) => (
            <FadeIn key={plan.id}>
              <Card sx={{ height: '100%', border: plan.is_recommended ? 2 : 0, borderColor: 'primary.main' }}>
                <CardContent>
                  <Typography variant="h5" fontWeight={700}>
                    {plan.name}
                  </Typography>
                  <Typography variant="h4" color="primary" fontWeight={800} sx={{ my: 2 }}>
                    ₹{plan.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Validity: {plan.validity_days} days
                  </Typography>
                  {plan.features && (
                    <Typography variant="body2" sx={{ mt: 2, whiteSpace: 'pre-line' }}>
                      {Array.isArray(plan.features) ? plan.features.join('\n') : plan.features}
                    </Typography>
                  )}
                  <Button component={RouterLink} to="/register" variant="contained" fullWidth sx={{ mt: 3 }}>
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </Box>
        {!plans.length && (
          <Typography textAlign="center" color="text.secondary" sx={{ py: 4 }}>
            Membership plans will appear here once configured in the Admin Panel.
          </Typography>
        )}
      </Container>
    </>
  );
}
