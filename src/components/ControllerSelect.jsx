import { Controller } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const ControllerSelect = ({
  control,
  name,
  label,
  labelId,
  options,
  optionValue,
  optionLabel,
}) => {
  return (
    <FormControl fullWidth margin="dense">
      <InputLabel id={labelId}>{label}</InputLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select {...field} labelId={labelId} label={label}>
            {options?.map((option) => (
              <MenuItem
                key={option?.[optionValue]}
                value={option?.[optionValue]}
              >
                {option?.[optionLabel]}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </FormControl>
  );
};

export default ControllerSelect;
