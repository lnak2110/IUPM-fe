import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { useParams } from 'react-router-dom';
import {
  getAllUsersInProjectAPI,
  getUsersOutsideProjectByKeywordAPI,
  setEmptyUsersOutsideProject,
} from '../redux/reducers/userReducer';
import {
  updateProjectAddMemberAPI,
  updateProjectDeleteMemberAPI,
} from '../redux/reducers/projectReducer';
import { removeAccents } from '../utils/config';
import { theme } from '../App';
import Loading from './Loading';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useMediaQuery } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import { useDispatch, useSelector } from 'react-redux';
import UserAvatar from './UserAvatar';

const UsersDialogContent = ({ leaderId }) => {
  const { usersOutsideProject, usersInProject, isLoading } = useSelector(
    (state) => state.userReducer
  );

  const [keyword, setKeyword] = useState('');

  const [keywordDebounced] = useDebounce(
    removeAccents(keyword).toLowerCase(),
    500
  );

  const dispatch = useDispatch();

  const { projectId } = useParams();

  useEffect(() => {
    dispatch(getAllUsersInProjectAPI(projectId));
  }, [dispatch, projectId]);

  useEffect(() => {
    if (keywordDebounced) {
      dispatch(
        getUsersOutsideProjectByKeywordAPI({
          projectId,
          keyword: keywordDebounced,
        })
      );
    } else {
      dispatch(setEmptyUsersOutsideProject());
    }
  }, [dispatch, projectId, keywordDebounced]);

  const confirm = useConfirm();

  const downSm = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChangeKeyword = (e) => {
    setKeyword(e.target.value);
  };

  const handleAddUserToProject = (userId) => {
    dispatch(
      updateProjectAddMemberAPI({
        id: projectId,
        userId,
        keyword: keywordDebounced,
      })
    );
  };

  const handleDeleteUserFromProject = (user) => {
    confirm({
      title: `Delete user "${user.name}" from this project?`,
      titleProps: { sx: { wordWrap: 'break-word' } },
    })
      .then(() => {
        dispatch(
          updateProjectDeleteMemberAPI({
            id: projectId,
            userId: user.id,
            keyword: keywordDebounced,
          })
        );
      })
      .catch(() => ({}));
  };

  const renderActionUsersInProject = (user) => {
    if (user.id === leaderId) {
      return (
        <Chip
          color="success"
          label={downSm ? 'Lead' : 'Leader'}
          size={downSm ? 'small' : 'medium'}
        />
      );
    } else {
      if (downSm) {
        return (
          <IconButton
            color="error"
            aria-label="delete user from project"
            onClick={() => handleDeleteUserFromProject(user)}
          >
            <PersonRemoveIcon />
          </IconButton>
        );
      } else {
        return (
          <Button
            color="error"
            variant="outlined"
            startIcon={<PersonRemoveIcon />}
            aria-label="delete user from project"
            onClick={() => handleDeleteUserFromProject(user)}
          >
            Delete
          </Button>
        );
      }
    }
  };

  return (
    <DialogContent>
      <Grid container spacing={1}>
        <Grid item md={6} sx={{ width: '100%' }}>
          <TextField
            type="search"
            size="small"
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonSearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={handleChangeKeyword}
          />
          <List>
            {usersOutsideProject?.map((user, index) => (
              <ListItem
                key={user.id}
                alignItems="flex-start"
                divider={index < usersOutsideProject?.length - 1}
                secondaryAction={
                  downSm ? (
                    <IconButton
                      color="primary"
                      aria-label="add memeber to project"
                      onClick={() => handleAddUserToProject(user.id)}
                    >
                      <PersonAddIcon />
                    </IconButton>
                  ) : (
                    <Button
                      variant="outlined"
                      startIcon={<PersonAddIcon />}
                      aria-label="add memeber to project"
                      onClick={() => handleAddUserToProject(user.id)}
                    >
                      Add
                    </Button>
                  )
                }
              >
                <ListItemAvatar>
                  <UserAvatar
                    name={user.name}
                    avatar={user.avatar}
                    tooltip=""
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      sx={{ maxWidth: '70%', wordBreak: 'break-word' }}
                    >
                      {user.name}
                    </Typography>
                  }
                  secondary={`${user.email}`}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item md={6} sx={{ width: '100%' }}>
          <Typography variant="h6" component="h3" gutterBottom>
            Already in the project
          </Typography>
          <List>
            {usersInProject?.map((user, index) => (
              <ListItem
                key={user.id}
                divider={index < usersInProject?.length - 1}
                secondaryAction={renderActionUsersInProject(user)}
              >
                <ListItemAvatar>
                  <UserAvatar
                    name={user.name}
                    avatar={user.avatar}
                    tooltip=""
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      sx={{ maxWidth: '60%', wordBreak: 'break-word' }}
                    >
                      {user.name}
                    </Typography>
                  }
                  secondary={`${user.email}`}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
      {isLoading && <Loading />}
    </DialogContent>
  );
};

export default UsersDialogContent;
