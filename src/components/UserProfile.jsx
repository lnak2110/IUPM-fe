import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  getUserAPI,
  setFalseUserFulfilledAction,
  updateCurrentUserAPI,
} from '../redux/reducers/userReducer';
import { userSchema } from '../utils/validation';
import { theme } from '../App';
import ControllerPasswordTextField from './ControllerPasswordTextField';
import ControllerTextField from './ControllerTextField';
import Loading from './Loading';
import UserAvatar from './UserAvatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { useMediaQuery } from '@mui/material';

const UserProfile = ({ handleCloseModal }) => {
  const {
    currentUserData: { id },
    userFound,
    isLoading,
    userFulfilled,
  } = useSelector((state) => state.userReducer);

  const dispatch = useDispatch();

  const downSm = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    dispatch(getUserAPI(id));
  }, [dispatch, id]);

  const initialValues = useMemo(
    () => ({
      name: userFound?.name || '',
      email: userFound?.email || '',
      avatar: userFound?.avatar || '',
      password: '',
    }),
    [userFound]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: initialValues,
    shouldFocusError: true,
    mode: 'onTouched',
    resolver: yupResolver(userSchema),
  });

  useEffect(() => {
    if (userFound) {
      reset({ ...initialValues });
    }
  }, [userFound, initialValues, reset]);

  useEffect(() => {
    if (userFulfilled) {
      reset({ ...initialValues });
      dispatch(setFalseUserFulfilledAction());
    }
  }, [userFulfilled, initialValues, dispatch, reset]);

  const onSubmit = (data) => {
    dispatch(updateCurrentUserAPI({ ...data, id: userFound?.id }));
  };

  return (
    <>
      <DialogContent>
        <Box
          id="update-user-info-form"
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid container spacing={4}>
            <Grid
              item
              xs={12}
              md={2}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <UserAvatar
                name={userFound?.name}
                avatar={userFound?.avatar}
                tooltip=""
                size={64}
              />
            </Grid>
            <Grid item xs={12} md={10}>
              <ControllerTextField
                control={control}
                name="avatar"
                id="update-user-avatar"
                label="Avatar URL"
                isRequired={false}
              />
            </Grid>
            <Grid item xs={12}>
              <ControllerTextField
                control={control}
                name="name"
                id="update-user-name"
                label="Name"
              />
            </Grid>
            <Grid item xs={12}>
              <ControllerTextField
                control={control}
                name="email"
                id="update-user-email"
                label="Email"
                type="email"
              />
            </Grid>
            <Grid item xs={12}>
              <ControllerPasswordTextField
                control={control}
                name="password"
                id="update-user-verify-password"
                label="Verify Password"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions
        disableSpacing
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          px: 3,
        }}
      >
        <Button
          variant="outlined"
          fullWidth={downSm}
          onClick={handleCloseModal}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="update-user-info-form"
          variant="contained"
          fullWidth={downSm}
          sx={{
            mb: { xs: 1, sm: 0 },
            ml: { sm: 2 },
            mr: { md: 2 },
          }}
          disabled={isSubmitting}
        >
          Update Information
        </Button>
      </DialogActions>
      {isLoading && <Loading />}
    </>
  );
};

export default UserProfile;
