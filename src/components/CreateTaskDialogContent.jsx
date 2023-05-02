import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { theme } from '../App';
import ControllerAutocomplete from './ControllerAutocomplete';
import ControllerEditor from './ControllerEditor';
import ControllerSelect from './ControllerSelect';
import ControllerTextField from './ControllerTextField';
import Loading from './Loading';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useMediaQuery } from '@mui/material';
import {
  createTaskAPI,
  setFalseTaskFulfilledAction,
} from '../redux/reducers/taskReducer';
import { useDispatch, useSelector } from 'react-redux';
import { getProjectListsAPI } from '../redux/reducers/projectReducer';
import ControllerDateTimePicker from './ControllerDateTimePicker';
import { taskSchema } from '../utils/validation';

const CreateTaskDialogContent = ({ projectDetailFull, handleCloseModal }) => {
  const { taskFulfilled, isLoading: isLoadingTask } = useSelector(
    (state) => state.taskReducer
  );
  const { projectLists, isLoading: isLoadingProject } = useSelector(
    (state) => state.projectReducer
  );

  const dispatch = useDispatch();

  const downSm = useMediaQuery(theme.breakpoints.down('sm'));
  const up300 = useMediaQuery(theme.breakpoints.up(300));

  useEffect(() => {
    dispatch(getProjectListsAPI(projectDetailFull.id));
  }, [dispatch, projectDetailFull.id]);

  const initialValues = useMemo(
    () => ({
      name: '',
      listId: projectLists[0]?.id || '',
      taskMembers: [],
      deadline: null,
      description: '',
      listProjectId: projectDetailFull.id,
    }),
    [projectDetailFull, projectLists]
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
    resolver: yupResolver(taskSchema(projectDetailFull.deadline)),
  });

  const onSubmit = (data) => {
    dispatch(createTaskAPI(data));
  };

  // Reset defaultvalues after received data from API
  useEffect(() => {
    if (projectDetailFull && projectLists?.length) {
      reset({ ...initialValues });
    }
  }, [reset, projectDetailFull, projectLists, initialValues]);

  useEffect(() => {
    if (taskFulfilled) {
      dispatch(setFalseTaskFulfilledAction());
    }
  }, [taskFulfilled, dispatch]);

  return (
    <>
      <DialogContent>
        <Box
          id="create-task-form"
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <ControllerTextField
                control={control}
                id="create-task-name"
                name="name"
                label="Task Name"
              />
            </Grid>
            <Grid item xs={12}>
              <ControllerSelect
                control={control}
                name="listId"
                label="Status"
                labelId="create-task-listid-label"
                options={projectLists}
                optionValue={'id'}
                optionLabel={'name'}
              />
            </Grid>
            <Grid item xs={12}>
              <ControllerAutocomplete
                control={control}
                id="create-task-members"
                name="taskMembers"
                label="Members"
                placeholder="Choose task members..."
                options={projectDetailFull.projectMembers?.map(
                  ({ user }) => user
                )}
                optionLabel="name"
                equalField="id"
                isMultiple
              />
            </Grid>
            <Grid item xs={12}>
              <ControllerDateTimePicker
                control={control}
                name="deadline"
                id="create-task-deadline"
                label="Deadline (no after project deadline)"
                maxDateTime={new Date(projectDetailFull.deadline)}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                '.ql-editor': {
                  fontSize: up300 ? theme.typography.body1 : undefined,
                },
              }}
            >
              <Typography
                component="label"
                htmlFor="description"
                sx={{ display: 'block', mb: 1 }}
              >
                Task Description
              </Typography>
              <ControllerEditor
                control={control}
                id="create-task-description"
                name="description"
                placeholder="Describe the task..."
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
          form="create-task-form"
          variant="contained"
          fullWidth={downSm}
          sx={{
            mb: { xs: 1, sm: 0 },
            ml: { sm: 2 },
            mr: { md: 2 },
          }}
          disabled={isSubmitting}
        >
          Create Task
        </Button>
      </DialogActions>
      {(isLoadingTask || isLoadingProject) && <Loading />}
    </>
  );
};

export default CreateTaskDialogContent;
