import { useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useTitle from '../../hooks/useTitle';
import {
  deleteProjectAPI,
  getProjectsByUserAPI,
} from '../../redux/reducers/projectReducer';
import { theme } from '../../App';
import DialogModal from '../../components/DialogModal';
import Loading from '../../components/Loading';
import MUIDataGrid from '../../components/MUIDataGrid';
import ProjectUsersDialogContent from '../../components/ProjectUsersDialogContent';
import UserAvatar from '../../components/UserAvatar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
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

const RowActionsMenu = ({ project }) => {
  const dispatch = useDispatch();

  const popupState = usePopupState({
    variant: 'popover',
    popupId: `projectActionsMenu-${project.id}`,
  });

  const confirm = useConfirm();

  const handleDeleteProject = (project) => {
    confirm({
      title: `Delete project "${project.name}"?`,
      titleProps: { sx: { wordWrap: 'break-word' } },
    })
      .then(() => {
        dispatch(deleteProjectAPI(project.id));
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
        <MenuItem component={NavLink} to={`/projects/${project.id}/update`}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText>Update</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDeleteProject(project)}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

const Projects = () => {
  const { projects, isLoading } = useSelector((state) => state.projectReducer);
  const { currentUserData } = useSelector((state) => state.userReducer);

  const dispatch = useDispatch();

  useTitle('Projects');

  useEffect(() => {
    dispatch(getProjectsByUserAPI(currentUserData.id));
  }, [dispatch, currentUserData.id]);

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
            <Typography noWrap>{value}</Typography>
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
        field: 'leader',
        headerName: 'Leader',
        minWidth: 80,
        flex: 0.8,
        valueGetter: (params) => params.row.leader.email,
      },
      {
        field: 'projectMembers',
        headerName: 'Members',
        minWidth: 140,
        flex: 0.8,
        filterable: false,
        sortable: false,
        renderCell: (params) => {
          if (currentUserData?.id === params.row.leader.id) {
            return (
              <Stack direction="row" alignItems="center">
                <AvatarGroup total={params.value}>
                  <UserAvatar
                    name={params.row.leader.name}
                    avatar={params.row.leader.avatar}
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
                    leaderId={params.row.leader.id}
                  />
                </DialogModal>
              </Stack>
            );
          }

          return (
            <AvatarGroup total={params.value}>
              <UserAvatar
                name={params.row.leader.name}
                avatar={params.row.leader.avatar}
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
          currentUserData?.id === params.row.leader.id && (
            <RowActionsMenu project={params.row} />
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
          leader,
          _count: { projectMembers },
        } = p.project;

        return {
          id,
          name,
          description,
          deadline,
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
    />
  );
};

export default Projects;
