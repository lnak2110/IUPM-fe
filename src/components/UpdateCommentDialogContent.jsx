import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { commentSchemaYup } from './CommentsDialogContent';
import { theme } from '../App';
import Loading from './Loading';
import ControllerEditor from './ControllerEditor';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import { useMediaQuery } from '@mui/material';
import { editCommentAPI } from '../redux/reducers/commentReducer';
import { useDispatch, useSelector } from 'react-redux';

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
      taskId: comment.taskId || 0,
      id: comment.id || 0,
      contentComment: comment.contentComment || '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(commentSchemaYup),
  });

  const onSubmit = (data) => {
    dispatch(editCommentAPI(data));
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
          name="contentComment"
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
