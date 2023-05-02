import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useTitle from '../../hooks/useTitle';
import { registerAPI } from '../../redux/reducers/userReducer';
import { registerSchema } from '../../utils/validation';
import ControllerPasswordTextField from '../../components/ControllerPasswordTextField';
import ControllerTextField from '../../components/ControllerTextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Loading from '../../components/Loading';

const Register = () => {
  const { isLoading } = useSelector((state) => state.userReducer);

  const dispatch = useDispatch();

  useTitle('Register');

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    mode: 'onTouched',
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = (data) => {
    dispatch(registerAPI(data));
  };

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        component={Paper}
        elevation={3}
        sx={{
          p: { xs: 3, sm: 5 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h3" align="center" gutterBottom>
          Welcome to IUPM!
        </Typography>
        <Box component="form" sx={{ mt: 3 }} onSubmit={handleSubmit(onSubmit)}>
          <ControllerTextField
            control={control}
            id="register-name"
            name="name"
            label="Name"
            margin="normal"
          />
          <ControllerTextField
            control={control}
            id="register-email"
            name="email"
            label="Email"
            margin="normal"
          />
          <ControllerPasswordTextField
            control={control}
            id="register-password"
            name="password"
            label="Password"
            margin="normal"
          />
          <Button
            type="submit"
            fullWidth
            disabled={isSubmitting}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={NavLink} to="/login" variant="body2">
                Already have an account? Log in now!
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {isLoading && <Loading />}
    </Container>
  );
};

export default Register;
