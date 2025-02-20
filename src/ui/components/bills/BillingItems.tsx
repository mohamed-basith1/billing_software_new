import { memo } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";

const columns: GridColDef[] = [
  { field: "item_code", headerName: "CODE", flex: 1 },
  {
    field: "item",
    headerName: "ITEM",
    flex: 3,
    renderCell: (params) => (
      <Typography color="primary" sx={{ cursor: "pointer" }}>
        {params.value}
      </Typography>
    ),
  },
  { field: "uom", headerName: "UOM", flex: 1 },
  { field: "qty", headerName: "QUANTITY", flex: 1 },
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

const rows = Array.from({ length: 25 }, (_, index) => ({
  id: index + 1,
  item_code: `IC-${1000 + index}`,
  item: `Item ${index + 1}`,
  uom: ["PCS", "KG", "LTR", "BOX"][index % 4],
  qty: Math.floor(Math.random() * 100) + 1,
  rate: `₹${(Math.random() * 5000).toFixed(2)}`,
  amount: `₹${(Math.random() * 20000).toFixed(2)}`,
}));

const BillingItems = memo(({ billingItems }: any) => {
  return (
    <Box sx={{ height: "calc(100% - 12rem)", width: "100%" }}>
      <DataGrid rows={rows} columns={columns} disableColumnMenu hideFooter />
    </Box>
  );
});

export default BillingItems;
