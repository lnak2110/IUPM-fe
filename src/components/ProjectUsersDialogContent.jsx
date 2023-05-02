import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  getAllUsersAPI,
  getAllUsersInProjectAPI,
} from '../redux/reducers/userReducer';
import { theme } from '../App';
import Loading from './Loading';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateProjectManyMembersAPI } from '../redux/reducers/projectReducer';
import ControllerAutocompleteFixedOption from './ControllerAutocompleteFixedOption';

const ProjectUsersDialogContent = ({
  projectId,
  leaderId,
  handleCloseModal,
}) => {
  const { users, usersInProject, isLoading } = useSelector(
    (state) => state.userReducer
  );

  const dispatch = useDispatch();

  const downSm = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    dispatch(getAllUsersAPI());
    dispatch(getAllUsersInProjectAPI(projectId));
  }, [dispatch, projectId]);

  const initialValues = useMemo(
    () => ({
      members: usersInProject || [],
    }),
    [usersInProject]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: initialValues,
  });

  const onSubmit = (data) => {
    dispatch(
      updateProjectManyMembersAPI({
        id: projectId,
        members: data.members,
        userId: leaderId,
      })
    );
  };

  useEffect(() => {
    if (usersInProject) {
      reset({ ...initialValues });
    }
  }, [reset, usersInProject, initialValues]);

  return (
    <>
      <DialogContent>
        <Box
          id="update-project-users-form"
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <ControllerAutocompleteFixedOption
            control={control}
            isMultiple
            isDisablePortal={false}
            id="update-project-users-dialog"
            name="members"
            label="Members In Project"
            placeholder="Update members"
            options={users}
            optionLabel="email"
            equalField="id"
            disabledChipId={leaderId}
          />
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
          form="update-project-users-form"
          variant="contained"
          fullWidth={downSm}
          sx={{
            mb: { xs: 1, sm: 0 },
            ml: { sm: 2 },
          }}
          disabled={isSubmitting}
        >
          Update
        </Button>
      </DialogActions>
      {isLoading && <Loading />}
    </>
  );
};

export default ProjectUsersDialogContent;
