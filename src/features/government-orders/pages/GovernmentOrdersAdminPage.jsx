import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Chip, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { MaterialReactTable } from 'material-react-table';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/app';
import { COLLECTIONS } from '@/firebase/collections';
import PageHeader from '@/components/common/PageHeader';
import { adminPath } from '@/utils/paths';
import { usePermissions } from '@/hooks/usePermissions';
import { formatDateTime } from '@/utils/formatters';
import { logActivity } from '@/firebase/firestoreService';
import { useAppSelector } from '@/redux/hooks';
import { toast } from 'react-toastify';

export default function GovernmentOrdersAdminPage() {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const profile = useAppSelector((s) => s.auth.profile);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(
      collection(db, COLLECTIONS.GOVERNMENT_ORDERS),
      (snap) => {
        const items = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => {
            const ta = a.created_at?.toMillis?.() ?? a.created_at?.seconds * 1000 ?? 0;
            const tb = b.created_at?.toMillis?.() ?? b.created_at?.seconds * 1000 ?? 0;
            return tb - ta;
          });
        setRows(items);
        setLoading(false);
      },
      (err) => {
        toast.error(err.message || 'Failed to load government orders');
        setLoading(false);
      },
    );
    return unsub;
  }, []);

  const columns = useMemo(
    () => [
      { accessorKey: 'title', header: 'Title' },
      { accessorKey: 'category', header: 'Category' },
      {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ cell }) => {
          const value = cell.getValue();
          const color = value === 'published' ? 'success' : value === 'draft' ? 'warning' : 'default';
          return <Chip size="small" label={value || '—'} color={color} />;
        },
      },
      {
        accessorKey: 'file_url',
        header: 'PDF',
        Cell: ({ cell }) => {
          const url = cell.getValue();
          if (!url) return '—';
          return (
            <Button
              size="small"
              startIcon={<PictureAsPdfIcon />}
              endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
              href={url}
              target="_blank"
              rel="noopener"
            >
              View PDF
            </Button>
          );
        },
      },
      {
        accessorKey: 'created_at',
        header: 'Created',
        Cell: ({ cell }) => formatDateTime(cell.getValue()),
      },
    ],
    [],
  );

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.GOVERNMENT_ORDERS, id));
      await logActivity('delete', 'government_orders', { id, title }, profile?.uid);
      toast.success('Document deleted');
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    }
  };

  return (
    <Box>
      <PageHeader
        title="Government Orders"
        subtitle="Add, edit, or delete PDF documents — published items appear on /government-orders"
        actionLabel={can('government_orders', 'write') ? 'Add Document' : null}
        onAction={can('government_orders', 'write') ? () => navigate(adminPath('/government_orders/new')) : null}
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
            {can('government_orders', 'edit') && (
              <Tooltip title="Edit document">
                <IconButton
                  size="small"
                  onClick={() => navigate(adminPath(`/government_orders/${row.original.id}/edit`))}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {can('government_orders', 'delete') && (
              <Tooltip title="Delete document">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(row.original.id, row.original.title)}
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
