import { memo } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";

const columns: GridColDef[] = [
  { field: "code", headerName: "CODE", flex: 1 },
  {
    field: "item_name",
    headerName: "ITEM NAME",
    flex: 3,
    renderCell: (params) => (
      <Typography color="primary" sx={{ cursor: "pointer" }}>
        {params.value}
      </Typography>
    ),
  },

  { field: "qty", headerName: "QUANTITY", flex: 1 },
  { field: "uom", headerName: "UOM", flex: 1 },
  {
    field: "rate",
    headerName: "RATE",
    flex: 1,
    align: "right",
    headerAlign: "right",
  },
  {
    field: "amount",
    headerName: "AMOUNT",
    flex: 1,
    align: "right",
    headerAlign: "right",
  },
];

const BillingItems = memo(({ billingItems }: any) => {
  return (
    <Box sx={{ height: "calc(100% - 12rem)", width: "100%" }}>
      <DataGrid
        rows={billingItems.items}
        columns={columns}
        disableColumnMenu
        hideFooter
      />
    </Box>
  );
});

export default BillingItems;
