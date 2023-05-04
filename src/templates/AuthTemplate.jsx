import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthTemplate = () => {
  const { userLoggedIn } = useSelector((state) => state.userReducer);

  if (userLoggedIn) {
    return <Navigate to="/projects" />;
  }

  return <Outlet />;
};

export default AuthTemplate;
