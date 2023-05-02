import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthTemplate = () => {
  const { userLogin } = useSelector((state) => state.userReducer);

  if (userLogin) {
    return <Navigate to="/projects" />;
  }

  return <Outlet />;
};

export default AuthTemplate;
