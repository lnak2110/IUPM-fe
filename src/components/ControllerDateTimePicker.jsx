import { Controller } from 'react-hook-form';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const ControllerDateTimePicker = ({
  control,
  name,
  id,
  label,
  maxDateTime,
  margin = 'dense',
  readonly = false,
  isRequired = true,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { ref, ...field }, fieldState: { error } }) => (
        <DateTimePicker
          {...field}
          inputRef={ref} // To scroll and focus error (RHF: shouldFocusError)
          label={label}
          disablePast
          maxDateTime={maxDateTime}
          {...(readonly & { readOnly: readonly })}
          slotProps={{
            textField: {
              id: id,
              fullWidth: true,
              margin: margin,
              required: isRequired,
              error: !!error,
              helperText: error?.message,
              onKeyDown: (e) => {
                e.stopPropagation();
              },
            },
          }}
        />
      )}
    />
  );
};

export default ControllerDateTimePicker;
