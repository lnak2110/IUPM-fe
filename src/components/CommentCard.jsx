import parse from 'html-react-parser';
import { deleteCommentAPI } from '../redux/reducers/commentReducer';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
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
import DialogModal from './DialogModal';
import UpdateCommentDialogContent from './UpdateCommentDialogContent';
import { useConfirm } from 'material-ui-confirm';
import { useDispatch, useSelector } from 'react-redux';

const CommentCard = ({ comment }) => {
  const { currentUserData } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'commentMenu',
  });

  const confirm = useConfirm();

  const isCommentOfCurrentUser = (userId) => {
    if (userId === currentUserData?.id) {
      return true;
    }
  };

  const handleDeleteComment = (idComment) => {
    confirm({
      title: 'Delete this comment?',
    })
      .then(() => {
        dispatch(
          deleteCommentAPI({
            idComment,
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
            display: 'flex',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        }}
        avatar={<Avatar alt={comment.user.name} src={comment.user.avatar} />}
        title={
          <Tooltip title={comment.user.name}>
            <Typography noWrap>{comment.user.name}</Typography>
          </Tooltip>
        }
        {...(isCommentOfCurrentUser(comment.userId) && {
          action: (
            <IconButton aria-label="more actions" {...bindTrigger(popupState)}>
              <MoreVertIcon />
            </IconButton>
          ),
        })}
      />
      <CardContent sx={{ '&.MuiCardContent-root': { py: 0 } }}>
        <Typography component={'div'} variant="body2" color="text.secondary">
          {parse(comment.contentComment)}
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
              <ListItemText>Edit</ListItemText>
            </MenuItem>
          }
          title="Edit your comment"
          popupId="editCommentDialog"
          ariaLabel="edit-comment-dialog"
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
