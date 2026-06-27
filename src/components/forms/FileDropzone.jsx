import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Button, LinearProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState } from 'react';
import { uploadFile } from '@/firebase/storageService';
import { toast } from 'react-toastify';

export default function FileDropzone({ label, onUploaded, currentUrl, storagePath, accept }) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (files) => {
      const file = files[0];
      if (!file || !storagePath) return;
      setUploading(true);
      try {
        const { url } = await uploadFile(storagePath, file);
        onUploaded(url);
        toast.success('File uploaded');
      } catch (err) {
        toast.error(err.message || 'Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [onUploaded, storagePath],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept, multiple: false });

  return (
    <Box>
      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
        {label}
      </Typography>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon color="action" sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="body2">Drag & drop or click to upload</Typography>
      </Box>
      {uploading && <LinearProgress sx={{ mt: 1 }} />}
      {currentUrl && (
        <Box sx={{ mt: 1 }}>
          <Button size="small" href={currentUrl} target="_blank" rel="noreferrer">
            View current file
          </Button>
        </Box>
      )}
    </Box>
  );
}
