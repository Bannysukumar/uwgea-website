import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Chip, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { MaterialReactTable } from 'material-react-table';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/app';
import { COLLECTIONS } from '@/firebase/collections';
import PageHeader from '@/components/common/PageHeader';
import { adminPath } from '@/utils/paths';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from 'react-toastify';

export default function PlansPage() {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(
      collection(db, COLLECTIONS.PLANS),
      (snap) => {
        const items = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
        setRows(items);
        setLoading(false);
      },
      (err) => {
        toast.error(err.message || 'Failed to load plans');
        setLoading(false);
      },
    );
    return unsub;
  }, []);

  const columns = useMemo(
    () => [
      { accessorKey: 'name', header: 'Plan Name' },
      { accessorKey: 'price', header: 'Price (₹)' },
      { accessorKey: 'validity_days', header: 'Validity (Days)' },
      {
        accessorKey: 'is_active',
        header: 'Active',
        Cell: ({ cell }) => (
          <Chip size="small" label={cell.getValue() ? 'Yes' : 'No'} color={cell.getValue() ? 'success' : 'default'} />
        ),
      },
      {
        accessorKey: 'is_recommended',
        header: 'Recommended',
        Cell: ({ cell }) => (cell.getValue() ? <Chip size="small" label="Popular" color="primary" /> : '—'),
      },
      { accessorKey: 'display_order', header: 'Order' },
    ],
    [],
  );

  const handleDelete = async (planId, planName) => {
    if (!window.confirm(`Delete plan "${planName}"?`)) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.PLANS, planId));
      toast.success('Plan deleted');
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    }
  };

  return (
    <Box>
      <PageHeader
        title="Subscription Plans"
        subtitle="Create and manage membership plans — changes sync instantly to the app"
        actionLabel={can('subscription_plans', 'write') ? 'Add Plan' : null}
        onAction={can('subscription_plans', 'write') ? () => navigate(adminPath('/subscription-plans/new')) : null}
      />

      <MaterialReactTable
        columns={columns}
        data={rows}
        state={{ isLoading: loading }}
        enableRowActions
        enableColumnFilters
        enableGlobalFilter
        initialState={{ pagination: { pageSize: 15, pageIndex: 0 } }}
        renderRowActions={({ row }) => (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {can('subscription_plans', 'edit') && (
              <Tooltip title="Edit plan">
                <IconButton
                  size="small"
                  onClick={() => navigate(adminPath(`/subscription-plans/${row.original.id}/edit`))}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {can('subscription_plans', 'delete') && (
              <Tooltip title="Delete plan">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(row.original.id, row.original.name)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}
      />
    </Box>
  );
}
