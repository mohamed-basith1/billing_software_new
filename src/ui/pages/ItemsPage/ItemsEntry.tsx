import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "react-toastify";
import customerImage from "../../assets/Image/Illustrate/customer.png";
import dayjs from "dayjs";

const ItemsEntry = () => {
  const [itemName, setItemName] = useState("");
  const [itemUOM, setItemUOM] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [expiryDate, setExpiryDate] = useState(null);
  const [itemCode, setItemCode] = useState("");
  const [error, setError] = useState({
    itemName: false,
    itemQuantity: false,
    itemUOM: false,
    expiryDate: false,
    itemCode: false,
    totalPrice: false,
  });

  const handleChange = (field, value) => {
    setError((prev) => ({ ...prev, [field]: false }));
    const sanitizedValue = value.replace(/\D/g, ""); // Allow only numbers

    if (field === "itemQuantity") {
      setItemQuantity(sanitizedValue);
      if (sanitizedValue && totalPrice) {
        setItemPrice((totalPrice / sanitizedValue).toFixed(2));
      }
    } else if (field === "totalPrice") {
      setTotalPrice(sanitizedValue);
      if (sanitizedValue && itemQuantity) {
        setItemPrice((sanitizedValue / itemQuantity).toFixed(2));
      }
    } else if (field === "itemPrice") {
      setItemPrice(sanitizedValue);
      if (sanitizedValue && itemQuantity) {
        setTotalPrice((sanitizedValue * itemQuantity).toFixed(2));
      }
    }
  };

  const handleSubmit = () => {
    const newError = {
      itemName: !itemName.trim(),
      itemCode: !itemCode.trim(),
      itemUOM: !itemUOM,
      itemQuantity: !itemQuantity,
      totalPrice: !totalPrice,
      expiryDate: !expiryDate,
    };

    setError(newError);
    if (Object.values(newError).some((err) => err)) return;

    toast.success("Item Created Successfully!", { position: "bottom-left" });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          height: "calc(100% - 3.5rem)",
          width: "100%",
          background: "white",
          border: ".1px solid lightgrey",
          borderRadius: "8px",
          p: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          mt: 3,
          overflow: "hidden",
        }}
      >
        <Box sx={{ width: "100%", height: "3rem" }}>
          <Typography sx={{ fontSize: "2rem", fontWeight: 400, color: "#1E1E2D" }}>
            Create Item
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, height: "100%" }}>
          <Box sx={{ flexBasis: "50%", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-evenly", mt: { xs: 2, md: 5 } }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Item Name"
                  variant="outlined"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  error={error.itemName}
                  helperText={error.itemName ? "Required" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Item Code"
                  variant="outlined"
                  value={itemCode}
                  onChange={(e) => setItemCode(e.target.value)}
                  error={error.itemCode}
                  helperText={error.itemCode ? "Required" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={error.itemUOM}>
                  <InputLabel>Item UOM</InputLabel>
                  <Select value={itemUOM} onChange={(e) => setItemUOM(e.target.value)}>
                    {["Kg", "Gram", "Liter", "Piece"].map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </Select>
                  {error.itemUOM && <Typography color="error">Required</Typography>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={`Item Quantity (${itemUOM || "Unit"})`}
                  variant="outlined"
                  type="number"
                  value={itemQuantity}
                  onChange={(e) => handleChange("itemQuantity", e.target.value)}
                  error={error.itemQuantity}
                  helperText={error.itemQuantity ? "Required" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Total Price"
                  variant="outlined"
                  type="number"
                  value={totalPrice}
                  onChange={(e) => handleChange("totalPrice", e.target.value)}
                  error={error.totalPrice}
                  helperText={error.totalPrice ? "Required" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={`Per ${itemUOM || "Unit"} Price`}
                  variant="outlined"
                  type="number"
                  value={itemPrice}
                  onChange={(e) => handleChange("itemPrice", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Expiry Date"
                  value={expiryDate}
                  onChange={(newValue) => setExpiryDate(newValue)}
                  slotProps={{ textField: { fullWidth: true, error: error.expiryDate, helperText: error.expiryDate ? "Required" : "" } }}
                />
              </Grid>
            </Grid>
            <Button variant="contained" fullWidth sx={{ bgcolor: "#1E1E2D", mt: 2 }} onClick={handleSubmit}>
              Create Item
            </Button>
          </Box>
          <Box sx={{ flexBasis: "50%", flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={customerImage} alt="Customer" style={{ maxHeight: "60%", maxWidth: "100%", objectFit: "contain" }} />
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default ItemsEntry;
