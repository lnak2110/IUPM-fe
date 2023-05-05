import { toast } from 'react-toastify';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosAuth, formatDate } from '../../utils/config';
import { getProjectDetailFullAPI } from './projectReducer';

export const createTaskAPI = createAsyncThunk(
  'taskReducer/createTaskAPI',
  async (createTaskData, { dispatch, rejectWithValue }) => {
    const { taskMembers, deadline, ...restData } = createTaskData;

    try {
      const data = {
        ...restData,
        taskMembers: taskMembers?.map((user) => user.id),
        deadline: formatDate(deadline),
      };

      const result = await axiosAuth.post('/tasks', data);

      if (result?.status === 200) {
        await dispatch(getProjectDetailFullAPI(data.listProjectId));
        toast.success('Create a task successfully!');
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || 'Something wrong happened!'
      );
    }
  }
);

export const updateTaskListAPI = createAsyncThunk(
  'taskReducer/updateTaskListAPI',
  async (updateTaskListData, { dispatch, rejectWithValue }) => {
    const { id, projectId, ...restData } = updateTaskListData;

    try {
      const result = await axiosAuth.patch(
        `/tasks/${id}/update-list`,
        restData
      );

      if (result?.status === 200) {
        dispatch(getProjectDetailFullAPI(projectId));
      }
    } catch (error) {
      dispatch(getProjectDetailFullAPI(projectId));
      return rejectWithValue(
        error?.response?.data?.message || 'Something wrong happened!'
      );
    }
  }
);

export const getTaskDetailAPI = createAsyncThunk(
  'taskReducer/getTaskDetailAPI',
  async (id, { rejectWithValue }) => {
    try {
      const result = await axiosAuth.get(`/tasks/${id}`);

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

export const updateTaskAPI = createAsyncThunk(
  'taskReducer/updateTaskAPI',
  async (updateTaskData, { dispatch, rejectWithValue }) => {
    try {
      const { projectId, id, taskMembers, deadline, ...restData } =
        updateTaskData;

      const data = {
        ...restData,
        taskMembers: taskMembers?.map((user) => user.id),
        deadline: formatDate(deadline),
      };

      const result = await axiosAuth.put(`/tasks/${id}`, data);

      if (result?.status === 200) {
        await dispatch(getProjectDetailFullAPI(projectId));
        toast.success('Update a task successfully!');
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || 'Something wrong happened!'
      );
    }
  }
);

export const deleteTaskAPI = createAsyncThunk(
  'taskReducer/deleteTaskAPI',
  async ({ id, projectId }, { dispatch, rejectWithValue }) => {
    try {
      const result = await axiosAuth.delete(`/tasks/${id}`);

      if (result?.status === 200) {
        await dispatch(getProjectDetailFullAPI(projectId));
        toast.success('Delete a task successfully!');
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
  taskFulfilled: false,
  taskDetail: null,
};

const taskReducer = createSlice({
  name: 'taskReducer',
  initialState,
  reducers: {
    setFalseTaskFulfilledAction: (state) => {
      state.taskFulfilled = false;
    },
    setNullTaskDetail: (state) => {
      state.taskDetail = null;
    },
  },
  extraReducers: (builder) => {
    // createTaskAPI
    builder.addCase(createTaskAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createTaskAPI.fulfilled, (state) => {
      state.isLoading = false;
      state.taskFulfilled = true;
    });
    builder.addCase(createTaskAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // getTaskDetailAPI
    builder.addCase(getTaskDetailAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getTaskDetailAPI.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.taskDetail = payload;
    });
    builder.addCase(getTaskDetailAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // updateTaskAPI
    builder.addCase(updateTaskAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateTaskAPI.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.taskDetail = payload;
    });
    builder.addCase(updateTaskAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // updateTaskListAPI
    builder.addCase(updateTaskListAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateTaskListAPI.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(updateTaskListAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // deleteTaskAPI
    builder.addCase(deleteTaskAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteTaskAPI.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(deleteTaskAPI.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { setFalseTaskFulfilledAction, setNullTaskDetail } =
  taskReducer.actions;

export default taskReducer.reducer;
