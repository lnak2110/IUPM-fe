import { useState } from 'react';
import { theme } from '../App';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { DataGrid, GridMoreVertIcon, GridToolbar } from '@mui/x-data-grid';

const MoreActionsIconTip = () => {
  return (
    <Tooltip title="More actions" placement="left">
      <GridMoreVertIcon />
    </Tooltip>
  );
};

const MUIDataGrid = ({ columns, rows, initialPageSizeNumber, rowId }) => {
  const [pageSize, setPageSize] = useState(initialPageSizeNumber);

  return (
    //  minWidth: Prevent MUI useResizeContainer error
    <Box sx={{ minWidth: '100px' }}>
      <DataGrid
        rows={rows ?? []}
        columns={columns}
        getRowId={(row) => row[rowId]}
        autoHeight
        disableRowSelectionOnClick
        pageSizeOptions={[10, 20, 50, 100]}
        paginationModel={{ page: 0, pageSize }}
        onPaginationModelChange={(newPageSizeNumber) =>
          setPageSize(newPageSizeNumber)
        }
        disableDensitySelector
        components={{
          Toolbar: GridToolbar,
          MoreActionsIcon: MoreActionsIconTip,
        }}
        componentsProps={{
          toolbar: {
            csvOptions: { disableToolbarButton: true },
            printOptions: { disableToolbarButton: true },
            showQuickFilter: true,
          },
        }}
        sx={{
          '	.MuiDataGrid-columnHeaders': {
            backgroundColor: theme.palette.grey[200],
          },
          '& .MuiDataGrid-virtualScroller': {
            md: { overflow: 'hidden' },
          },
        }}
      />
    </Box>
  );
};

export default MUIDataGrid;
