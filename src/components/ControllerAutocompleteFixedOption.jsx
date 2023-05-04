import { Controller } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';

const ControllerAutocompleteFixedOption = ({
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
  disabledChipId,
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
          onChange={(_event, newValue) => {
            // Prevent clear all button clears the fixed option
            onChange([
              options.find((o) => o[equalField] === disabledChipId),
              ...newValue.filter((v) => v[equalField] !== disabledChipId),
            ]);
          }}
          // Fixed option
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => {
              return (
                <Chip
                  key={`Chip-${option.id}`}
                  label={option[optionLabel]}
                  {...getTagProps({ index })}
                  color={
                    option[equalField] === disabledChipId
                      ? 'primary'
                      : undefined
                  }
                  disabled={option[equalField] === disabledChipId}
                />
              );
            })
          }
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

export default ControllerAutocompleteFixedOption;
