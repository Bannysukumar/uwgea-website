import { Box, Typography } from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  Bold,
  Italic,
  Essentials,
  Paragraph,
  Heading,
  Link,
  List,
  BlockQuote,
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

export default function RichTextEditor({ value, onChange, label }) {
  return (
    <Box>
      {label && (
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
          {label}
        </Typography>
      )}
      <Box sx={{ '& .ck-editor__editable': { minHeight: 200 } }}>
        <CKEditor
          editor={ClassicEditor}
          data={value || ''}
          config={{
            plugins: [Essentials, Bold, Italic, Paragraph, Heading, Link, List, BlockQuote],
            toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
          }}
          onChange={(_, editor) => onChange(editor.getData())}
        />
      </Box>
    </Box>
  );
}
