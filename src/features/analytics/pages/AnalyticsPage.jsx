import { Card, CardContent, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
import PageHeader from '@/components/common/PageHeader';

export default function AnalyticsPage() {
  const options = {
    chart: { type: 'bar' },
    xaxis: { categories: ['Home', 'Feed', 'News', 'Live', 'Events', 'Profile'] },
    colors: ['#5B4CFF'],
  };
  const series = [{ name: 'Screen Views', data: [420, 380, 290, 180, 150, 220] }];

  return (
    <>
      <PageHeader title="Analytics" subtitle="App usage, retention, and device metrics" />
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Screen Views</Typography>
          <Chart options={options} series={series} type="bar" height={360} />
        </CardContent>
      </Card>
    </>
  );
}
