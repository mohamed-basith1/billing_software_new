import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectBillValue,
  selectCurrentTabValue,
  setBillPriceDetails,
  setClearBill,
} from "../../pages/BillsPage/BillsSlice";

import { toast } from "react-toastify";
import { setCustomerSelectModal } from "../../pages/CustomersPage/CustomersSlice";
import { useTheme } from "@emotion/react";
import { selectUserName } from "../../pages/LoginPage/LoginSlice";

const BillingPrice = () => {
  const selectCurrentTab = useSelector(selectCurrentTabValue);
  const selectBill = useSelector(selectBillValue);
  const userName = useSelector(selectUserName);
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState<string | null>(
    "Cash Paid"
  );
  const [discount, setDiscount] = useState<number>(0);
  const [subAmount, setSubAmount] = useState<number>(0);
  const [TotalAmount, setTotalAmount] = useState<number>(0);

  const theme: any = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  console.log("paymentMethod", paymentMethod);
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
  }, [TotalAmount, paymentMethod]);

  const handleChange = (paymentType: string) => {
    setPaymentMethod((prev) => (prev === paymentType ? null : paymentType)); // Toggle selection
  };
  const handleBillPrint = async () => {
    const selectedBill: any =
      selectBill.find((data: any) => data.bill_number === selectCurrentTab) ||
      {};

    let payload: any = {
      customer_name: selectedBill.customer_name,
      customer_id: selectedBill.customer_id,
      itemsList: selectedBill.items, // Embedding `ItemSchema`
      discount: selectedBill.discount,
      sub_amount: selectedBill.sub_amount,
      total_amount: selectedBill.total_amount,
      paid: selectedBill.paid,
      amount_paid: selectedBill.total_amount,
      payment_method: selectedBill.payment_method,
      balance: 0,
      billed_by: userName,
    };

    console.log("create bill payload", payload);
    //@ts-ignore
    let response = await window.electronAPI.createBill(payload);
    //
    if (
      selectedBill.payment_method !== "Credit Bill" &&
      selectedBill.payment_method !== "Self Use"
    ) {
      let TransactionPayload = {
        status: "Increased",
        bill_no: "None",
        customer: "None",
        employee: "",
        method: selectedBill.payment_method,
        reason: "Bill",
        amount: Number(selectedBill.total_amount),
        handler: userName,
        billtransactionhistory: true,
        password: "",
      };
      //@ts-ignore
      let response = await window.electronAPI.addTransactionHistory(
        TransactionPayload
      );
    }

    if (response.status !== 201) {
      toast.error(`${response.message}`, { position: "bottom-left" });
    } else {
      dispatch(setCustomerSelectModal(false));
      dispatch(setClearBill());
      toast.success(`${response.message}`, { position: "bottom-left" });
    }
  };
  return (
    <Box
      sx={{
        height: "auto",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ flex: 1 }}></Box>

      <Box
        sx={{
          width: isMobile ? "100%" : "35%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Typography>Sub Total</Typography>
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
                width: isMobile ? "40%" : "25%",
                display: "flex",
                gap: 1,
                alignItems: "center",
              }}
            >
              ₹
              <TextField
                variant="outlined"
                value={discount}
                onChange={(e: any) => setDiscount(e.target.value)}
                sx={{
                  width: "100%",
                  "& .MuiInputBase-root": {
                    height: "30px",
                    padding: "1px",
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "10px",
                    textAlign: "right",
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ bgcolor: "lightgray", height: ".5px", width: "100%" }}></Box>

        {/* Total Price */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography>Total</Typography>
          <Typography sx={{ fontSize: "1.2rem" }}>₹{TotalAmount}</Typography>
        </Box>

        <Box sx={{ bgcolor: "lightgray", height: ".5px", width: "100%" }}></Box>

        {/* Payment Methods */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, auto)",
            gap: 1,
          }}
        >
          {["Cash Paid", "UPI Paid", "Credit Bill", "Self Use"].map((label) => (
            <FormControlLabel
              key={label}
              control={
                <Checkbox
                  checked={paymentMethod === label}
                  onChange={() => handleChange(label)}
                  size="small"
                  sx={{
                    color: "#1E1E2D",
                    "&.Mui-checked": { color: "#1E1E2D" },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: "0.8rem" }}>{label}</Typography>
              }
              sx={{ marginRight: 0, padding: 0 }}
            />
          ))}
        </Box>

        <Button
          fullWidth
          variant="contained"
          sx={{
            bgcolor: "#1E1E2D",
            fontSize: isMobile ? "0.9rem" : "1rem",
            opacity: paymentMethod === null ? ".5" : "auto",
            pointerEvents: paymentMethod === null ? "none" : "auto",
          }}
          onClick={() => {
            if (Number(TotalAmount) !== 0) {
              if (paymentMethod === "Credit Bill") {
                dispatch(setCustomerSelectModal(true));
              } else {
                handleBillPrint();
              }
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
