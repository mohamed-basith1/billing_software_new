import { useSelector, useDispatch } from "react-redux";
import {
  setField,
  selectItems,
  setClearItems,
  setDateTigger,
  selectItemsEntryTab,
  setNewItemWithDealer,
} from "../../pages/ItemsPage/ItemsSlice"; // Adjust the import path
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
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

const ItemsNewEntry = () => {
  const dispatch = useDispatch();
  const ItemsEntryTab = useSelector(selectItemsEntryTab);
  const {
    itemName,
    itemUOM,
    itemPurchasedQuantity,
    perKgPurchasedPrice,
    marginPerUOM,
    sellingPricePerUOM,
    itemPurchasedPrice,
    expiryDate,
    itemCode,
    lowStockReminder,
  } = useSelector(selectItems);
  const handleChange = (field, value) => {
    dispatch(setField({ field, value }));

    if (field === "itemPurchasedQuantity" && perKgPurchasedPrice) {
      let calculatedPrice = Number(value) * Number(perKgPurchasedPrice) || 0;
      if (itemUOM === "gram") {
        calculatedPrice =
          (Number(value) / 1000) * Number(perKgPurchasedPrice) || 0;
      }
      dispatch(
        setField({
          field: "itemPurchasedPrice",
          value: Math.round(calculatedPrice),
        })
      );
    }

    if (field === "itemPurchasedPrice" && itemPurchasedQuantity) {
      let calculatedPerKgPrice =
        Number(value) / Number(itemPurchasedQuantity) || 0;
      if (itemUOM === "gram") {
        calculatedPerKgPrice =
          (Number(value) * 1000) / Number(itemPurchasedQuantity) || 0;
      }

      dispatch(
        setField({
          field: "perKgPurchasedPrice",
          value: Math.round(calculatedPerKgPrice),
        })
      );
      dispatch(
        setField({
          field: "sellingPricePerUOM",
          value: 0,
        })
      );

      // Update selling price only if it was calculated automatically before
      // if (
      //   marginPerUOM &&
      //   sellingPricePerUOM ===
      //     Number(perKgPurchasedPrice) + Number(marginPerUOM)
      // ) {
      //   dispatch(
      //     setField({
      //       field: "sellingPricePerUOM",
      //       value: Math.round(
      //         Number(calculatedPerKgPrice) + Number(marginPerUOM)
      //       ),
      //     })
      //   );
      // }
    }

    if (field === "perKgPurchasedPrice") {
      dispatch(
        setField({
          field: "sellingPricePerUOM",
          value: Math.round(Number(value) + Number(marginPerUOM || 0)),
        })
      );
    }

    if (field === "sellingPrice") {
     

      dispatch(
        setField({
          field: "sellingPricePerUOM",
          value: Math.round(Number(value)),
        })
      );

      // ✅ Update `marginPerUOM` when `sellingPricePerUOM` is manually changed
      if (perKgPurchasedPrice) {
        dispatch(
          setField({
            field: "marginPerUOM",
            value: Math.round(Number(value) - Number(perKgPurchasedPrice)),
          })
        );
      }
    }

    if (field === "marginPerUOM") {
      dispatch(
        setField({
          field: "sellingPricePerUOM",
          value: Math.round(Number(perKgPurchasedPrice || 0) + Number(value)),
        })
      );
    }
  };

  const validateForm = () => {
    const fieldsToCheck = [
      itemName,
      itemCode,
      itemUOM,
      itemPurchasedQuantity,
      itemPurchasedPrice,
      perKgPurchasedPrice,
      marginPerUOM,
      sellingPricePerUOM,
      // expiryDate,
      lowStockReminder,
    ];

    if (fieldsToCheck.some((field) => !String(field || "").trim())) {
      // toast.error("All fields must be filled!", { position: "bottom-left" });
      return false;
    }

    // ✅ Check if any numeric field is 0 or negative
    const numericFields = {
      "Purchased Quantity": itemPurchasedQuantity,
      "Purchased Price": itemPurchasedPrice,
      "Per Kg Purchased Price": perKgPurchasedPrice,
      "Margin Per UOM": marginPerUOM,
      "Selling Price Per UOM": sellingPricePerUOM,
      "Low Stock Reminder": lowStockReminder,
    };

    for (const [fieldName, value] of Object.entries(numericFields)) {
      const numValue = Number(value);
      if (numValue === 0) {
        toast.error(`${fieldName} cannot be zero!`, {
          position: "bottom-left",
        });
        return false;
      }
      if (numValue < 0) {
        // toast.error(`${fieldName} cannot be negative!`, {
        //   position: "bottom-left",
        // });
        return false;
      }
    }

    return true;
  };

  const handleCreateItem = async () => {
    const capitalizeFirstLetter = (str) =>
      str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    if (validateForm()) {
      let itemPayload = {
        item_name: capitalizeFirstLetter(itemName),
        code: itemCode,
        uom: itemUOM,
        qty: itemUOM === "gram" ? 1000 : 1,
        purchased_rate: Number(perKgPurchasedPrice),
        rate: Number(sellingPricePerUOM),
        amount: Number(sellingPricePerUOM),
        stock_qty: Number(itemPurchasedQuantity),
        margin: Number(marginPerUOM),
        low_stock_remainder: Number(lowStockReminder),
        unique_id: uuidv4(),
        item_expiry_date: expiryDate,
        total_purchased_amount:
          itemUOM === "gram"
            ? (Number(itemPurchasedQuantity) / 1000) *
              Number(perKgPurchasedPrice)
            : Number(itemPurchasedQuantity) * Number(perKgPurchasedPrice),
        new_stock: [
          {
            item_name: capitalizeFirstLetter(itemName),
            code: itemCode,
            amount: Number(sellingPricePerUOM),
            purchased_rate: Number(perKgPurchasedPrice),
            rate: Number(sellingPricePerUOM),
            uom: itemUOM,
            stock_qty: Number(itemPurchasedQuantity),
            item_expiry_date: expiryDate, // Keep expiry date
            createdAt: new Date().toISOString(),
          },
        ],
      };
      const sanitizedData = JSON.parse(JSON.stringify(itemPayload)); // Removes undefined & BigInt
     
      if (ItemsEntryTab === 0) {
        //@ts-ignore
        let response = await window.electronAPI.existItemValidate(
          sanitizedData
        );
        if (response.status === 200) {
          dispatch(setNewItemWithDealer(sanitizedData));
          dispatch(setClearItems());
        } else {
          toast.error(`${response.message}`, { position: "bottom-left" });
        }

        // updateItem
      } else {
        //@ts-ignore
        let response = await window.electronAPI.insertItem(sanitizedData);
        if (response.status !== 201) {
          toast.error(`${response.message}`, { position: "bottom-left" });
        } else {
          dispatch(setClearItems());
          dispatch(setDateTigger());
          toast.success(`${response.message}`, { position: "bottom-left" });
        }
      }
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
              onChange={(e) => handleChange("itemName", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Item Code"
              variant="outlined"
              value={itemCode}
              onChange={(e) => handleChange("itemCode", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="item-uom-label">Item UOM</InputLabel>
              <Select
                value={itemUOM}
                onChange={(e) => handleChange("itemUOM", e.target.value)}
                label="Item UOM"
              >
                {["Kg", "gram", "liter", "piece"].map((unit) => (
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
              label={`Per ${
                itemUOM === "gram" ? "1000 gram" : itemUOM || "Unit"
              } Purchased Price`}
              variant="outlined"
              type="number"
              value={perKgPurchasedPrice}
              disabled
              onChange={(e) =>
                handleChange("perKgPurchasedPrice", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={`Margin Per (${
                itemUOM === "gram" ? "1000 gram" : itemUOM || "Unit" || "Unit"
              })`}
              variant="outlined"
              type="number"
              disabled
              value={marginPerUOM}
              onChange={(e) => handleChange("marginPerUOM", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={`Selling Price Per (${
                itemUOM === "gram" ? "1000 gram" : itemUOM || "Unit" || "Unit"
              })`}
              variant="outlined"
              type="number"
              value={sellingPricePerUOM}
              onChange={(e) => handleChange("sellingPrice", e.target.value)}
              // disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Expiry Date"
                value={expiryDate ? dayjs(expiryDate) : null}
                onChange={handleExpiryDateChange}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider> */}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Item Low Stock Reminder"
              variant="outlined"
              type="number"
              value={lowStockReminder}
              onChange={(e) => handleChange("lowStockReminder", e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>
      <Button
        variant="contained"
        fullWidth
        sx={{
          pointerEvents: validateForm() === false ? "none" : "auto",
          opacity: validateForm() === false ? ".5" : "1",
          bgcolor: "#1E1E2D",
          mt: 2,
        }}
        onClick={handleCreateItem}
      >
        Create Item
      </Button>
    </Box>
  );
};

export default ItemsNewEntry;
