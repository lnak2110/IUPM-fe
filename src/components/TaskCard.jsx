import { useDispatch } from 'react-redux';
import CommentsDialogContent from './CommentsDialogContent';
import DialogModal from './DialogModal';
import TaskDetailDialogContent from './TaskDetailDialogContent';
import TaskDetailDialogTabs from './TaskDetailDialogTabs';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Draggable } from '@hello-pangea/dnd';
import { useConfirm } from 'material-ui-confirm';
import { deleteTaskAPI } from '../redux/reducers/taskReducer';
import { compareAsc, format } from 'date-fns';
import { NavLink } from 'react-router-dom';

const TaskCard = ({ task, index, listId, isAllowed }) => {
  const dispatch = useDispatch();

  const confirm = useConfirm();

  const handleDeleteTask = () => {
    confirm({
      title: `Delete task "${task.name}"?`,
      titleProps: { sx: { wordWrap: 'break-word' } },
    })
      .then(() => {
        dispatch(
          deleteTaskAPI({
            id: task.id,
            projectId: task.listProjectId,
          })
        );
      })
      .catch(() => ({}));
  };

  const isTaskLateDeadline = () => {
    const { deadline } = task;

    if (compareAsc(new Date(deadline), new Date()) === 1 || !deadline) {
      return false;
    } else {
      return listId !== 4;
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <DialogModal
          key={task.id}
          taskId={task.id}
          popupId="taskDetailDialog"
          title={task.name}
          ariaLabel="task-detail-dialog-title"
          preventCloseBackdrop
          buttonOpen={
            <Card
              component={NavLink}
              to={`task/${task.id}`}
              sx={{
                '& .MuiCardContent-root': { p: 2 },
                textDecoration: 'none',
                mt: 1,
                cursor: 'grab',
                ...(isTaskLateDeadline() && { border: '1px solid red' }),
              }}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <CardHeader
                disableTypography
                sx={{
                  '& .MuiCardHeader-content': { overflow: 'hidden' },
                  pb: 0,
                }}
                title={
                  <Tooltip title={task.name}>
                    <Typography
                      sx={{
                        display: 'inline-block',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {task.name}
                    </Typography>
                  </Tooltip>
                }
                action={
                  isAllowed && (
                    <Tooltip title="Delete">
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeleteTask();
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )
                }
              />
              <CardContent
                sx={{
                  display: 'flex',
                  justifyContent: task.deadline ? 'space-between' : 'flex-end',
                  alignItems: 'center',
                  '&.MuiCardContent-root': { pb: 2 },
                }}
              >
                {task.deadline && (
                  <Chip
                    color="indigo"
                    size="small"
                    variant="outlined"
                    label={format(new Date(task.deadline), 'MM-dd-yyyy HH:mm')}
                  />
                )}
                {task.taskMembers?.length ? (
                  <Tooltip
                    title={`${task.taskMembers?.length} member${
                      task.taskMembers?.length > 1 ? 's' : ''
                    }`}
                  >
                    <Badge
                      overlap="circular"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      badgeContent={task.taskMembers?.length}
                      color="secondary"
                    >
                      <Avatar>
                        <GroupIcon />
                      </Avatar>
                    </Badge>
                  </Tooltip>
                ) : (
                  <Tooltip title={'No member'}>
                    <Avatar>
                      <PersonOffIcon />
                    </Avatar>
                  </Tooltip>
                )}
              </CardContent>
            </Card>
          }
        >
          <TaskDetailDialogTabs
            taskDetailTabContent={
              <TaskDetailDialogContent taskId={task.id} isAllowed={isAllowed} />
            }
            commentsTabContent={<CommentsDialogContent taskId={task.id} />}
          />
        </DialogModal>
      )}
    </Draggable>
  );
};

export default TaskCard;
