import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useTitle from '../../hooks/useTitle';
import { loginAPI } from '../../redux/reducers/userReducer';
import { loginSchema } from '../../utils/validation';
import ControllerPasswordTextField from '../../components/ControllerPasswordTextField';
import ControllerTextField from '../../components/ControllerTextField';
import Loading from '../../components/Loading';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// import image1 from '../../assets/images/login-background-1.jpg';
// import image2 from '../../assets/images/login-background-2.jpg';
// import image3 from '../../assets/images/login-background-3.jpg';
// import image4 from '../../assets/images/login-background-4.jpg';
// import image5 from '../../assets/images/login-background-5.jpg';
// import image6 from '../../assets/images/login-background-6.jpg';
// import image7 from '../../assets/images/login-background-7.jpg';
// import image8 from '../../assets/images/login-background-8.jpg';
// import image9 from '../../assets/images/login-background-9.jpg';
// import image10 from '../../assets/images/login-background-10.jpg';

// const loginBackgroundImages = [
//   image1,
//   image2,
//   image3,
//   image4,
//   image5,
//   image6,
//   image7,
//   image8,
//   image9,
//   image10,
// ];

// const randomImage =
//   loginBackgroundImages[
//     Math.floor(Math.random() * loginBackgroundImages.length)
//   ];

const Login = () => {
  const { isLoading } = useSelector((state) => state.userReducer);

  const dispatch = useDispatch();

  useTitle('Login');

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (data) => {
    dispatch(loginAPI(data));
  };

  return (
    <Grid container component="main" sx={{ minHeight: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          // backgroundImage: `url(${randomImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light'
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        square
      >
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h3" gutterBottom>
            Login
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 1 }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <ControllerTextField
              control={control}
              id="login-email"
              name="email"
              label="Email"
              margin="normal"
            />
            <ControllerPasswordTextField
              control={control}
              id="login-password"
              name="password"
              label="Password"
              margin="normal"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log in
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={NavLink} to="/register" variant="body2">
                  Don't have an account? Register now!
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
      {isLoading && <Loading />}
    </Grid>
  );
};

export default Login;
