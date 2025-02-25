import { Box, Button, TextField, Typography } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectBillValue,
  selectCurrentTabValue,
  setBillPriceDetails,
} from "../../pages/BillsPage/BillsSlice";

import { toast } from "react-toastify";
import { setCustomerSelectModal } from "../../pages/CustomersPage/CustomersSlice";

const BillingPrice = () => {
  const selectCurrentTab = useSelector(selectCurrentTabValue);
  const selectBill = useSelector(selectBillValue);
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState<string | null>(
    "Cash Paid"
  );
  const [discount, setDiscount] = useState<number>(0);
  const [subAmount, setSubAmount] = useState<number>(0);
  const [TotalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    const selectedBill =
      selectBill.find((data: any) => data.bill_number === selectCurrentTab) ||
      {};

    const updatedItems =
      selectedBill.items?.map((item: any, index: number) => ({
        ...item,
        no: index + 1, // Adding index starting from 1
      })) || [];

    const calculatedSubAmount = updatedItems.reduce(
      (total: number, item: any) => total + item.amount,
      0
    );
    setSubAmount(calculatedSubAmount);
    setTotalAmount(calculatedSubAmount - discount);
  }, [selectBill, selectCurrentTab, discount]);

  useEffect(() => {
    let payload: any = {
      sub_amount: subAmount,
      total_amount: TotalAmount,
      discount: discount,
      payment_method: paymentMethod,
      paid:
        paymentMethod === "Cash Paid" || paymentMethod === "UPI Paid"
          ? true
          : false,
      balance: 0,
    };
    dispatch(setBillPriceDetails(payload));
  }, [TotalAmount,paymentMethod]);

  const handleChange = (paymentType: string) => {
    setPaymentMethod((prev) => (prev === paymentType ? null : paymentType)); // Toggle selection
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
                  checked={paymentMethod === label}
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
            if (Number(TotalAmount) !== 0) {
              dispatch(setCustomerSelectModal(true));
            } else {
              toast.warning(`No items have been added to the bill`, {
                position: "bottom-left",
              });
            }
          }}
        >
          Bill
        </Button>
      </Box>
    </Box>
  );
};

export default BillingPrice;
