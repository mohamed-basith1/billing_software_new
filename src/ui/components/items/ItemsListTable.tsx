import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteItemList,
  selectItemList,
  selectItemListSearch,
  selectSelectedItem,
  setEditItemModal,
  setItemList,
  setItemListSearch,
  setItemSummary,
  setSelectItemName,
  setSelectedItem,
} from "../../pages/ItemsPage/ItemsSlice";
import { setCustomerDeleteModal } from "../../pages/CustomersPage/CustomersSlice";
import DeleteModal from "../modals/DeleteModal";
import "./ItemTable.css";
import { toast } from "react-toastify";

const ItemsListTable = () => {
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
    {
      field: "item_expiry_date",
      headerName: "ACTION",

      flex: 1.5,
      headerAlign: "center",
      renderCell: (params) => {
        try {
          return (
            <Box>
              <Button
                onClick={() => {
                  dispatch(setSelectedItem(params.row));
                  dispatch(setSelectItemName(params.row.item_name));
                  dispatch(setEditItemModal(true));
                }}
                sx={{
                  height: "2rem",
                  bgcolor: "white",
                  color: "black",
                  mr: 1,
                  "&:hover": {
                    bgcolor: "white", // Change this to any color you want on hover,
                    color: "black",
                  },
                }}
              >
                Edit
              </Button>
              <Button
                onClick={() => {
                  dispatch(setSelectedItem(params.row));
                  dispatch(setCustomerDeleteModal(true));
                }}
                sx={{
                  height: "2rem",
                  bgcolor: "white",
                  color: "black",
                  "&:hover": {
                    bgcolor: "white", // Change this to any color you want on hover,
                    color: "black",
                  },
                }}
              >
                Delete
              </Button>
            </Box>
          );
        } catch (err) {
          return <span>Error</span>;
        }
      },
    },
  ];
  const dispatch = useDispatch();
  const ItemList = useSelector(selectItemList);
  const itemListSearch = useSelector(selectItemListSearch);
  const selectedItem = useSelector(selectSelectedItem);
  useEffect(() => {
    const fetItemList = async () => {
      //@ts-ignore
      let response: any = await window.electronAPI.getItem();

      dispatch(setItemList(response));
    };
    if (itemListSearch === "") {
      fetItemList();
    }
  }, [itemListSearch]);

  const handleSearch = async (data: any) => {
    dispatch(setItemListSearch(data));
    //@ts-ignore
    let response = await window.electronAPI.searchItem(data);
    dispatch(setItemList(response.map((data) => ({ id: data._id, ...data }))));
  };

  const handleDeleteItem = async () => {
    //@ts-ignore
    let response = await window.electronAPI.deleteItem(selectedItem.unique_id);
    if (response.status === 200) {
      const itemSummaryHandle = async () => {
        //@ts-ignore
        let response: any = await window.electronAPI.itemSummary();

        if (response.status !== 200) {
          // toast.error(`${response.message}`, { position: "bottom-left" });
        } else {
          dispatch(setItemSummary(response?.data));
        }
      };
      itemSummaryHandle();
      dispatch(deleteItemList(selectedItem.unique_id));
      dispatch(setCustomerDeleteModal(false));
      toast.success(`${response.message}`, { position: "bottom-left" });
    }
  };
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
          value={itemListSearch}
          size="small"
          onChange={(e) => handleSearch(e.target.value)}
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
      <Box className="itemListTable" sx={{ flexGrow: 1, overflow: "auto" }}>
        <DataGrid
          rows={ItemList}
          columns={columns}
          sx={{
            minHeight: "400px", // Ensure it has a scrollable area

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
      <DeleteModal itemDelete={true} handleDeleteBill={handleDeleteItem} />
    </Box>
  );
};

export default ItemsListTable;
