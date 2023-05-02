import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './reducers/projectReducer';
import taskReducer from './reducers/taskReducer';
import commentReducer from './reducers/commentReducer';
import userReducer from './reducers/userReducer';

const store = configureStore({
  reducer: {
    projectReducer,
    taskReducer,
    commentReducer,
    userReducer,
  },
});

export default store;
