import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';

const ControllerTextField = ({
  control,
  id,
  name,
  label,
  placeholder,
  margin = 'dense',
  type = 'text',
  readonly = false,
  isRequired = true,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { ref, ...field }, fieldState: { error } }) => (
        <TextField
          {...field}
          inputRef={ref} // To scroll and focus error (RHF: shouldFocusError)
          required={isRequired}
          fullWidth
          margin={margin}
          id={id}
          label={label}
          autoComplete={name}
          {...(placeholder && { placeholder })}
          error={!!error}
          helperText={error?.message}
          type={type}
          InputProps={{ readOnly: readonly }}
          onKeyDown={(e) => {
            e.stopPropagation();
          }}
        />
      )}
    />
  );
};

export default ControllerTextField;
