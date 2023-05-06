import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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
        setStore(process.env.REACT_APP_USER_LOGGED_IN, { email, accessToken });

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
  async ({ projectId, keyword }, { rejectWithValue }) => {
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

export const getUserAPI = createAsyncThunk(
  'userReducer/getUserAPI',
  async (id, { rejectWithValue }) => {
    try {
      const result = await axiosAuth.get(`/users/${id}`);

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

export const updateCurrentUserAPI = createAsyncThunk(
  'userReducer/updateCurrentUserAPI',
  async (updateCurrentUserData, { dispatch, rejectWithValue }) => {
    try {
      const { id, ...restData } = updateCurrentUserData;

      const result = await axiosAuth.patch(`/users/${id}`, restData);

      if (result?.status === 200) {
        await dispatch(getUserAPI(id));

        dispatch(saveCurrentUserDataAction(result?.data?.content));
        toast.success('Update user information successfully!');
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || 'Something wrong happened!'
      );
    }
  }
);

const initialState = {
  isLoading: false,
  userFulfilled: false,
  currentUserData:
    getStoreJson(process.env.REACT_APP_CURRENT_USER_DATA) || null,
  userLoggedIn: getStoreJson(process.env.REACT_APP_USER_LOGGED_IN) || null,
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
      state.userLoggedIn = null;
      eraseStore(process.env.REACT_APP_CURRENT_USER_DATA);
      eraseStore(process.env.REACT_APP_USER_LOGGED_IN);
    },
    saveCurrentUserDataAction: (state, { payload }) => {
      state.currentUserData = payload;
      setStore(process.env.REACT_APP_CURRENT_USER_DATA, payload);
    },
    setFalseUserFulfilledAction: (state) => {
      state.userFulfilled = false;
    },
    setEmptyUsersInProject: (state) => {
      state.usersInProject = [];
    },
    setEmptyUsersOutsideProject: (state) => {
      state.usersOutsideProject = [];
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
      state.userLoggedIn = action.payload;
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
    // getUserAPI
    builder.addCase(getUserAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserAPI.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.userFound = payload;
    });
    builder.addCase(getUserAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // updateCurrentUserAPI
    builder.addCase(updateCurrentUserAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateCurrentUserAPI.fulfilled, (state) => {
      state.isLoading = false;
      state.userFulfilled = true;
    });
    builder.addCase(updateCurrentUserAPI.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const {
  logoutAction,
  saveCurrentUserDataAction,
  setFalseUserFulfilledAction,
  setEmptyUsersInProject,
  setEmptyUsersOutsideProject,
} = userReducer.actions;

export default userReducer.reducer;
