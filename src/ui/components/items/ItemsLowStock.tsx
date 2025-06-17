import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectLowStockItemList,
  setLowStockItemList,
} from "../../pages/ItemsPage/ItemsSlice";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

const ItemsLowStock = () => {
  const columns = [
    { field: "item_name", headerName: "ITEM NAME", flex: 2 },
    { field: "code", headerName: "CODE", flex: 1 },
    {
      field: "purchased_rate",
      headerName: "PURCHASED RATE",
      flex: 1,
    },
    { field: "margin", headerName: "MARGIN", flex: 1 },
    {
      field: "amount",
      headerName: "SELLING RATE",
      flex: 1,
    },
    { field: "stock_qty", headerName: "STOCK QTY", flex: 1 },
    { field: "uom", headerName: "UOM", flex: 1 },

    {
      field: "low_stock_remainder",
      headerName: "LOW STOCK REMAINDER",
      flex: 1,
    },
  ];
  const dispatch = useDispatch();
  const lowStockItemList = useSelector(selectLowStockItemList);
  useEffect(() => {
    const fetchLowStockItemList = async () => {
      //@ts-ignore
      let response: any = await window.electronAPI.getLowStockItem();

      dispatch(setLowStockItemList(response));
    };

    fetchLowStockItemList();
  }, []);
  //getLowStockItem
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Search Bar */}
      <Box
        sx={{
          height: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          borderBottom: ".1px solid lightgrey",
        }}
      >
        {/* <TextField
          placeholder="Item Search"
          variant="outlined"
          sx={{
            width: "20rem",
            p: 0.5,
            background: "#F7F7FE",
            borderRadius: "8px",
            "& .MuiOutlinedInput-notchedOutline": {
              border: "0px solid lightgrey !important",
              borderRadius: "8px",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "0px solid lightgrey !important",
              borderRadius: "8px",
            },
          }}
          value={""}
          size="small"
          onChange={() => console.log("")}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton edge="start">
                  <SearchRoundedIcon
                    sx={{ fontSize: "1.9rem", color: "#1E1E2D", p: 0 }}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        /> */}
      </Box>

      {/* Data Grid Wrapper */}
      <Box
        sx={{ flexGrow: 1, maxHeight: "calc(100% - 3rem)", overflow: "auto" }}
      >
        <DataGrid
          rows={lowStockItemList}
          columns={columns}
          // disableColumnMenu

          sx={{
            minHeight: "400px", // Ensure it has a scrollable area
            "& .MuiDataGrid-columnMenuButton": {
              color: "white", // Set the column menu button's color to white for visibility
            },

            "& .MuiDataGrid-columnSeparator": {
              display: "none",
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#1E1E2D !important",
              color: "white",
              maxHeight: "50px",
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              border: "none",
            },
            border: "none",
          }}
        />
      </Box>
    </Box>
  );
};

export default ItemsLowStock;
