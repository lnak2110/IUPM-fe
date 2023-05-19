import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { Provider } from 'react-redux/es/exports';
import store from './redux/configStore';
import AuthTemplate from './templates/AuthTemplate';
import HomeTemplate from './templates/HomeTemplate';
import CreateProject from './pages/createProject/CreateProject';
import Login from './pages/login/Login';
import ProjectBoard from './pages/projectBoard/ProjectBoard';
import Projects from './pages/projects/Projects';
import Register from './pages/register/Register';
import UpdateProject from './pages/updateProject/UpdateProject';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  blueGrey,
  cyan,
  deepPurple,
  green,
  indigo,
} from '@mui/material/colors';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ConfirmProvider } from 'material-ui-confirm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export const theme = createTheme({
  palette: {
    blueGrey: {
      main: blueGrey[500],
      contrastText: '#fff',
    },
    cyan: {
      main: cyan[700],
      contrastText: '#fff',
    },
    deepPurple: {
      main: deepPurple[400],
      contrastText: '#fff',
    },
    green: {
      main: green[600],
      contrastText: '#fff',
    },
    indigo: {
      main: indigo[600],
      contrastText: '#fff',
    },
  },
});

export const router = createBrowserRouter([
  {
    path: '*',
    element: (
      <Provider store={store}>
        <Routes>
          <Route element={<AuthTemplate />}>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/login" element={<Login />}></Route>
          </Route>
          <Route element={<HomeTemplate />}>
            <Route path="/" element={<Navigate to="/projects" />}></Route>
            <Route path="/projects">
              <Route index element={<Projects />}></Route>
              <Route path="create" element={<CreateProject />}></Route>
              <Route
                path=":projectId/update"
                element={<UpdateProject />}
              ></Route>
              <Route path=":projectId/board" element={<ProjectBoard />}>
                <Route path="task/:taskId" element />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/projects" />}></Route>
        </Routes>
      </Provider>
    ),
  },
]);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <ToastContainer />
        <ConfirmProvider>
          <RouterProvider router={router} />
        </ConfirmProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
