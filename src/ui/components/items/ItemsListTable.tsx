import { Box, IconButton } from "@mui/material";
import React from "react";
import { removeItem } from "../../pages/BillsPage/BillsSlice";
import { DataGrid } from "@mui/x-data-grid";

const ItemsListTable = () => {
  const sampleRow = [
    {
      id: 1,
      no: 1,
      code: "ITEM001",
      item_name: "Steel Rod 10mm",
      qty: 50,
      uom: "KG",
      rate: 120,
      amount: 6000,
    },
    {
      id: 2,
      no: 2,
      code: "ITEM002",
      item_name: "Cement Bag 50kg",
      qty: 20,
      uom: "BAG",
      rate: 350,
      amount: 7000,
    },
    {
      id: 3,
      no: 3,
      code: "ITEM003",
      item_name: "Bricks (Red Clay)",
      qty: 500,
      uom: "PCS",
      rate: 8,
      amount: 4000,
    },
  ];

  const columns = [
    {
      field: "action",
      headerName: "",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        console.log("sysguyd", params);
        return (
          <IconButton onClick={() => dispatch(removeItem({ code: params.id }))}>
            {/* <ClearRoundedIcon sx={{ color: "red" }} /> */}
          </IconButton>
        );
      },
    },
    { field: "no", headerName: "NO", flex: 0.5 },
    { field: "code", headerName: "CODE", flex: 1 },
    { field: "item_name", headerName: "ITEM NAME", flex: 3 },
    { field: "qty", headerName: "QUANTITY", flex: 1, editable: true },
    { field: "uom", headerName: "UOM", flex: 1 },
    {
      field: "rate",
      headerName: "RATE",
      flex: 1,
      align: "right",
      headerAlign: "right",
      valueGetter: (params) => {
        return params !== undefined ? `₹${params}` : " ₹0";
      },
    },
    {
      field: "amount",
      headerName: "AMOUNT",
      flex: 1,
      align: "right",
      headerAlign: "right",
      valueGetter: (params) => {
        return params !== undefined ? `₹${params}` : " ₹0";
      },
    },
  ];
  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <div style={{ height: "100%", overflow: "hidden" }}>
        <DataGrid
          rows={sampleRow}
          columns={columns}
          disableColumnMenu
          hideFooter
          //   processRowUpdate={handleProcessRowUpdate}
          sx={{
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#1E1E2D !important", // Ensure each column header is colored
              color: "white",
            },
          }}
        />
      </div>
    </Box>
  );
};

export default ItemsListTable;
