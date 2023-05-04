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
import { format } from 'date-fns';

const TaskCard = ({ task, index }) => {
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

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <DialogModal
          key={task.id}
          popupId="taskDetailDialog"
          title={task.name}
          ariaLabel="task-detail-dialog-title"
          preventCloseBackdrop
          buttonOpen={
            <Card
              sx={{
                '& .MuiCardContent-root': { p: 2 },
                mt: 1,
                cursor: 'grab',
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
                  <Tooltip title="Delete">
                    <IconButton
                      aria-label="delete"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask();
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                }
              />
              <CardContent
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  '&.MuiCardContent-root': { pb: 2 },
                }}
              >
                <Chip
                  color="indigo"
                  size="small"
                  variant="outlined"
                  label={format(new Date(task.deadline), 'MM-dd-yyyy HH:mm')}
                />
                {task.taskMembers?.length ? (
                  <Tooltip
                    title={`${task.taskMembers?.length} member${
                      task.taskMembers?.length > 1 ? 's' : ''
                    }`}
                  >
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
            taskDetailTabContent={<TaskDetailDialogContent taskId={task.id} />}
            commentsTabContent={<CommentsDialogContent taskId={task.id} />}
          />
        </DialogModal>
      )}
    </Draggable>
  );
};

export default TaskCard;
