import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { theme } from '../App';
import {
  addCommentToTaskAPI,
  getAllCommentsAPI,
  setFalseCommentFulfilledAction,
} from '../redux/reducers/commentReducer';
import CommentCard from './CommentCard';
import ControllerEditor from './ControllerEditor';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import Avatar from '@mui/material/Avatar';
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
import { useDispatch, useSelector } from 'react-redux';

export const commentSchemaYup = yup
  .object()
  .shape({
    contentComment: yup
      .string()
      .test('isCommentEmpty', 'Comment cannot be blank!', (comment) => {
        if (comment?.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
          return false;
        }
        return true;
      }),
  })
  .required();

const CommentsDialogContent = ({ taskId }) => {
  const { currentUserData } = useSelector((state) => state.userReducer);
  const { allCommentsInTask, commentFulfilled, isLoading } = useSelector(
    (state) => state.commentReducer
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCommentsAPI(taskId));
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
      contentComment: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(commentSchemaYup),
  });

  useEffect(() => {
    if (commentFulfilled) {
      reset();
      dispatch(setFalseCommentFulfilledAction());
    }
  }, [dispatch, reset, commentFulfilled]);

  const onSubmit = (data) => {
    dispatch(addCommentToTaskAPI(data));
  };

  return (
    <DialogContent>
      <Grid
        container
        spacing={1}
        flexDirection={{ xs: 'column-reverse', md: 'row' }}
      >
        <Grid item xs={12} md={6}>
          {allCommentsInTask.length ? (
            <List>
              {allCommentsInTask
                .slice(0)
                .reverse()
                .map((comment) => (
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
              name="contentComment"
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
                <Avatar
                  alt={currentUserData?.name}
                  src={currentUserData?.avatar}
                />
                <Tooltip title={currentUserData?.name}>
                  <Typography noWrap>{currentUserData?.name}</Typography>
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
