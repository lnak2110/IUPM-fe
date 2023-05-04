import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateCommentAPI } from '../redux/reducers/commentReducer';
import { commentSchema } from '../utils/validation';
import { theme } from '../App';
import ControllerEditor from './ControllerEditor';
import Loading from './Loading';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import { useMediaQuery } from '@mui/material';

const UpdateCommentDialogContent = ({ comment }) => {
  const { isLoading } = useSelector((state) => state.commentReducer);

  const dispatch = useDispatch();

  const up300 = useMediaQuery(theme.breakpoints.up(300));

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      content: comment.content || '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(commentSchema(false)),
  });

  const onSubmit = (data) => {
    dispatch(
      updateCommentAPI({
        ...data,
        id: comment.id,
        taskId: comment.taskId,
      })
    );
  };

  return (
    <DialogContent>
      <Box
        component={'form'}
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 3,
          '.ql-editor': {
            fontSize: up300 ? theme.typography.body2 : undefined,
          },
        }}
      >
        <ControllerEditor
          control={control}
          name="content"
          id="update-comment-content"
          placeholder="Leave a comment..."
        />
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          Save
        </Button>
      </Box>
      {isLoading && <Loading />}
    </DialogContent>
  );
};

export default UpdateCommentDialogContent;
