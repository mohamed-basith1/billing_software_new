import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDealerPurchasedPrice,
  selectFilterSearchItem,
  selectItemSearch,
  selectItems,
  setClearFilterData, setClearItemsearch, setFilterSearchItem,
  setItemSearch,
  setLoadItemWithDealer,
  setNewItemEntryModel
} from "../../pages/ItemsPage/ItemsSlice";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "react-toastify";

const ItemsDailyEntry = () => {
  const itemSearchRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const itemsearch = useSelector(selectItemSearch);
  const selectedItem = useSelector(selectFilterSearchItem);
  const dealerDetails = useSelector(selectItems);
  const dealerPurchasedPrice = useSelector(selectDealerPurchasedPrice);
  const [suggestions, setSuggestions] = useState<any>([]);
  const [selectedFlag, setSelectFlag] = useState(false);
  const [uploadStock, setUplaodStock] = useState("");

  useEffect(() => {
    itemSearchRef.current?.focus();
    if (itemsearch === "") {
      setSuggestions([]);
    } else {
      const getSuggestionsHandle = async () => {
        // const sanitizedData = JSON.parse(JSON.stringify(itemsearch));

        //@ts-ignore
        const results = await window.electronAPI.searchItem(itemsearch);
        setSuggestions(results);
    
      };

      if (selectedFlag === false) getSuggestionsHandle();
    }
  }, [itemsearch]);

  useEffect(() => {
    return () => {
      dispatch(setClearItemsearch());
      setSuggestions([]);
      setUplaodStock(0);
      dispatch(setClearFilterData());
    };
  }, []);

  const handleSelect = (item: any) => {

    dispatch(setItemSearch(item.item_name)); // Update search first
    setSelectFlag(true);
    setTimeout(() => {
      setSuggestions([]);
    }, 0); // Clear suggestions in next tick
    setTimeout(() => {
      setSelectFlag(false);
    }, 10);
    dispatch(setFilterSearchItem(item));
  };

  const handleUploadStockSubmit = async () => {
    let enterprice =
      selectedItem.uom === "gram"
        ? (Number(uploadStock) / 1000) * selectedItem.purchased_rate
        : Number(uploadStock) * selectedItem.purchased_rate;

    if (enterprice > Number(dealerPurchasedPrice)) {
      toast.error(
        `Entered item price is more than the dealer's purchased price`,
        {
          position: "bottom-left",
        }
      );
      return;
    }

    let newStockQtyAndExpiry = {
      item_name: selectedItem.item_name,
      code: selectedItem.code,
      amount: selectedItem.amount,
      purchased_rate: selectedItem.purchased_rate,
      rate: selectedItem.rate,
      uom: selectedItem.uom,
      stock_qty: Number(uploadStock),
      item_expiry_date: "",
      _id: selectedItem._id,
      unique_id: selectedItem.unique_id,
      total_purchased_amount:
        selectedItem.uom === "gram"
          ? (Number(uploadStock) / 1000) * Number(selectedItem.purchased_rate)
          : Number(uploadStock) * Number(selectedItem.purchased_rate),
    };
 
    dispatch(setLoadItemWithDealer(newStockQtyAndExpiry));
    dispatch(setClearFilterData());
    setUplaodStock(0);
    setSuggestions([]);
  };

  const isDealerInfoInvalid = () => {
    return (
      dealerDetails.dealerName === "" ||
      Number(dealerDetails.dealerPurchasedPrice) < 1
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        pt: 1,
        opacity: isDealerInfoInvalid() ? 0.5 : 1,
        justifyContent: "space-between",
        flex: 1,
      }}
      aria-hidden="true"
    >
      {/* Search Bar with relative positioning for absolute dropdown */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <TextField
          placeholder="Item Name or Code"
          variant="outlined"
          disabled={isDealerInfoInvalid()}
          sx={{
            width: "50%",
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
          value={itemsearch}
          size="small"
          inputRef={itemSearchRef}
          onChange={(e) => dispatch(setItemSearch(e.target.value))}
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

        {/* Suggestions Dropdown - Positioned Absolutely under Search Bar */}
        {suggestions.length > 0 && (
          <Paper
            elevation={3}
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "50%",
              background: "#fff",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              mt: 0.5,
              zIndex: 1000,
              maxHeight: 200,
              overflowY: "auto",
            }}
          >
            <List>
              {suggestions.map((suggestion, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton onClick={() => handleSelect(suggestion)}>
                    <ListItemText
                      primary={`${suggestion.item_name} (${suggestion.code})`}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
        <Button
          onClick={() => {
            if (isDealerInfoInvalid() === true ? false : true) {
              dispatch(setNewItemEntryModel(true));
            }
          }}
        >
          {" "}
          + New Item
        </Button>
      </Box>

      {/* Display Selected Item in Grid Layout */}
      {selectedItem && (
        <Paper
          elevation={0}
          sx={{
            mt: 1,
            p: 2,
            // backgroundColor: "#F8FAFC",
            borderRadius: "12px",
            height: "80%",
            // boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Typography
            variant="h6"
            // fontWeight={600}
            sx={{ mb: 2, color: "#333" }}
          >
            Stock Item Details
          </Typography>
          <Grid container spacing={1}>
            {[
              { label: "Item Name", value: selectedItem.item_name },
              { label: "Code", value: selectedItem.code },
              {
                label: "Available Stock Quantity",
                value: selectedItem.stock_qty,
              },
              { label: "UOM", value: selectedItem.uom },
              // { label: "Quantity", value: selectedItem.qty },
              {
                label: "Purchased Price",
                value: `₹${selectedItem.purchased_rate}`,
              },
              // { label: "Rate", value: `₹${selectedItem.rate}` },
              { label: "Selling Price", value: `₹${selectedItem.amount}` },

              { label: "Margin", value: `₹${selectedItem.margin}` },
            ].map(({ label, value }, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    p: 1.5,
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.05)",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "#4B5563", fontWeight: 500 }}
                  >
                    {label}
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    sx={{ color: "#22b378" }}
                  >
                    {value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {selectedItem && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{
              height: "20%",
              width: "100%",
              p: 2,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <TextField
              label="Enter Stock Upload Qty"
              type="number"
              variant="outlined"
              disabled={isDealerInfoInvalid()}
              value={uploadStock}
              onChange={(e) => setUplaodStock(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {selectedItem && selectedItem?.uom}
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2, width: "48.5%" }}
            />
            <TextField
              label="Total Purchased Price"
              type="number"
              variant="outlined"
              value={
                selectedItem.uom === "gram"
                  ? (uploadStock / 1000) * selectedItem.purchased_rate
                  : uploadStock * selectedItem.purchased_rate
              }
              InputProps={{
                endAdornment: <InputAdornment position="end">₹</InputAdornment>,
              }}
              // disabled
              sx={{ mb: 2, width: "48.5%" }}
            />
          </Box>
          <Button
            sx={{
              opacity: Number(uploadStock) > 0 ? "1" : ".5",
              pointerEvents: Number(uploadStock) > 0 ? "auto" : "none",
            }}
            onClick={() => {
              if (isDealerInfoInvalid() === true ? false : true) {
                handleUploadStockSubmit();
              }
            }}
          >
            Add Stock
          </Button>
        </LocalizationProvider>
      )}
    </Box>
  );
};

export default ItemsDailyEntry;
