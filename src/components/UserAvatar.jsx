import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';

export const UserAvatar = ({ name, avatar, size = 40 }) => {
  return (
    <Tooltip title={name}>
      <Avatar alt={name} src={avatar} sx={{ height: size, width: size }}>
        {name}
      </Avatar>
    </Tooltip>
  );
};

export default UserAvatar;
