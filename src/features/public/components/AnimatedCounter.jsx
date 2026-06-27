import { useEffect, useRef, useState } from 'react';
import { Typography, Box } from '@mui/material';
import { motion, useInView } from 'framer-motion';

export default function AnimatedCounter({ value, suffix = '', duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!inView) return;
    const numeric = parseFloat(String(value).replace(/[^0-9.]/g, ''));
    if (Number.isNaN(numeric)) {
      setDisplay(String(value));
      return;
    }
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const current = Math.floor(numeric * progress);
      setDisplay(String(current));
      if (progress < 1) requestAnimationFrame(tick);
      else setDisplay(String(value).match(/^\d+/) ? String(Math.floor(numeric)) : String(value));
    };
    requestAnimationFrame(tick);
  }, [inView, value, duration]);

  const isNumericDisplay = /^\d+$/.test(display);

  return (
    <Box ref={ref}>
      <Typography variant="h3" fontWeight={800} color="primary.main" component="span">
        {isNumericDisplay ? display : value}
        {suffix}
      </Typography>
    </Box>
  );
}

export const FadeIn = ({ children, delay = 0, y = 24 }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export const StaggerContainer = ({ children, stagger = 0.08 }) => (
  <motion.div
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: '-40px' }}
    variants={{
      hidden: {},
      show: { transition: { staggerChildren: stagger } },
    }}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
    }}
  >
    {children}
  </motion.div>
);
