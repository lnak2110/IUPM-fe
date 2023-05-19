import { useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useTitle from '../../hooks/useTitle';
import {
  deleteProjectAPI,
  getProjectsByUserAPI,
  updateProjectToggleDone,
} from '../../redux/reducers/projectReducer';
import { theme } from '../../App';
import DialogModal from '../../components/DialogModal';
import Loading from '../../components/Loading';
import MUIDataGrid from '../../components/MUIDataGrid';
import ProjectUsersDialogContent from '../../components/ProjectUsersDialogContent';
import UserAvatar from '../../components/UserAvatar';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import EditIcon from '@mui/icons-material/Edit';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PendingIcon from '@mui/icons-material/Pending';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from 'material-ui-popup-state/hooks';
import { useConfirm } from 'material-ui-confirm';
import { compareAsc } from 'date-fns';

const projectStatus = ['Done', 'Doing', 'Late'];

const RowActionsMenu = ({ project, currentUserId, isDone }) => {
  const dispatch = useDispatch();

  const popupState = usePopupState({
    variant: 'popover',
    popupId: `projectActionsMenu-${project.id}`,
  });

  const confirm = useConfirm();

  const handleUpdateProjectToggleDone = () => {
    dispatch(
      updateProjectToggleDone({ id: project.id, userId: currentUserId, isDone })
    );
  };

  const handleDeleteProject = () => {
    confirm({
      title: `Delete project "${project.name}"?`,
      titleProps: { sx: { wordWrap: 'break-word' } },
    })
      .then(() => {
        dispatch(deleteProjectAPI({ id: project.id, userId: currentUserId }));
      })
      .catch(() => ({}));
  };

  return (
    <>
      <Tooltip title="More actions">
        <IconButton aria-label="more actions" {...bindTrigger(popupState)}>
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <Menu
        elevation={2}
        {...bindMenu(popupState)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => handleUpdateProjectToggleDone()}>
          <ListItemIcon>
            {isDone ? <RemoveDoneIcon /> : <DoneAllIcon />}
          </ListItemIcon>
          <ListItemText>{`Set ${isDone ? 'Not Done' : 'Done'}`}</ListItemText>
        </MenuItem>
        <MenuItem component={NavLink} to={`/projects/${project.id}/update`}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText>Update</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDeleteProject()}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

const formatStatus = (isDone, deadline) => {
  if (isDone) {
    return projectStatus[0];
  } else {
    if (compareAsc(new Date(deadline), new Date()) === 1 || !deadline) {
      return projectStatus[1];
    } else {
      return projectStatus[2];
    }
  }
};

const renderStatus = (status) => {
  if (status === projectStatus[0]) {
    return (
      <Chip
        label={projectStatus[0]}
        size="small"
        variant="outlined"
        color="success"
        icon={<DoneIcon />}
      />
    );
  } else {
    if (status === projectStatus[1]) {
      return (
        <Chip
          label={projectStatus[1]}
          size="small"
          variant="outlined"
          color="blueGrey"
          icon={<PendingIcon />}
        />
      );
    } else {
      return (
        <Chip
          label={projectStatus[2]}
          size="small"
          variant="outlined"
          color="error"
          icon={<HourglassFullIcon />}
        />
      );
    }
  }
};

const Projects = () => {
  const { projects, isLoading } = useSelector((state) => state.projectReducer);
  const { currentUserData } = useSelector((state) => state.userReducer);

  const dispatch = useDispatch();

  useTitle('Projects');

  useEffect(() => {
    dispatch(getProjectsByUserAPI(currentUserData?.id));
  }, [dispatch, currentUserData?.id]);

  const columns = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Name',
        minWidth: 100,
        flex: 1,
        renderCell: (params) => (
          <Link
            component={NavLink}
            to={`/projects/${params.row.id}/board`}
            underline="hover"
            noWrap
          >
            {params.value}
          </Link>
        ),
      },
      {
        field: 'description',
        headerName: 'Description',
        minWidth: 100,
        flex: 1,
        renderCell: ({ value }) => (
          <Tooltip title={value}>
            <Typography fontSize={theme.typography.fontSize} noWrap>
              {value}
            </Typography>
          </Tooltip>
        ),
      },
      {
        field: 'deadline',
        type: 'dateTime',
        headerName: 'Deadline',
        minWidth: 200,
        flex: 1.2,
        valueGetter: ({ value }) => value && new Date(value),
      },
      {
        field: 'isDone',
        headerName: 'Status',
        type: 'singleSelect',
        minWidth: 100,
        flex: 0.6,
        valueOptions: projectStatus,
        valueGetter: (params) =>
          formatStatus(params.value, params.row.deadline),
        renderCell: (params) => renderStatus(params.value),
      },
      {
        field: 'leader',
        headerName: 'Leader',
        minWidth: 80,
        flex: 0.8,
        valueGetter: (params) => params.row.leader?.email,
      },
      {
        field: 'projectMembers',
        headerName: 'Members',
        type: 'singleSelect',
        minWidth: 140,
        flex: 0.8,
        valueOptions: ['Leader', 'Ordinary member'],
        valueGetter: (params) =>
          currentUserData?.id === params.row.leader?.id
            ? 'Leader'
            : 'Ordinary member',
        renderCell: (params) => {
          if (currentUserData?.id === params.row.leader?.id) {
            return (
              <Stack direction="row" alignItems="center">
                <AvatarGroup total={params.row.projectMembers}>
                  <UserAvatar
                    name={params.row.leader?.name}
                    avatar={params.row.leader?.avatar}
                    tooltipPlacement="left"
                  />
                </AvatarGroup>
                <DialogModal
                  maxWidthValue="sm"
                  heightValue="300px"
                  preventCloseBackdrop
                  buttonOpen={
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.light,
                        cursor: 'pointer',
                      }}
                    >
                      <PersonAddIcon />
                    </Avatar>
                  }
                  title={params.row.name}
                  popupId={`project-${params.row.id}-users`}
                  ariaLabel="project-users-dialog"
                >
                  <ProjectUsersDialogContent
                    projectId={params.row.id}
                    leaderId={params.row.leader?.id}
                  />
                </DialogModal>
              </Stack>
            );
          }

          return (
            <AvatarGroup total={params.row.projectMembers}>
              <UserAvatar
                name={params.row.leader?.name}
                avatar={params.row.leader?.avatar}
                tooltipPlacement="left"
              />
            </AvatarGroup>
          );
        },
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        description: 'Update / Delete Project',
        minWidth: 70,
        flex: 0.5,
        renderCell: (params) =>
          currentUserData?.id === params.row.leader?.id && (
            <RowActionsMenu
              project={params.row}
              currentUserId={currentUserData?.id}
              isDone={params.row.isDone}
            />
          ),
      },
    ],
    [currentUserData]
  );

  const rows = useMemo(
    () =>
      projects?.map((p) => {
        const {
          id,
          name,
          description,
          deadline,
          isDone,
          leader,
          _count: { projectMembers },
        } = p.project;

        return {
          id,
          name,
          description,
          deadline,
          isDone,
          leader,
          projectMembers,
        };
      }),
    [projects]
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <MUIDataGrid
      columns={columns}
      rows={rows}
      initialPageSizeNumber={10}
      rowId="id"
      filterValues={projectStatus}
    />
  );
};

export default Projects;
