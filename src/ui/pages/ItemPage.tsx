import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface Item {
  id: number;
  name: string;
  sku: string;
  type: string;
  description: string;
  rate: string;
}

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "NAME",
    flex: 1,
    renderCell: (params) => (
      <Typography color="primary" sx={{ cursor: "pointer" }}>
        {params.value as string}
      </Typography>
    ),
  },
  { field: "sku", headerName: "SKU", flex: 1 },
  { field: "type", headerName: "TYPE", flex: 1 },
  { field: "description", headerName: "DESCRIPTION", flex: 2 },
  { field: "rate", headerName: "RATE", flex: 1, align: "right", headerAlign: "right" },
];

const rows: Item[] = [
  { id: 1, name: "Queen Size Bed", sku: "Item 1 sku", type: "Goods", description: "Mid-century wooden double be...", rate: "₹1681.00" },
  { id: 2, name: "Queen Size Bed", sku: "Item 2 sku", type: "Goods", description: "Mid-century wooden double be...", rate: "₹6667.00" },
  { id: 3, name: "Executive Office Desk", sku: "Item 3 sku", type: "Goods", description: "A spacious executive desk with ...", rate: "₹4317.00" },
  { id: 4, name: "Coffee Table", sku: "Item 4 sku", type: "Goods", description: "A sleek, modern coffee table wit...", rate: "₹8939.00" },
  { id: 5, name: "Storage Cabinet", sku: "Item 5 sku", type: "Goods", description: "A versatile storage cabinet with ...", rate: "₹1992.00" },
  { id: 6, name: "Storage Cabinet", sku: "Item 6 sku", type: "Goods", description: "A versatile storage cabinet with ...", rate: "₹3157.00" },
  { id: 7, name: "Queen Size Bed", sku: "Item 7 sku", type: "Goods", description: "Mid-century wooden double be...", rate: "₹7719.00" },
  { id: 8, name: "Executive Office Desk", sku: "Item 8 sku", type: "Goods", description: "A spacious executive desk with ...", rate: "₹9945.00" },
];

const ItemsPage: React.FC = () => {
  return (
    <Box sx={{ height: "100vh", width: "100%", p: 2, bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">
          All Items
        </Typography>
        <Button variant="contained" color="success" startIcon={<AddIcon />} size="small">
          New
        </Button>
      </Box>

      {/* Scrollable Table Container */}
      <Box sx={{ flexGrow: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            checkboxSelection
            // disableSelectionOnClick
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                position: "sticky",
                top: 0,
                backgroundColor: "#f5f5f5",
                zIndex: 1,
                fontWeight: "bold",
              },
              "& .MuiDataGrid-virtualScroller": {
                overflowX: "auto",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .MuiCheckbox-root": {
                color: "primary.main",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ItemsPage;
