import { Box, Button, TextField, Typography } from "@mui/material";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import {
  selectCurrentTabValue,
  selectBillValue,
  setCustomerSelectModal,
} from "../../pages/BillsPage/BillsSlice";
import { generateInvoicePDF } from "./utils";
import NestedModal from "./CustomerModal";

const BillingPrice = () => {
  const selectCurrentTab = useSelector(selectCurrentTabValue);
  const selectBill = useSelector(selectBillValue);
  const dispatch = useDispatch();

  const [selected, setSelected] = React.useState<string | null>("Cash Paid");
  const [discount, setDiscount] = React.useState(0);

  const filteredBill =
    selectBill
      .find((data: any) => data.bill_number === selectCurrentTab)
      ?.items.map((item: any, index: number) => ({
        ...item,
        no: index + 1, // Adding index starting from 1
      })) || [];

  const subAmount = filteredBill.reduce(
    (total: any, item: any) => total + item.amount,
    0
  );
  const TotalAmount = subAmount - discount;

  console.log(
    "item List",
    filteredBill,
    "subAmount",
    subAmount,
    "TotalAmount",
    TotalAmount
  );

  const handleChange = (paymentType: string) => {
    setSelected((prev) => (prev === paymentType ? null : paymentType)); // Toggle selection
  };

  return (
    <Box
      sx={{
        height: "13rem",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Box></Box>
      <Box
        sx={{
          width: "35%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Typography>Sub Total</Typography>{" "}
            <Typography>₹{subAmount}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography>Discount</Typography>

            <Box
              sx={{
                width: "25%",
                height: "100%",
                display: "flex",
                gap: "5px",
                alignItems: "center",
              }}
            >
              ₹
              <TextField
                variant="outlined"
                value={discount}
                onChange={(e: any) => setDiscount(e.target.value)}
                sx={{
                  width: "100%", // Set width
                  "& .MuiInputBase-root": {
                    height: "30px", // Controls the input field height
                    padding: "1px", // Controls the padding inside input
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "10px", // Adjust text padding inside input
                    textAlign: "right",
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ bgcolor: "lightgray", height: ".5px", width: "100%" }}></Box>

        {/* Total price */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography>Total</Typography>{" "}
          <Typography sx={{ fontSize: "1.2rem" }}>₹{TotalAmount}</Typography>
        </Box>

        <Box sx={{ bgcolor: "lightgray", height: ".5px", width: "100%" }}></Box>
        {/* Paid By */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {["Cash Paid", "UPI Paid", "Credit Bill", "Self Use"].map((label) => (
            <FormControlLabel
              key={label}
              control={
                <Checkbox
                  checked={selected === label}
                  onChange={() => handleChange(label)}
                  size="small"
                  sx={{
                    color: "#1E1E2D", // Default color
                    "&.Mui-checked": { color: "#1E1E2D" }, // Checked state color
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: "0.8rem" }}>{label}</Typography>
              } // Small label
              sx={{ marginRight: 0, padding: 0 }} // Remove extra spacing
            />
          ))}
        </Box>

        <Button
          fullWidth
          variant="contained"
          sx={{ bgcolor: "#1E1E2D" }}
          onClick={() => {
            //generateInvoicePDF(filteredBill, subAmount, discount, TotalAmount);
            dispatch(setCustomerSelectModal(true));
          }}
        >
          Bill
        </Button>
      </Box>
   
    </Box>
  );
};

export default BillingPrice;
