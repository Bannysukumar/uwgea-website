import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { toast } from 'react-toastify';
import { createCrudService, logActivity } from '@/firebase/firestoreService';
import { uploadFile } from '@/firebase/storageService';
import { getModuleConfig, getFieldDef } from '@/config/modules';
import PageHeader from '@/components/common/PageHeader';
import RichTextEditor from '@/components/editor/RichTextEditor';
import FileDropzone from '@/components/forms/FileDropzone';
import { useAppSelector } from '@/redux/hooks';

const buildSchema = (fields) => {
  const shape = {};
  fields.forEach((key) => {
    const def = getFieldDef(key);
    if (!def || def.readOnly) return;
    if (def.required) {
      shape[def.name] = yup.string().required(`${def.label} is required`);
    } else {
      shape[def.name] = yup.mixed().nullable();
    }
  });
  return yup.object(shape);
};

/** Align admin writes with Android app field expectations. */
const normalizePayload = (module, payload, isEdit) => {
  const next = { ...payload };
  if (module === 'notifications') {
    next.user_id = next.user_id || 'all';
    next.description = next.description || next.message || '';
    next.message = next.description;
    next.is_read = false;
    next.status = next.status || 'published';
  }
  if (module === 'events' && !isEdit && next.is_past === undefined) {
    next.is_past = false;
  }
  if ((module === 'news' || module === 'posts') && !next.status) {
    next.status = 'published';
  }
  if (module === 'users' && next.image_url && !next.photo) {
    next.photo = next.image_url;
  }
  return next;
};

export default function ResourceFormPage({ moduleKey }) {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const config = getModuleConfig(moduleKey);
  const service = useMemo(() => createCrudService(config.collection), [config.collection]);
  const profile = useAppSelector((s) => s.auth.profile);
  const [loading, setLoading] = useState(isEdit);

  const schema = useMemo(() => buildSchema(config.formFields), [config.formFields]);

  const { control, handleSubmit, reset, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const item = await service.getById(id);
        if (item) reset(item);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit, reset, service]);

  const onSubmit = async (values) => {
    try {
      let payload = { ...values };
      if (config.formFields.includes('options') && typeof payload.options === 'string') {
        payload.options = payload.options.split(',').map((o) => o.trim()).filter(Boolean);
      }
      payload = normalizePayload(config.module, payload, isEdit);
      if (isEdit) {
        await service.update(id, payload);
        await logActivity('update', config.module, { id }, profile?.uid);
        toast.success('Updated successfully');
      } else {
        const newId = await service.create(payload);
        await logActivity('create', config.module, { id: newId }, profile?.uid);
        toast.success('Created successfully');
      }
      navigate(`/${config.module}`);
    } catch (err) {
      toast.error(err.message || 'Save failed');
    }
  };

  const renderField = (key) => {
    const def = getFieldDef(key);
    if (!def) return null;

    if (def.type === 'richtext') {
      return (
        <Controller
          key={def.name}
          name={def.name}
          control={control}
          render={({ field }) => (
            <RichTextEditor value={field.value || ''} onChange={field.onChange} label={def.label} />
          )}
        />
      );
    }

    if (def.type === 'switch') {
      return (
        <Controller
          key={def.name}
          name={def.name}
          control={control}
          render={({ field }) => (
            <FormControlLabel control={<Switch checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />} label={def.label} />
          )}
        />
      );
    }

    if (def.type === 'select') {
      return (
        <Controller
          key={def.name}
          name={def.name}
          control={control}
          render={({ field, fieldState }) => (
            <TextField {...field} select fullWidth label={def.label} error={!!fieldState.error} helperText={fieldState.error?.message}>
              {(def.options || []).map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      );
    }

    if (def.type === 'image' || def.type === 'file') {
      return (
        <FileDropzone
          key={def.name}
          label={def.label}
          accept={def.type === 'image' ? { 'image/*': [] } : undefined}
          onUploaded={(url) => setValue(def.name, url)}
          currentUrl={watch(def.name)}
          storagePath={def.storage || config.storagePath}
        />
      );
    }

    return (
      <Controller
        key={def.name}
        name={def.name}
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            value={field.value ?? ''}
            fullWidth
            multiline={def.type === 'textarea'}
            rows={def.type === 'textarea' ? 4 : 1}
            type={def.type === 'number' ? 'number' : def.type === 'email' ? 'email' : def.type === 'datetime' ? 'datetime-local' : 'text'}
            label={def.label}
            disabled={def.readOnly}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
    );
  };

  return (
    <Box>
      <PageHeader title={isEdit ? `Edit ${config.singular}` : `New ${config.singular}`} />
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} sx={{ maxWidth: 900 }}>
              {config.formFields.map((key) => (
                <Box key={key}>{renderField(key)}</Box>
              ))}
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button type="submit" variant="contained" disabled={loading}>
                {isEdit ? 'Update' : 'Create'}
              </Button>
              <Button variant="outlined" onClick={() => navigate(`/${config.module}`)}>
                Cancel
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
