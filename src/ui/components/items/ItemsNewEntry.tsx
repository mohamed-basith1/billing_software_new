import { useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "react-toastify";

const ItemsNewEntry = () => {
  const [itemName, setItemName] = useState("");
  const [itemUOM, setItemUOM] = useState("");
  const [itemPurchasedQuantity, setItemPurchasedQuantity] = useState("");
  const [perKgPurchasedPrice, setPerKgPurchasedPrice] = useState("");
  const [marginPerUOM, setMarginPerUOM] = useState("");
  const [sellingPricePerUOM, setSellingPricePerUOM] = useState("");
  const [itemPurchasedPrice, setItemPurchasedPrice] = useState("");
  const [expiryDate, setExpiryDate] = useState(null);
  const [itemCode, setItemCode] = useState("");
  const [lowStockReminder, setLowStockReminder] = useState("");

  const handleChange = (field, value) => {
    if (field === "itemPurchasedQuantity") {
      setItemPurchasedQuantity(value);
      if (value && perKgPurchasedPrice) {
        setItemPurchasedPrice((value * perKgPurchasedPrice).toFixed(2));
      }
    } else if (field === "itemPurchasedPrice") {
      setItemPurchasedPrice(value);
      if (value && itemPurchasedQuantity) {
        setPerKgPurchasedPrice((value / itemPurchasedQuantity).toFixed(2));
      }
    } else if (field === "perKgPurchasedPrice") {
      setPerKgPurchasedPrice(value);
      setSellingPricePerUOM(
        (parseFloat(value || 0) + parseFloat(marginPerUOM || 0)).toFixed(2)
      );
    } else if (field === "marginPerUOM") {
      setMarginPerUOM(value);
      setSellingPricePerUOM(
        (parseFloat(perKgPurchasedPrice || 0) + parseFloat(value || 0)).toFixed(
          2
        )
      );
    }
  };

  const validateForm = () => {
    if (
      !itemName.trim() ||
      !itemCode.trim() ||
      !itemUOM.trim() ||
      !itemPurchasedQuantity.trim() ||
      !itemPurchasedPrice.trim() ||
      !perKgPurchasedPrice.trim() ||
      !marginPerUOM.trim() ||
      !sellingPricePerUOM.trim() ||
      !expiryDate ||
      !lowStockReminder.trim()
    ) {
      toast.error("All fields must be filled!");
      return false;
    }
    return true;
  };

  const handleCreateItem = () => {
    if (validateForm()) {
      let itemPayload = {
        item_name: itemName,
        code: itemCode,
        uom: itemUOM,
        qty: 1,
        purchased_rate: Number(perKgPurchasedPrice),
        rate: Number(sellingPricePerUOM),
        amount: Number(sellingPricePerUOM),
        stock_qty: Number(itemPurchasedQuantity),
        margin: Number(marginPerUOM),
        low_stock_remainder: Number(lowStockReminder),
        item_expiry_date: expiryDate,
      };


      toast.success("Item Created Successfully!");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        pt: 6,
      }}
    >
      <Box sx={{ height: "90%", display: "flex" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Item Name"
              variant="outlined"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Item Code"
              variant="outlined"
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Item UOM</InputLabel>
              <Select
                value={itemUOM}
                onChange={(e) => setItemUOM(e.target.value)}
              >
                {["Kg", "Gram", "Liter", "Piece"].map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={`Item Purchased Quantity (${itemUOM || "Unit"})`}
              variant="outlined"
              type="number"
              value={itemPurchasedQuantity}
              onChange={(e) =>
                handleChange("itemPurchasedQuantity", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Item Purchased Price"
              variant="outlined"
              type="number"
              value={itemPurchasedPrice}
              onChange={(e) =>
                handleChange("itemPurchasedPrice", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={`Per ${itemUOM || "Unit"} Purchased Price`}
              variant="outlined"
              type="number"
              value={perKgPurchasedPrice}
              onChange={(e) =>
                handleChange("perKgPurchasedPrice", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={`Margin Per (${itemUOM || "Unit"})`}
              variant="outlined"
              type="number"
              value={marginPerUOM}
              onChange={(e) => handleChange("marginPerUOM", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={`Selling Price Per (${itemUOM || "Unit"})`}
              variant="outlined"
              type="number"
              value={sellingPricePerUOM}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Expiry Date"
                value={expiryDate}
                onChange={(newValue) => setExpiryDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Item Low Stock Reminder"
              variant="outlined"
              type="number"
              value={lowStockReminder}
              onChange={(e) => setLowStockReminder(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>
      <Button
        variant="contained"
        fullWidth
        sx={{ bgcolor: "#1E1E2D", mt: 2 }}
        onClick={handleCreateItem}
      >
        Create Item
      </Button>
    </Box>
  );
};

export default ItemsNewEntry;
