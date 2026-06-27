import { useEffect, useMemo, useState } from 'react';
import {
  Box, Button, Chip, MenuItem, Stack, TextField,
} from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/firebase/app';
import { db } from '@/firebase/app';
import { COLLECTIONS } from '@/firebase/collections';
import PageHeader from '@/components/common/PageHeader';
import { toast } from 'react-toastify';

export default function SubscribersPage() {
  const [rows, setRows] = useState([]);
  const [plans, setPlans] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [extendDays, setExtendDays] = useState(30);
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, COLLECTIONS.SUBSCRIPTIONS), (snap) => {
      setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    const planUnsub = onSnapshot(query(collection(db, COLLECTIONS.PLANS), orderBy('display_order')), (snap) => {
      setPlans(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => { unsub(); planUnsub(); };
  }, []);

  const filtered = useMemo(() => rows.filter((r) => {
    if (statusFilter !== 'all' && r.subscription_status !== statusFilter) return false;
    if (planFilter !== 'all' && r.plan_id !== planFilter) return false;
    if (search && !`${r.user_id} ${r.plan_name}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [rows, statusFilter, planFilter, search]);

  const columns = useMemo(() => [
    { accessorKey: 'user_id', header: 'User ID' },
    { accessorKey: 'plan_name', header: 'Plan' },
    {
      accessorKey: 'subscription_status',
      header: 'Status',
      Cell: ({ cell }) => {
        const v = cell.getValue();
        const color = v === 'active' ? 'success' : v === 'trial' ? 'info' : v === 'expired' ? 'error' : 'default';
        return <Chip size="small" label={v} color={color} />;
      },
    },
    { accessorKey: 'remaining_days', header: 'Days Left' },
    { accessorKey: 'payment_status', header: 'Payment' },
    {
      accessorKey: 'trial_end_date',
      header: 'Trial End',
      Cell: ({ cell }) => cell.getValue()?.toDate?.()?.toLocaleDateString?.() || '—',
    },
    {
      accessorKey: 'subscription_end_date',
      header: 'Sub End',
      Cell: ({ cell }) => cell.getValue()?.toDate?.()?.toLocaleDateString?.() || '—',
    },
  ], []);

  const adminManage = httpsCallable(functions, 'adminManageSubscription');

  const runAction = async (action, extra = {}) => {
    if (!selectedUser) { toast.error('Select a subscriber row first'); return; }
    try {
      await adminManage({ userId: selectedUser, action, ...extra });
      toast.success('Updated');
    } catch (e) {
      toast.error(e.message || 'Action failed');
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: filtered,
    enableRowSelection: false,
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => setSelectedUser(row.original.user_id || row.original.id),
      sx: { cursor: 'pointer', bgcolor: selectedUser === (row.original.user_id || row.original.id) ? 'action.selected' : undefined },
    }),
  });

  const exportCsv = () => {
    const header = 'user_id,plan_name,status,remaining_days,payment_status\n';
    const body = filtered.map((r) => `${r.user_id},${r.plan_name},${r.subscription_status},${r.remaining_days},${r.payment_status}`).join('\n');
    const blob = new Blob([header + body], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'subscribers.csv';
    a.click();
  };

  return (
    <>
      <PageHeader title="Subscribers" subtitle="View and manage user subscriptions" />
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }} flexWrap="wrap">
        <TextField size="small" label="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        <TextField size="small" select label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 140 }}>
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="trial">Trial</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="expired">Expired</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </TextField>
        <TextField size="small" select label="Plan" value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} sx={{ minWidth: 160 }}>
          <MenuItem value="all">All Plans</MenuItem>
          {plans.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
        </TextField>
        <Button variant="outlined" onClick={exportCsv}>Export CSV</Button>
      </Stack>
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField size="small" type="number" label="Extend days" value={extendDays} onChange={(e) => setExtendDays(Number(e.target.value))} sx={{ width: 120 }} />
          <Button size="small" variant="contained" onClick={() => runAction('extend', { extendDays })}>Extend</Button>
          <Button size="small" color="error" onClick={() => runAction('cancel')}>Cancel Sub</Button>
          {plans.map((p) => (
            <Button key={p.id} size="small" variant="outlined" onClick={() => runAction('activate', { planId: p.id })}>
              Activate {p.name}
            </Button>
          ))}
        </Stack>
        {selectedUser && <Chip sx={{ mt: 1 }} label={`Selected: ${selectedUser}`} />}
      </Box>
      <MaterialReactTable table={table} />
    </>
  );
}
