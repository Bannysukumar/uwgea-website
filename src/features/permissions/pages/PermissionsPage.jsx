import { Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import { DEFAULT_ROLE_PERMISSIONS, getModules } from '@/utils/permissions';
import { PERMISSION_ACTIONS, ROLE_LABELS } from '@/utils/constants';

export default function PermissionsPage() {
  const modules = getModules().slice(0, 8);

  return (
    <>
      <PageHeader title="Permissions" subtitle="Role-based permission matrix (default templates)" />
      {Object.entries(DEFAULT_ROLE_PERMISSIONS).map(([role, perms]) => (
        <Card key={role} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>{ROLE_LABELS[role] || role}</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Module</TableCell>
                  {PERMISSION_ACTIONS.map((a) => (
                    <TableCell key={a}>{a}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {modules.map((mod) => (
                  <TableRow key={mod}>
                    <TableCell>{mod}</TableCell>
                    {PERMISSION_ACTIONS.map((a) => (
                      <TableCell key={a}>{perms[mod]?.[a] ? '✓' : '—'}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
