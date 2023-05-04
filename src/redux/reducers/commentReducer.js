import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { axiosAuth } from '../../utils/config';

export const getCommentsByTaskAPI = createAsyncThunk(
  'commentReducer/getCommentsByTaskAPI',
  async (taskId, { rejectWithValue }) => {
    try {
      const result = await axiosAuth.get(`/comments/task/${taskId}`);

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

export const createCommentAPI = createAsyncThunk(
  'commentReducer/createCommentAPI',
  async (createCommentData, { dispatch, rejectWithValue }) => {
    try {
      const result = await axiosAuth.post('/comments', createCommentData);

      if (result?.status === 200) {
        await dispatch(getCommentsByTaskAPI(createCommentData.taskId));
        toast.success('Add a comment successfully!');
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || 'Something wrong happened!'
      );
    }
  }
);

export const updateCommentAPI = createAsyncThunk(
  'commentReducer/updateCommentAPI',
  async (updateCommentData, { dispatch, rejectWithValue }) => {
    try {
      const { id, taskId, content } = updateCommentData;

      const result = await axiosAuth.patch(`/comments/${id}`, { content });

      if (result?.status === 200) {
        await dispatch(getCommentsByTaskAPI(taskId));
        toast.success('Edit your comment successfully!');
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || 'Something wrong happened!'
      );
    }
  }
);

export const deleteCommentAPI = createAsyncThunk(
  'commentReducer/deleteCommentAPI',
  async (deleteCommentData, { dispatch, rejectWithValue }) => {
    try {
      const { id, taskId } = deleteCommentData;

      const result = await axiosAuth.delete(`/comments/${id}`);

      if (result?.status === 200) {
        await dispatch(getCommentsByTaskAPI(taskId));
        toast.success('Delete your comment successfully!');
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
  commentFulfilled: false,
  commentsInTask: [],
};

const commentReducer = createSlice({
  name: 'commentReducer',
  initialState,
  reducers: {
    setFalseCommentFulfilledAction: (state) => {
      state.commentFulfilled = false;
    },
  },
  extraReducers: (builder) => {
    // getCommentsByTaskAPI
    builder.addCase(getCommentsByTaskAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCommentsByTaskAPI.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.commentsInTask = payload;
    });
    builder.addCase(getCommentsByTaskAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // createCommentAPI
    builder.addCase(createCommentAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createCommentAPI.fulfilled, (state) => {
      state.isLoading = false;
      state.commentFulfilled = true;
    });
    builder.addCase(createCommentAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // updateCommentAPI
    builder.addCase(updateCommentAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateCommentAPI.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(updateCommentAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // deleteCommentAPI
    builder.addCase(deleteCommentAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteCommentAPI.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(deleteCommentAPI.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { setFalseCommentFulfilledAction } = commentReducer.actions;

export default commentReducer.reducer;
