import { Controller } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export const module = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ['blockquote', 'code-block'],
    ['bold', 'italic', 'underline', 'strike'],
    ['link'],
    [{ script: 'sub' }, { script: 'super' }],
    [{ color: [] }, { background: [] }],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    [{ align: [] }],
    ['clean'],
  ],
};

const ControllerEditor = ({ control, name, id, placeholder }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...field }, fieldState: { error } }) => (
        <>
          <ReactQuill
            {...field}
            id={id}
            placeholder={placeholder}
            theme="snow"
            modules={module}
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
          />
          {error && (
            <Typography variant="body2" color="error">
              {error.message}
            </Typography>
          )}
        </>
      )}
    />
  );
};

export default ControllerEditor;
