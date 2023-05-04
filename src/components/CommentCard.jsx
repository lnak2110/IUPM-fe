import { useDispatch, useSelector } from 'react-redux';
import parse from 'html-react-parser';
import { deleteCommentAPI } from '../redux/reducers/commentReducer';
import DialogModal from './DialogModal';
import UpdateCommentDialogContent from './UpdateCommentDialogContent';
import UserAvatar from './UserAvatar';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from 'material-ui-popup-state/hooks';
import { useConfirm } from 'material-ui-confirm';
import { format } from 'date-fns';

const CommentCard = ({ comment }) => {
  const { currentUserData } = useSelector((state) => state.userReducer);

  const dispatch = useDispatch();

  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'commentMenu',
  });

  const confirm = useConfirm();

  const handleDeleteComment = () => {
    confirm({
      title: 'Delete this comment?',
    })
      .then(() => {
        dispatch(
          deleteCommentAPI({
            id: comment.id,
            taskId: comment.taskId,
          })
        );
      })
      .catch(() => ({}));
  };

  return (
    <Card>
      <CardHeader
        disableTypography
        sx={{
          '& .MuiCardHeader-content': {
            // display: 'flex',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        }}
        avatar={
          <UserAvatar
            name={comment.author.name}
            avatar={comment.author.avatar}
          />
        }
        title={
          <Tooltip title={comment.author.email}>
            <Typography noWrap>{comment.author.email}</Typography>
          </Tooltip>
        }
        subheader={
          <Typography variant="caption">
            {format(new Date(comment.createdAt), 'MM-dd-yyyy HH:mm')}
          </Typography>
        }
        {...(comment.authorId === currentUserData?.id && {
          action: (
            <IconButton aria-label="more actions" {...bindTrigger(popupState)}>
              <MoreVertIcon />
            </IconButton>
          ),
        })}
      />
      <CardContent sx={{ '&.MuiCardContent-root': { py: 0 } }}>
        <Typography component={'div'} variant="body2" color="text.secondary">
          {parse(comment.content)}
        </Typography>
      </CardContent>
      <Menu
        disablePortal
        keepMounted
        {...bindMenu(popupState)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <DialogModal
          buttonOpen={
            <MenuItem>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText>Update</ListItemText>
            </MenuItem>
          }
          title="Update your comment"
          popupId="updateCommentDialog"
          ariaLabel="update-comment-dialog"
          maxWidthValue="sm"
          heightValue="270px"
        >
          <UpdateCommentDialogContent comment={comment} />
        </DialogModal>
        <MenuItem onClick={() => handleDeleteComment(comment.id)}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default CommentCard;
