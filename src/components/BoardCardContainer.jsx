import { useSelector } from 'react-redux';
import { theme } from '../App';
import TaskCard from './TaskCard';
import EngineeringIcon from '@mui/icons-material/Engineering';
import NextPlanIcon from '@mui/icons-material/NextPlan';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TaskIcon from '@mui/icons-material/Task';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { Droppable } from '@hello-pangea/dnd';

const statusChips = [
  {
    color: 'deepPurple',
    icon: <ReceiptLongIcon />,
  },
  {
    color: 'cyan',
    icon: <NextPlanIcon />,
  },
  {
    color: 'warning',
    icon: <EngineeringIcon />,
  },
  {
    color: 'green',
    icon: <TaskIcon />,
  },
];

const BoardCardContainer = ({ list, index, showMyTasks }) => {
  const { currentUserData } = useSelector((state) => state.userReducer);

  const renderTask = (task, index) => {
    const isCurrentUserInTask = task.taskMembers?.find(
      ({ user }) => user.id === currentUserData?.id
    );

    if (!isCurrentUserInTask && showMyTasks) {
      return;
    }

    return (
      <TaskCard key={task.id} task={task} index={index} listId={list.id} />
    );
  };

  return (
    <Paper
      sx={{ bgcolor: theme.palette.grey[100], width: '100%', display: 'block' }}
    >
      <Stack
        spacing={1}
        sx={{ p: 1, alignItems: 'flex-start', height: '100%' }}
      >
        <Chip
          variant="filled"
          label={list.name}
          color={statusChips[index].color}
          icon={statusChips[index].icon}
          sx={{ fontWeight: 500 }}
        />
        <Droppable droppableId={list.id.toString()}>
          {(provided) => (
            <Stack
              sx={{ width: '100%', height: '100%' }}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {list?.tasks?.map((task, index) => renderTask(task, index))}
              {provided.placeholder}
            </Stack>
          )}
        </Droppable>
      </Stack>
    </Paper>
  );
};

export default BoardCardContainer;
