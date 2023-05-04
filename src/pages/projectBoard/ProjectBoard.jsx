import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useTitle from '../../hooks/useTitle';
import { getProjectDetailFullAPI } from '../../redux/reducers/projectReducer';
import { updateTaskListAPI } from '../../redux/reducers/taskReducer';
import { theme } from '../../App';
import BoardCardContainer from '../../components/BoardCardContainer';
import CreateTaskDialogContent from '../../components/CreateTaskDialogContent';
import DialogModal from '../../components/DialogModal';
import UserAvatar from '../../components/UserAvatar';
import UsersDialogContent from '../../components/UsersDialogContent';
import AddIcon from '@mui/icons-material/Add';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMediaQuery } from '@mui/material';
import { DragDropContext } from '@hello-pangea/dnd';

const renderButtonAndUsersList = (isSmallScreen, listLength) => {
  if (isSmallScreen && listLength > 0) {
    return { width: '50%' };
  } else if (isSmallScreen) {
    return { width: '100%' };
  } else {
    return;
  }
};

const ProjectBoard = () => {
  const { projectDetailFull } = useSelector((state) => state.projectReducer);

  const [listsTemp, setListsTemp] = useState(null);

  const dispatch = useDispatch();

  const { projectId } = useParams();

  useTitle(projectDetailFull?.name);

  useEffect(() => {
    dispatch(getProjectDetailFullAPI(projectId));
  }, [dispatch, projectId]);

  useEffect(() => {
    if (projectDetailFull?.lists?.length) {
      setListsTemp(projectDetailFull?.lists);
    }
  }, [dispatch, projectDetailFull]);

  const downSm = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDragEnd = (result) => {
    const { draggableId, destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newListsTemp = structuredClone(listsTemp);

    const [taskUpdated] = newListsTemp[+source.droppableId - 1].tasks?.splice(
      source.index,
      1
    );

    newListsTemp[+destination.droppableId - 1].tasks?.splice(
      destination.index,
      0,
      {
        ...taskUpdated,
        listId: +destination.droppableId,
        indexNumber: destination.index,
      }
    );

    setListsTemp(newListsTemp);

    dispatch(
      updateTaskListAPI({
        projectId,
        id: draggableId,
        listId: +destination.droppableId,
        indexNumber: destination.index,
      })
    );
  };

  const usersInProject = projectDetailFull?.projectMembers;

  return (
    <Grid container spacing={4}>
      <Grid container item xs={12} spacing={2} sx={{ pb: 2 }}>
        <Grid item xs={12} md={3}>
          <Typography
            variant="h4"
            component="h1"
            {...(downSm && { sx: { textAlign: 'center' } })}
          >
            Board
          </Typography>
        </Grid>
        <Grid container item xs={12} md={9}>
          <Stack
            {...(downSm && { spacing: 2 })}
            direction={downSm ? 'column' : 'row'}
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Stack
              direction={'row'}
              {...(usersInProject?.length && {
                spacing: {
                  xs: 1,
                  sm: 2,
                },
              })}
            >
              <DialogModal
                buttonOpen={
                  <Button
                    sx={renderButtonAndUsersList(
                      downSm,
                      usersInProject?.length
                    )}
                    startIcon={<AddIcon />}
                    variant="outlined"
                  >
                    Add User
                  </Button>
                }
                children={
                  <UsersDialogContent leaderId={projectDetailFull?.leaderId} />
                }
                popupId="usersDialog"
                title="All users"
                ariaLabel="users-dialog-title"
                preventCloseBackdrop={false}
              />
              <AvatarGroup
                max={downSm ? 3 : 6}
                sx={{ flexGrow: { xs: 0.5, sm: 0 } }}
              >
                {usersInProject?.map(({ user }) => (
                  <UserAvatar
                    key={user.id}
                    name={user.name}
                    avatar={user.avatar}
                  />
                ))}
              </AvatarGroup>
            </Stack>
            <DialogModal
              buttonOpen={
                <Button variant="contained" startIcon={<AddIcon />}>
                  Create Task
                </Button>
              }
              children={
                <CreateTaskDialogContent
                  projectDetailFull={projectDetailFull}
                />
              }
              popupId="createTaskDialog"
              title="Create Task"
              ariaLabel="create-task-dialog-title"
              preventCloseBackdrop
            />
          </Stack>
        </Grid>
      </Grid>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container item xs={12} spacing={2}>
          {listsTemp?.map((list, index) => (
            <Grid
              key={list.id}
              item
              xs={12}
              sm={6}
              md={3}
              sx={{ display: 'flex' }}
            >
              <BoardCardContainer list={list} index={index} />
            </Grid>
          ))}
        </Grid>
      </DragDropContext>
    </Grid>
  );
};

export default ProjectBoard;
