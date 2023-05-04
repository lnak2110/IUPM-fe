import { Controller } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const ControllerAutocomplete = ({
  control,
  name,
  id,
  label,
  placeholder,
  options,
  optionLabel,
  equalField,
  isDisablePortal = true,
  isRequired,
  isMultiple,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Autocomplete
          disablePortal={isDisablePortal}
          multiple={isMultiple}
          filterSelectedOptions={isMultiple}
          id={id}
          value={value}
          options={options || []}
          getOptionLabel={(option) => option[optionLabel] || ''}
          renderOption={(props, option) => (
            <Box component="li" {...props} key={option[equalField]}>
              {option[optionLabel]}
            </Box>
          )}
          isOptionEqualToValue={(option, value) =>
            option[equalField] === value[equalField]
          }
          onChange={(_event, newValue) => onChange(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              required={isRequired}
              margin="dense"
              label={label}
              placeholder={placeholder}
              error={!!error}
              helperText={error?.message}
              {...(isRequired &&
                isMultiple && {
                  inputProps: {
                    ...params.inputProps,
                    required: value?.length === 0,
                  },
                })}
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
            />
          )}
        />
      )}
    />
  );
};

export default ControllerAutocomplete;
