import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectLowStockItemList,
  setLowStockItemList,
} from "../../pages/ItemsPage/ItemsSlice";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { columns } from "./ItemsListTable";
const ItemsLowStock = () => {
  const dispatch = useDispatch();
  const lowStockItemList = useSelector(selectLowStockItemList);
  useEffect(() => {
    const fetchLowStockItemList = async () => {
      //@ts-ignore
      let response: any = await window.electronAPI.getLowStockItem();
      console.log("low stock list",response);
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
          height: "5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          borderBottom: ".1px solid lightgrey",
        }}
      >
        <TextField
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
          onChange={(e) => console.log("")}
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
        />
      </Box>

      {/* Data Grid Wrapper */}
      <Box
        sx={{ flexGrow: 1, maxHeight: "calc(100% - 6rem)", overflow: "auto" }}
      >
        <DataGrid
          rows={lowStockItemList}
          columns={columns}
          disableColumnMenu
          hideFooter
          sx={{
            minHeight: "400px", // Ensure it has a scrollable area
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#1E1E2D !important",
              color: "white",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ItemsLowStock;
