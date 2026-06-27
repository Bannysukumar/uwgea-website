import { useCallback, useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { toast } from 'react-toastify';
import PageHeader from '@/components/common/PageHeader';
import { createCrudService } from '@/firebase/firestoreService';
import { COLLECTIONS } from '@/firebase/collections';
import { formatDateTime } from '@/utils/formatters';

const service = createCrudService(COLLECTIONS.LOGS);

export default function LogsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const items = await service.getAll();
      setData(items.sort((a, b) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0)));
    } catch (err) {
      toast.error(err.message || 'Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'created_at',
        header: 'Time',
        Cell: ({ cell }) => formatDateTime(cell.getValue()),
      },
      { accessorKey: 'action', header: 'Action' },
      { accessorKey: 'module', header: 'Module' },
      { accessorKey: 'user_id', header: 'User ID' },
      {
        accessorKey: 'details',
        header: 'Details',
        Cell: ({ cell }) => {
          const v = cell.getValue();
          if (!v || typeof v !== 'object') return v ?? '—';
          return JSON.stringify(v);
        },
      },
    ],
    [],
  );

  return (
    <>
      <PageHeader title="Activity Logs" subtitle="Admin actions and audit trail" />
      <MaterialReactTable
        columns={columns}
        data={data}
        state={{ isLoading: loading }}
        enableRowActions={false}
        enableColumnActions={false}
        enableDensityToggle={false}
        initialState={{ pagination: { pageSize: 25, pageIndex: 0 } }}
      />
    </>
  );
}
