import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { Box, Container, Typography, Card, CardContent, Avatar, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { db } from '@/firebase/app';
import { COLLECTIONS } from '@/firebase/collections';
import { FadeIn } from '@/features/public/components/AnimatedCounter';

export default function LeadershipPreview() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    let fallbackUnsub = null;
    const q = query(
      collection(db, COLLECTIONS.LEADERS),
      where('is_active', '==', true),
      orderBy('priority', 'asc'),
    );
    const unsub = onSnapshot(
      q,
      (snap) => setLeaders(snap.docs.slice(0, 4).map((d) => ({ id: d.id, ...d.data() }))),
      () => {
        fallbackUnsub = onSnapshot(collection(db, COLLECTIONS.LEADERS), (s) =>
          setLeaders(s.docs.slice(0, 4).map((d) => ({ id: d.id, ...d.data() }))),
        );
      },
    );
    return () => {
      unsub();
      fallbackUnsub?.();
    };
  }, []);

  if (!leaders.length) return null;

  return (
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            Leadership
          </Typography>
          <Button component={RouterLink} to="/leadership">
            View All
          </Button>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
          {leaders.map((leader) => (
            <FadeIn key={leader.id}>
              <Card sx={{ textAlign: 'center', height: '100%' }}>
                <CardContent>
                  <Avatar src={leader.image_url} sx={{ width: 88, height: 88, mx: 'auto', mb: 2 }}>
                    {leader.name?.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" fontWeight={700}>
                    {leader.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {leader.designation}
                  </Typography>
                  {leader.district && (
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                      {leader.district}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
