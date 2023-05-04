import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { axiosAuth } from '../../utils/config';
import {
  getAllUsersInProjectAPI,
  getUsersOutsideProjectByKeywordAPI,
} from './userReducer';

export const getProjectsByUserAPI = createAsyncThunk(
  'projectReducer/getProjectsByUserAPI',
  async (userId, { rejectWithValue }) => {
    try {
      const result = await axiosAuth.get(`/projects/user/${userId}`);
      if (result?.status === 200) {
        return result.data.content;
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || 'Something wrong happened!'
      );
    }
  }
);

export const createProjectAPI = createAsyncThunk(
  'projectReducer/createProjectAPI',
  async (createProjectData, { rejectWithValue }) => {
    try {
      const data = {
        ...createProjectData,
        deadline: format(createProjectData.deadline, "yyyy-MM-dd'T'HH:mm:ss"),
      };

      const result = await axiosAuth.post('/projects/', data);

      if (result?.status === 200) {
        toast.success('Create a project successfully!');
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || 'Something wrong happened!'
      );
    }
  }
);

export const getProjectListsAPI = createAsyncThunk(
  'projectReducer/getProjectListsAPI',
  async (id, { rejectWithValue }) => {
    try {
      const result = await axiosAuth.get(`/projects/${id}/lists`);

      if (result?.status === 200) {
        return result.data.content;
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || 'Something wrong happened!'
      );
    }
  }
);

export const getProjectDetailAPI = createAsyncThunk(
  'projectReducer/getProjectDetailAPI',
  async (id, { rejectWithValue }) => {
    try {
      const result = await axiosAuth.get(`/projects/${id}?data=short`);

      if (result?.status === 200) {
        return result.data.content;
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || 'Something wrong happened!'
      );
    }
  }
);

export const getProjectDetailFullAPI = createAsyncThunk(
  'projectReducer/getProjectDetailFullAPI',
  async (id, { rejectWithValue }) => {
    try {
      const result = await axiosAuth.get(`/projects/${id}`);

      if (result?.status === 200) {
        return result.data.content;
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || 'Something wrong happened!'
      );
    }
  }
);

export const updateProjectManyMembersAPI = createAsyncThunk(
  'projectReducer/updateProjectManyMembersAPI',
  async ({ id, members, userId }, { dispatch, rejectWithValue }) => {
    try {
      // Change structure of the data to be sent
      const data = { idsArr: members?.map((m) => m.id) };

      const result = await axiosAuth.patch(`/projects/${id}/members`, data);

      if (result?.status === 200) {
        await dispatch(getProjectsByUserAPI(userId));
        toast.success('Update project members successfully!');
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || 'Something wrong happened!'
      );
    }
  }
);

export const updateProjectAddMemberAPI = createAsyncThunk(
  'projectReducer/updateProjectAddMemberAPI',
  async ({ id, userId, keyword }, { dispatch, rejectWithValue }) => {
    try {
      const result = await axiosAuth.patch(`/projects/${id}/add-member`, {
        id: userId,
      });

      if (result?.status === 200) {
        await dispatch(getAllUsersInProjectAPI(id));
        await dispatch(getProjectDetailFullAPI(id));
        // Reset users outside project list while searching
        await dispatch(
          getUsersOutsideProjectByKeywordAPI({ projectId: id, keyword })
        );
        toast.success('Update project members successfully!');
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || 'Something wrong happened!'
      );
    }
  }
);

export const updateProjectDeleteMemberAPI = createAsyncThunk(
  'projectReducer/updateProjectDeleteMemberAPI',
  async ({ id, userId, keyword }, { dispatch, rejectWithValue }) => {
    try {
      const result = await axiosAuth.patch(`/projects/${id}/delete-member`, {
        id: userId,
      });

      if (result?.status === 200) {
        await dispatch(getAllUsersInProjectAPI(id));
        await dispatch(getProjectDetailFullAPI(id));
        // Reset users outside project list while searching
        await dispatch(
          getUsersOutsideProjectByKeywordAPI({ projectId: id, keyword })
        );
        toast.success('Update project members successfully!');
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || 'Something wrong happened!'
      );
    }
  }
);

export const updateProjectAPI = createAsyncThunk(
  'projectReducer/updateProjectAPI',
  async (editProjectData, { dispatch, rejectWithValue }) => {
    try {
      const data = {
        ...editProjectData,
        deadline: format(editProjectData.deadline, "yyyy-MM-dd'T'HH:mm:ss"),
      };

      const result = await axiosAuth.put(`/projects/${data.id}`, data);

      if (result?.status === 200) {
        await dispatch(getProjectDetailAPI(data.id));
        toast.success('Update a project successfully!');
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || 'Something wrong happened!'
      );
    }
  }
);

export const deleteProjectAPI = createAsyncThunk(
  'projectReducer/deleteProjectAPI',
  async (projectId, { dispatch, rejectWithValue }) => {
    try {
      const result = await axiosAuth.delete(
        `/Project/deleteProject?projectId=${projectId}`
      );

      if (result?.status === 200) {
        await dispatch(getProjectsByUserAPI());
        toast.success('Delete a project successfully!');
      }
    } catch (error) {
      if (error) {
        if (error.response?.status === 403) {
          toast.error('You are not the creator of this project!');
          return rejectWithValue('You are not the creator of this project!');
        } else {
          toast.error('Something wrong happened!');
          return rejectWithValue('Something wrong happened!');
        }
      }
    }
  }
);

const initialState = {
  isLoading: false,
  projects: [],
  projectFulfilled: false,
  projectLists: [],
  projectDetail: null,
  projectDetailFull: null,
};

const projectReducer = createSlice({
  name: 'projectReducer',
  initialState,
  reducers: {
    setFalseProjectFulfilledAction: (state) => {
      state.projectFulfilled = false;
    },
  },
  extraReducers: (builder) => {
    // getProjectsByUserAPI
    builder.addCase(getProjectsByUserAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProjectsByUserAPI.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.projects = payload;
    });
    builder.addCase(getProjectsByUserAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // getProjectListsAPI
    builder.addCase(getProjectListsAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProjectListsAPI.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.projectLists = payload;
    });
    builder.addCase(getProjectListsAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // getProjectDetailFullAPI
    builder.addCase(getProjectDetailFullAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProjectDetailFullAPI.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.projectDetailFull = payload;
    });
    builder.addCase(getProjectDetailFullAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // createProjectAPI
    builder.addCase(createProjectAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createProjectAPI.fulfilled, (state) => {
      state.isLoading = false;
      state.projectFulfilled = true;
    });
    builder.addCase(createProjectAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // updateProjectManyMembersAPI
    builder.addCase(updateProjectManyMembersAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateProjectManyMembersAPI.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(updateProjectManyMembersAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // updateProjectAddMemberAPI
    builder.addCase(updateProjectAddMemberAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateProjectAddMemberAPI.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(updateProjectAddMemberAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // updateProjectDeleteMemberAPI
    builder.addCase(updateProjectDeleteMemberAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateProjectDeleteMemberAPI.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(updateProjectDeleteMemberAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // getProjectDetailAPI & updateProjectAPI
    builder.addCase(getProjectDetailAPI.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.projectDetail = payload;
    });
    builder.addCase(updateProjectAPI.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(getProjectDetailAPI.pending, updateProjectAPI.pending),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getProjectDetailAPI.rejected, updateProjectAPI.rejected),
      (state) => {
        state.isLoading = false;
      }
    );
  },
});

export const { setFalseProjectFulfilledAction } = projectReducer.actions;

export default projectReducer.reducer;
