import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  createCommentAPI,
  getCommentsByTaskAPI,
  setFalseCommentFulfilledAction,
} from '../redux/reducers/commentReducer';
import { commentSchema } from '../utils/validation';
import { theme } from '../App';
import CommentCard from './CommentCard';
import ControllerEditor from './ControllerEditor';
import UserAvatar from './UserAvatar';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Loading from './Loading';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useMediaQuery } from '@mui/material';

const CommentsDialogContent = ({ taskId }) => {
  const { currentUserData } = useSelector((state) => state.userReducer);
  const { commentsInTask, commentFulfilled, isLoading } = useSelector(
    (state) => state.commentReducer
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCommentsByTaskAPI(taskId));
  }, [dispatch, taskId]);

  const up300 = useMediaQuery(theme.breakpoints.up(300));

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      taskId: taskId || '',
      content: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(commentSchema()),
  });

  useEffect(() => {
    if (commentFulfilled) {
      reset();
      dispatch(setFalseCommentFulfilledAction());
    }
  }, [dispatch, reset, commentFulfilled]);

  const onSubmit = (data) => {
    dispatch(createCommentAPI(data));
  };

  return (
    <DialogContent>
      <Grid
        container
        spacing={1}
        flexDirection={{ xs: 'column-reverse', md: 'row' }}
      >
        <Grid item xs={12} md={6}>
          {commentsInTask?.length ? (
            <List>
              {commentsInTask.map((comment) => (
                <ListItem key={comment.id} sx={{ display: 'block' }}>
                  <CommentCard comment={comment} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1,
                mt: 2,
              }}
            >
              <ModeCommentOutlinedIcon fontSize="inherit" />
              No comment yet...
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack
            component={'form'}
            onSubmit={handleSubmit(onSubmit)}
            spacing={2}
            sx={{
              p: 2,
              '.ql-editor': {
                fontSize: up300 ? theme.typography.body2 : undefined,
              },
            }}
          >
            <ControllerEditor
              control={control}
              id="create-comment-content"
              name="content"
              placeholder="Leave a comment..."
            />
            <Stack
              spacing={1}
              direction={{ xs: 'column', sm: 'row' }}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Stack
                direction="row"
                spacing={2}
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                <UserAvatar
                  name={currentUserData?.name}
                  avatar={currentUserData?.avatar}
                />
                <Tooltip title={currentUserData?.email}>
                  <Typography noWrap>{currentUserData?.email}</Typography>
                </Tooltip>
              </Stack>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                Send
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
      {isLoading && <Loading />}
    </DialogContent>
  );
};

export default CommentsDialogContent;
