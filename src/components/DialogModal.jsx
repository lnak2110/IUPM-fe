import { cloneElement, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import {
  bindDialog,
  bindTrigger,
  usePopupState,
} from 'material-ui-popup-state/hooks';
import { NavLink, useParams } from 'react-router-dom';

const DialogModal = ({
  buttonOpen,
  children,
  popupId,
  title,
  ariaLabel,
  preventCloseBackdrop,
  maxWidthValue,
  heightValue,
  taskId,
}) => {
  const { taskId: taskIdURL } = useParams();

  const dialogPopupState = usePopupState({
    variant: 'dialog',
    popupId: popupId,
  });

  // For task detail dialog
  useEffect(() => {
    if (
      taskId &&
      taskIdURL &&
      taskIdURL === taskId &&
      !dialogPopupState.isOpen
    ) {
      dialogPopupState.open();
    }
  }, [taskId, taskIdURL, dialogPopupState]);

  return (
    <>
      {cloneElement(buttonOpen, {
        ...bindTrigger(dialogPopupState),
      })}
      <Dialog
        {...bindDialog(dialogPopupState)}
        PaperProps={{
          sx: heightValue
            ? {
                minHeight: heightValue,
              }
            : {
                height: '90vh',
              },
        }}
        maxWidth={maxWidthValue || 'md'}
        fullWidth
        aria-labelledby={ariaLabel}
        {...(preventCloseBackdrop && { disableEscapeKeyDown: true })}
        {...(preventCloseBackdrop && {
          onClose: (_e, reason) => {
            if (reason && reason === 'backdropClick') {
              return;
            }
          },
        })}
      >
        <DialogTitle
          id={ariaLabel}
          variant="h5"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 1,
          }}
        >
          <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </Box>
          <IconButton
            aria-label="close"
            edge="end"
            onClick={dialogPopupState.close}
            // For task detail dialog
            {...(taskId && { component: NavLink })}
            {...(taskId && { to: '.' })}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        {cloneElement(children, { handleCloseModal: dialogPopupState.close })}
      </Dialog>
    </>
  );
};

export default DialogModal;
