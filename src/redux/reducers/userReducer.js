import axios from 'axios';
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { router } from '../../App';
import {
  axiosAuth,
  eraseStore,
  getStoreJson,
  setStore,
} from '../../utils/config';

const baseURL = process.env.REACT_APP_DOMAIN;

export const registerAPI = createAsyncThunk(
  'userReducer/registerAPI',
  async (registerData, { rejectWithValue }) => {
    try {
      const result = await axios.post(`${baseURL}/auth/register`, registerData);

      if (result?.status === 200) {
        router.navigate('/login');
        toast.success('Register successfully! Please log in to continue.');
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Something wrong happened!';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const loginAPI = createAsyncThunk(
  'userReducer/loginAPI',
  async (loginData, { dispatch, rejectWithValue }) => {
    try {
      const result = await axios.post(`${baseURL}/auth/login`, loginData);

      if (result?.status === 200) {
        const { id, name, email, avatar, accessToken } = result.data.content;

        const currentUserData = {
          id,
          name,
          email,
          avatar,
        };

        setStore(process.env.REACT_APP_CURRENT_USER_DATA, currentUserData);
        setStore(process.env.REACT_APP_USER_LOGIN, { email, accessToken });

        dispatch(saveCurrentUserDataAction(currentUserData));
        toast.success(`Log in successfully! Welcome ${name}!`);
        return { email, accessToken };
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Something wrong happened!';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const getAllUsersAPI = createAsyncThunk(
  'userReducer/getAllUsersAPI',
  async (_, { rejectWithValue }) => {
    try {
      const result = await axiosAuth.get('/users/');

      if (result?.status === 200) {
        return result?.data?.content;
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || 'Something wrong happened!'
      );
    }
  }
);

export const getAllUsersInProjectAPI = createAsyncThunk(
  'userReducer/getAllUsersInProjectAPI',
  async (projectId, { rejectWithValue }) => {
    try {
      const result = await axiosAuth.get(`/users/project/${projectId}`);

      if (result?.status === 200) {
        return result?.data?.content?.map((item) => item.user);
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || 'Something wrong happened!'
      );
    }
  }
);

export const getUsersOutsideProjectByKeywordAPI = createAsyncThunk(
  'userReducer/getUsersOutsideProjectByKeywordAPI',
  async (
    { projectId: { projectId }, keyword: { keyword } },
    { rejectWithValue }
  ) => {
    try {
      const result = await axiosAuth.get(
        `/users/outside/project/${projectId}?keyword=${keyword}`
      );

      if (result?.status === 200) {
        return result?.data?.content;
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || 'Something wrong happened!'
      );
    }
  }
);

export const addUserToProjectAPI = createAsyncThunk(
  'userReducer/addUserToProjectAPI',
  async (userAndProjectData, { dispatch, rejectWithValue }) => {
    try {
      const result = await axiosAuth.post(
        '/Project/assignUserProject',
        userAndProjectData
      );

      if (result?.status === 200) {
        // Refresh users list in the project
        await dispatch(getUserByProjectIdAPI(userAndProjectData.projectId));
        toast.success('Add user to this project successfully!');
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('You are not the creator of this project!');
        return rejectWithValue('You are not the creator of this project!');
      } else {
        toast.error('Something wrong happened!');
        return rejectWithValue('Something wrong happened!');
      }
    }
  }
);

export const deleteUserFromTaskAPI = createAsyncThunk(
  'userReducer/deleteUserFromTaskAPI',
  async (userAndTaskData, { rejectWithValue }) => {
    try {
      await axiosAuth.post('/Project/removeUserFromTask', userAndTaskData);
    } catch (error) {
      if (error) {
        return rejectWithValue('Something wrong happened!');
      }
    }
  }
);

export const deleteUserFromProjectAPI = createAsyncThunk(
  'userReducer/deleteUserFromProjectAPI',
  async (userAndProjectData, { dispatch, getState, rejectWithValue }) => {
    try {
      const result = await axiosAuth.post(
        '/Project/removeUserFromProject',
        userAndProjectData
      );

      if (result?.status === 200) {
        const { userId, projectId } = userAndProjectData;

        // Refresh users list in the project
        await dispatch(getUserByProjectIdAPI(projectId));

        const state = getState();
        const { projectDetailWithTasks } = state.projectReducer;

        // Delete user from every task that has that user in
        projectDetailWithTasks?.lstTask.forEach((list) =>
          list.lstTaskDeTail?.forEach(async (task) => {
            if (task.assigness.find((assignee) => assignee.id === userId)) {
              await dispatch(
                deleteUserFromTaskAPI({
                  taskId: task.taskId,
                  userId: userId,
                })
              );
            }
          })
        );

        toast.success('Delete user from this project successfully!');
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('You are not the creator of this project!');
        return rejectWithValue('You are not the creator of this project!');
      } else {
        toast.error('Something wrong happened!');
        return rejectWithValue('Something wrong happened!');
      }
    }
  }
);

export const getUserByIdAPI = createAsyncThunk(
  'userReducer/getUserByIdAPI',
  async (userId, { rejectWithValue }) => {
    try {
      const result = await axiosAuth.get(`/Users/getUser?keyword=${userId}`);

      if (result?.status === 200) {
        const allUsersFound = result?.data?.content;
        const userFound = allUsersFound.find((user) => user.userId === +userId);
        if (userFound) {
          return userFound;
        }
        return null;
      }
    } catch (error) {
      if (error) {
        toast.error('Something wrong happened!');
        return rejectWithValue('Something wrong happened!');
      }
    }
  }
);

export const editCurrentUserProfileAPI = createAsyncThunk(
  'userReducer/editCurrentUserProfileAPI',
  async (editUserFormInputs, { dispatch, getState, rejectWithValue }) => {
    try {
      const result = await axiosAuth.put('/Users/editUser', editUserFormInputs);

      if (result?.status === 200) {
        await dispatch(getUserByIdAPI(editUserFormInputs.id));

        const state = getState();
        const { userFound } = state.userReducer;
        dispatch(
          saveCurrentUserDataAction({
            ...userFound,
            id: userFound.userId,
          })
        );
        toast.success('Update user information successfully!');
      }
    } catch (error) {
      if (error) {
        toast.error('Something wrong happened!');
        return rejectWithValue('Something wrong happened!');
      }
    }
  }
);

export const editUserAPI = createAsyncThunk(
  'userReducer/editUserAPI',
  async (editUserFormInputs, { dispatch, getState, rejectWithValue }) => {
    try {
      const result = await axiosAuth.put('/Users/editUser', editUserFormInputs);

      if (result?.status === 200) {
        await dispatch(getUserByIdAPI(editUserFormInputs.id));

        const state = getState();
        const { userFound } = state.userReducer;
        const { currentUserData } = state.userReducer;

        // Update current user if edited
        if (userFound.userId === currentUserData.id) {
          dispatch(
            saveCurrentUserDataAction({
              ...userFound,
              id: userFound.userId,
            })
          );
        }

        await dispatch(getAllUsersInProjectAPI());
        toast.success('Update user information successfully!');
      }
    } catch (error) {
      if (error) {
        toast.error('Something wrong happened!');
        return rejectWithValue('Something wrong happened!');
      }
    }
  }
);

export const deleteUserAPI = createAsyncThunk(
  'userReducer/deleteUserAPI',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const result = await axiosAuth.delete(`/Users/deleteUser?id=${id}`);

      if (result?.status === 200) {
        await dispatch(getAllUsersInProjectAPI());
        toast.success('Delete user successfully!');
      }
    } catch (error) {
      if (error) {
        toast.error('Something wrong happened!');
        return rejectWithValue('Something wrong happened!');
      }
    }
  }
);

export const getUserByProjectIdAPI = createAsyncThunk(
  'userReducer/getUserByProjectIdAPI',
  async (projectId, { rejectWithValue }) => {
    try {
      const result = await axiosAuth.get(
        `/Users/getUserByProjectId?idProject=${projectId}`
      );

      if (result?.status === 200) {
        return result.data.content;
      }
    } catch (error) {
      if (error) {
        toast.error('Something wrong happened!');
        return rejectWithValue('Something wrong happened!');
      }
    }
  }
);

const initialState = {
  isLoading: false,
  userFulfilled: false,
  currentUserData:
    getStoreJson(process.env.REACT_APP_CURRENT_USER_DATA) || null,
  userLogin: getStoreJson(process.env.REACT_APP_USER_LOGIN) || null,
  users: [],
  usersInProject: [],
  usersOutsideProject: [],
  userFound: null,
};

const userReducer = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {
    logoutAction: (state) => {
      state.userLogin = null;
      eraseStore(process.env.REACT_APP_CURRENT_USER_DATA);
      eraseStore(process.env.REACT_APP_USER_LOGIN);
    },
    saveCurrentUserDataAction: (state, { payload }) => {
      state.currentUserData = payload;
      setStore(process.env.REACT_APP_CURRENT_USER_DATA, payload);
    },
    setFalseUserFulfilledAction: (state) => {
      state.userFulfilled = false;
    },
  },
  extraReducers: (builder) => {
    // registerAPI
    builder.addCase(registerAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(registerAPI.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(registerAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // loginAPI
    builder.addCase(loginAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loginAPI.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userLogin = action.payload;
      router.navigate('/projects');
    });
    builder.addCase(loginAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // getAllUsersAPI
    builder.addCase(getAllUsersAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllUsersAPI.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.users = payload;
    });
    builder.addCase(getAllUsersAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // getAllUsersInProjectAPI
    builder.addCase(getAllUsersInProjectAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllUsersInProjectAPI.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.usersInProject = payload;
    });
    builder.addCase(getAllUsersInProjectAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // getUsersOutsideProjectByKeywordAPI
    builder.addCase(getUsersOutsideProjectByKeywordAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      getUsersOutsideProjectByKeywordAPI.fulfilled,
      (state, { payload }) => {
        state.isLoading = false;
        state.usersOutsideProject = payload;
      }
    );
    builder.addCase(getUsersOutsideProjectByKeywordAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // getUserByIdAPI
    builder.addCase(getUserByIdAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserByIdAPI.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.userFound = payload;
    });
    builder.addCase(getUserByIdAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // editCurrentUserProfileAPI
    builder.addCase(editCurrentUserProfileAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(editCurrentUserProfileAPI.fulfilled, (state) => {
      state.isLoading = false;
      state.userFulfilled = true;
    });
    builder.addCase(editCurrentUserProfileAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // getUserByProjectIdAPI
    builder.addCase(getUserByProjectIdAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserByProjectIdAPI.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.usersInProject = payload;
    });
    builder.addCase(getUserByProjectIdAPI.rejected, (state) => {
      state.isLoading = false;
    });

    // addUserToProjectAPI, deleteUserFromProjectAPI
    builder.addMatcher(
      isAnyOf(addUserToProjectAPI.pending, deleteUserFromProjectAPI.pending),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        addUserToProjectAPI.fulfilled,
        deleteUserFromProjectAPI.fulfilled
      ),
      (state) => {
        state.isLoading = false;
      }
    );
    builder.addMatcher(
      isAnyOf(addUserToProjectAPI.rejected, deleteUserFromProjectAPI.rejected),
      (state) => {
        state.isLoading = false;
      }
    );
  },
});

export const {
  logoutAction,
  saveCurrentUserDataAction,
  setFalseUserFulfilledAction,
} = userReducer.actions;

export default userReducer.reducer;
