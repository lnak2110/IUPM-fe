import { cloneElement, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

const TaskDetailDialogTabs = ({
  taskDetailTabContent,
  commentsTabContent,
  handleCloseModal,
}) => {
  const [tabValue, setTabValue] = useState('Task Detail');

  const handleChange = (_event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <AppBar color="inherit" position="sticky">
        <Tabs
          value={tabValue}
          onChange={handleChange}
          centered
          TabIndicatorProps={{
            style: { transition: 'none' },
          }}
        >
          <Tab value="Task Detail" label="Task Detail" />
          <Tab value="Comments" label="Comments" />
        </Tabs>
      </AppBar>
      {tabValue === 'Task Detail'
        ? cloneElement(taskDetailTabContent, { handleCloseModal })
        : commentsTabContent}
    </>
  );
};

export default TaskDetailDialogTabs;
