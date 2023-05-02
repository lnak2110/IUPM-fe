import { useState } from 'react';
import { Controller } from 'react-hook-form';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import TextField from '@mui/material/TextField';

const ControllerPasswordTextField = ({
  control,
  id,
  name,
  label,
  margin = 'dense',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { ref, ...field }, fieldState: { error } }) => (
        <TextField
          {...field}
          inputRef={ref} // To scroll and focus error (RHF: shouldFocusError)
          required
          fullWidth
          margin={margin}
          id={id}
          label={label}
          autoComplete={name}
          error={!!error}
          helperText={error?.message}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
          }}
        />
      )}
    />
  );
};

export default ControllerPasswordTextField;
