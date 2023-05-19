import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';

const UserAvatar = ({
  name,
  avatar,
  tooltip = name,
  tooltipPlacement,
  size = 40,
}) => {
  return (
    <Tooltip title={tooltip} placement={tooltipPlacement || 'bottom'}>
      <Avatar
        alt={name}
        src={avatar || '...'} // Fallback to first letter if null avatar
        sx={{ height: size, width: size }}
      ></Avatar>
    </Tooltip>
  );
};

export default UserAvatar;
