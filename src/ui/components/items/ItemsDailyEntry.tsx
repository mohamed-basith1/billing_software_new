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
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useDispatch, useSelector } from "react-redux";
import {
  selectItemSearch,
  setItemsearch,
} from "../../pages/ItemsPage/ItemsSlice";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const itemsList = [
  {
    item_name: "Basmati Rice",
    code: "001",
    uom: "Kg",
    qty: 1,
    purchased_rate: 125,
    rate: 175,
    amount: 175,
    stock_qty: 20,
    margin: 50,
    low_stock_remainder: 5,
    item_expiry_date: "2025-03-28T18:30:00.000Z",
  },
  {
    item_name: "Horlicks (500g)",
    code: "002",
    uom: "piece",
    qty: 1,
    purchased_rate: 500,
    rate: 520,
    amount: 520,
    stock_qty: 10,
    margin: 20,
    low_stock_remainder: 5,
    item_expiry_date: "2025-03-26T18:30:00.000Z",
  },
  {
    item_name: "Cashew",
    code: "003",
    uom: "gram",
    qty: 1000,
    purchased_rate: 1500,
    rate: 1800,
    amount: 1800,
    stock_qty: 2000,
    margin: 300,
    low_stock_remainder: 500,
    item_expiry_date: "2025-03-27T18:30:00.000Z",
  },
  {
    item_name: "Oil",
    code: "004",
    uom: "liter",
    qty: 1,
    purchased_rate: 180,
    rate: 200,
    amount: 200,
    stock_qty: 50,
    margin: 20,
    low_stock_remainder: 10,
    item_expiry_date: "2025-03-28T18:30:00.000Z",
  },
];

const ItemsDailyEntry = () => {
  const itemsearch = useSelector(selectItemSearch);
  const itemSearchRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const [suggestions, setSuggestions] = useState<typeof itemsList>([]);
  const [selectedFlag, setSelectFlag] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [number, setNumber] = useState("");
  useEffect(() => {
    itemSearchRef.current?.focus();
    if (itemsearch === "") {
      setSuggestions([]);
    } else {
      const getSuggestionsHandle = async () => {
        const sanitizedData = JSON.parse(JSON.stringify(itemsearch));

        //@ts-ignore
        const results = await window.electronAPI.searchItem(sanitizedData);
        setSuggestions(results);
        console.log("suggestion data", results);
      };

      if (selectedFlag === false) getSuggestionsHandle();
    }
  }, [itemsearch]);

  const handleSelect = (item: any) => {
    dispatch(setItemsearch(item.item_name)); // Update search first
    setSelectFlag(true);
    setTimeout(() => {
      setSuggestions([]);
    }, 0); // Clear suggestions in next tick
    setTimeout(() => {
      setSelectFlag(false);
    }, 10);
    setSelectedItem(item);
  };
// console.log("selected Item",selectedItem);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        pt: 2,
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      {/* Search Bar with relative positioning for absolute dropdown */}
      <Box sx={{ position: "relative", width: "100%" }}>
        <TextField
          placeholder="Item Name or Code"
          variant="outlined"
          sx={{
            width: "100%",
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
          onChange={(e) => dispatch(setItemsearch(e.target.value))}
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
              width: "100%",
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
          <Grid container spacing={2}>
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
              height: "35%",
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
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {selectedItem && selectedItem?.uom}
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2, width: "48.5%" }}
            />
            <DatePicker
              label="Select Expiry Date"
              sx={{ width: "48.5%" }}
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Box>
        </LocalizationProvider>
      )}
    </Box>
  );
};

export default ItemsDailyEntry;
