import ResourceListPage from '@/features/shared/ResourceListPage';
import { Button } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import { createCrudService, logActivity } from '@/firebase/firestoreService';
import { COLLECTIONS } from '@/firebase/collections';
import { parseCsvFile, exportToExcel } from '@/utils/export';
import { useAppSelector } from '@/redux/hooks';

const service = createCrudService(COLLECTIONS.USERS);

export default function UsersPage() {
  const fileRef = useRef(null);
  const profile = useAppSelector((s) => s.auth.profile);

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseCsvFile(file);
      for (const row of rows) {
        await service.create(row);
      }
      await logActivity('import', 'users', { count: rows.length }, profile?.uid);
      toast.success(`Imported ${rows.length} users`);
      window.location.reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <input ref={fileRef} type="file" accept=".csv,.xlsx" hidden onChange={handleImport} />
      <ResourceListPage
        moduleKey="users"
        extraActions={
          <>
            <Button startIcon={<UploadFileIcon />} onClick={() => fileRef.current?.click()}>
              Import CSV
            </Button>
            <Button
              onClick={async () => {
                const data = await service.getAll();
                exportToExcel(data, 'users.xlsx');
              }}
            >
              Export Excel
            </Button>
          </>
        }
      />
    </>
  );
}
