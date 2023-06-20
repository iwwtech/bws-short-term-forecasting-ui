/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import PropTypes from "prop-types";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
} from "@mui/x-data-grid";
import { Box } from "@mui/material";

const csvOptions = { delimiter: ";" };

// Generate toolbar with CSV export button
function CustomToolbar(props) {
  return (
    <GridToolbarContainer {...props}>
      <GridToolbarExportContainer {...props}>
        <GridCsvExportMenuItem options={csvOptions} />
      </GridToolbarExportContainer>
    </GridToolbarContainer>
  );
}

function CsvExportDataGrid({ data }) {
  const columns = [
    {
      field: "datePredicted",
      headerName: "Datetime",
      width: 250,
    },
    { field: "numValue", headerName: "Value", width: 250 },
    {
      field: "histRefValues.prevMonth",
      headerName: "Last Month",
      width: 250,
      valueGetter: (params) => params.row.histRefValues.prevMonth,
    },
    {
      field: "histRefValues.prevWeek",
      headerName: "Last Week",
      width: 250,
      valueGetter: (params) => params.row.histRefValues.prevWeek,
    },
  ];

  return (
    <Box sx={{ height: 406, width: "100%" }}>
      <DataGrid
        rows={Object.values(data)}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        slots={{ toolbar: CustomToolbar }}
        key="numValue"
      />
    </Box>
  );
}

CsvExportDataGrid.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape).isRequired,
};

export default CsvExportDataGrid;
