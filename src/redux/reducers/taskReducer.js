import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosAuth } from '../../utils/config';
import { getProjectDetailAPI, getProjectDetailFullAPI } from './projectReducer';

export const createTaskAPI = createAsyncThunk(
  'taskReducer/createTaskAPI',
  async (createTaskData, { dispatch, rejectWithValue }) => {
    try {
      const data = {
        ...createTaskData,
        taskMembers: createTaskData.taskMembers?.map((user) => user.id),
        deadline: format(createTaskData.deadline, "yyyy-MM-dd'T'HH:mm:ss"),
      };

      const result = await axiosAuth.post('/tasks', data);

      if (result?.status === 200) {
        dispatch(getProjectDetailFullAPI(data.listProjectId));
        toast.success('Create a task successfully!');
      }
    } catch (error) {
      console.log(error);
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
      if (error) {
        toast.error('Something wrong happened!');
        dispatch(getProjectDetailFullAPI(projectId));
        return rejectWithValue('Something wrong happened!');
      }
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
      if (error) {
        toast.error('Something wrong happened!');
        return rejectWithValue('Something wrong happened!');
      }
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
        deadline: format(deadline, "yyyy-MM-dd'T'HH:mm:ss"),
      };

      const result = await axiosAuth.put(`/tasks/${id}`, data);

      if (result?.status === 200) {
        await dispatch(getProjectDetailFullAPI(projectId));
        toast.success('Update a task successfully!');
      }
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error?.response?.data?.message || 'Something wrong happened!'
      );
    }
  }
);

export const deleteTaskAPI = createAsyncThunk(
  'taskReducer/deleteTaskAPI',
  async (deleteTaskData, { dispatch, rejectWithValue }) => {
    try {
      const result = await axiosAuth.delete(
        `/Project/removeTask?taskId=${deleteTaskData.taskId}`
      );

      if (result?.status === 200) {
        await dispatch(getProjectDetailAPI(deleteTaskData.projectId));
        toast.success('Delete a task successfully!');
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
  },
});

export const { setFalseTaskFulfilledAction } = taskReducer.actions;

export default taskReducer.reducer;
