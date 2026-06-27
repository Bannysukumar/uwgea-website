import { useCallback, useMemo, useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createCrudService, logActivity } from '@/firebase/firestoreService';
import { getModuleConfig } from '@/config/modules';
import { formatDateTime } from '@/utils/formatters';
import { exportToExcel } from '@/utils/export';
import PageHeader from '@/components/common/PageHeader';
import { adminPath } from '@/utils/paths';
import { usePermissions } from '@/hooks/usePermissions';
import { useAppSelector } from '@/redux/hooks';

export default function ResourceListPage({ moduleKey, extraActions }) {
  const config = getModuleConfig(moduleKey);
  const service = useMemo(() => createCrudService(config.collection), [config.collection]);
  const navigate = useNavigate();
  const { can } = usePermissions();
  const globalSearch = useAppSelector((s) => s.ui.globalSearch);
  const profile = useAppSelector((s) => s.auth.profile);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const items = await service.getAll();
      setData(items);
    } catch (err) {
      toast.error(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!globalSearch) return data;
    const q = globalSearch.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((v) => String(v ?? '').toLowerCase().includes(q)),
    );
  }, [data, globalSearch]);

  const columns = useMemo(
    () =>
      config.columns.map((col) => ({
        accessorKey: col,
        header: col.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        Cell: ({ cell }) => {
          const v = cell.getValue();
          if (col.includes('_at')) return formatDateTime(v);
          if (typeof v === 'boolean') return v ? 'Yes' : 'No';
          return v ?? '—';
        },
      })),
    [config.columns],
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await service.remove(id);
      await logActivity('delete', config.module, { id }, profile?.uid);
      toast.success('Deleted');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleExport = () => exportToExcel(filtered, `${config.module}.xlsx`);

  return (
    <Box>
      <PageHeader
        title={config.title}
        subtitle={`Manage ${config.title.toLowerCase()} for SGSW app`}
        actionLabel={can(config.module, 'write') ? `Add ${config.singular}` : null}
        onAction={can(config.module, 'write') ? () => navigate(adminPath(`/${config.module}/new`)) : null}
      >
        {can(config.module, 'export') && (
          <Button startIcon={<FileDownloadIcon />} onClick={handleExport}>
            Export
          </Button>
        )}
        {extraActions}
      </PageHeader>

      <MaterialReactTable
        columns={columns}
        data={filtered}
        state={{ isLoading: loading }}
        enableRowActions
        enableRowSelection={can(config.module, 'delete')}
        enableColumnFilters
        enableGlobalFilter
        initialState={{ pagination: { pageSize: 15, pageIndex: 0 } }}
        renderRowActions={({ row }) => (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {can(config.module, 'edit') && (
              <Tooltip title="Edit">
                <IconButton onClick={() => navigate(adminPath(`/${config.module}/${row.original.id}/edit`))}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {can(config.module, 'delete') && (
              <Tooltip title="Delete">
                <IconButton color="error" onClick={() => handleDelete(row.original.id)}>
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
