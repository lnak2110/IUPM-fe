import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  getProjectDetailFullAPI,
  getProjectListsAPI,
} from '../redux/reducers/projectReducer';
import {
  getTaskDetailAPI,
  setNullTaskDetail,
  updateTaskAPI,
} from '../redux/reducers/taskReducer';
import { taskSchema } from '../utils/validation';
import { theme } from '../App';
import ControllerAutocomplete from './ControllerAutocomplete';
import ControllerEditor from './ControllerEditor';
import ControllerDateTimePicker from './ControllerDateTimePicker';
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

const TaskDetailDialogContent = ({ taskId, handleCloseModal, isAllowed }) => {
  const { taskDetail, isLoading: isLoadingTask } = useSelector(
    (state) => state.taskReducer
  );
  const {
    projectLists,
    projectDetailFull,
    isLoading: isLoadingProject,
  } = useSelector((state) => state.projectReducer);

  const dispatch = useDispatch();

  const { projectId } = useParams();

  const downSm = useMediaQuery(theme.breakpoints.down('sm'));
  const up300 = useMediaQuery(theme.breakpoints.up(300));

  useEffect(() => {
    dispatch(getProjectDetailFullAPI(projectId));
    dispatch(getProjectListsAPI(projectId));

    return () => {
      dispatch(setNullTaskDetail());
    };
  }, [dispatch, projectId]);

  // Prevent MUI select warning invalid option
  useEffect(() => {
    if (projectLists?.length) {
      dispatch(getTaskDetailAPI(taskId));
    }
  }, [dispatch, projectLists?.length, taskId]);

  const initialValues = useMemo(
    () => ({
      name: taskDetail?.name || '',
      listId: taskDetail?.listId || '',
      taskMembers: taskDetail?.taskMembers?.map(({ user }) => user) || [],
      deadline: (taskDetail?.deadline && new Date(taskDetail.deadline)) || null,
      description: taskDetail?.description || '',
    }),
    [taskDetail]
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
    resolver: yupResolver(taskSchema(projectDetailFull?.deadline, false)),
  });

  const onSubmit = (data) => {
    dispatch(
      updateTaskAPI({
        ...data,
        id: taskId,
        projectId,
      })
    );
  };

  // Reset defaultvalues after received data from API
  useEffect(() => {
    if (taskDetail) {
      reset({ ...initialValues });
    }
  }, [reset, taskDetail, initialValues]);

  return (
    <>
      <DialogContent>
        <Box
          id="edit-task-form"
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <ControllerTextField
                control={control}
                name="name"
                id="update-task-name"
                label="Task Name"
              />
            </Grid>
            <Grid item xs={12}>
              <ControllerSelect
                control={control}
                name="listId"
                label="Status"
                labelId="update-task-listid-label"
                options={projectLists}
                optionValue={'id'}
                optionLabel={'name'}
              />
            </Grid>
            <Grid item xs={12}>
              <ControllerAutocomplete
                control={control}
                name="taskMembers"
                id="update-task-members"
                label="Members"
                placeholder="Choose task members..."
                options={projectDetailFull?.projectMembers?.map(
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
                id="update-task-deadline"
                label="Deadline (no after project deadline)"
                maxDateTime={
                  projectDetailFull?.deadline &&
                  new Date(projectDetailFull.deadline)
                }
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
                name="description"
                id="update-task-description"
                placeholder="Describe the task..."
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <Divider />
      {isAllowed && (
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
            form="edit-task-form"
            variant="contained"
            fullWidth={downSm}
            sx={{
              mb: { xs: 1, sm: 0 },
              ml: { sm: 2 },
              mr: { md: 2 },
            }}
            disabled={isSubmitting}
          >
            Update Task
          </Button>
        </DialogActions>
      )}
      {(isLoadingTask || isLoadingProject) && <Loading />}
    </>
  );
};

export default TaskDetailDialogContent;
