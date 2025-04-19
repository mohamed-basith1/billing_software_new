import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  OutlinedInput,
  InputAdornment,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { style } from "./CustomerCreateModal";
import { useDispatch, useSelector } from "react-redux";
import {
  selectPayCreditBalance,
  selectPayCreditBalanceModal,
  selectSelectedBills,
  setPayCreditBalance,
  setPayCreditBalanceModal,
  setSelectedBills,
  setnewReturnBill,
} from "../../pages/PaymentsPage/PaymentsSlice";
import { toast } from "react-toastify";
import { selectUserName } from "../../pages/LoginPage/LoginSlice";

const PayCreditBillModal = () => {
  const dispatch = useDispatch();
  const payCreditBalance = useSelector(selectPayCreditBalance);
  const payCreditBalanceModal = useSelector(selectPayCreditBalanceModal);
  const selectedBill = useSelector(selectSelectedBills);
  const [paymentMethod, setPaymentMethod] = useState<string | null>("");
  const username = useSelector(selectUserName);
  useEffect(() => {
    return () => {
      setPaymentMethod("");
    };
  }, [payCreditBalanceModal]);
  const handlePayCreditBalance = async () => {
    console.log("handlePayCreditBalance", selectedBill);

    if (selectedBill.balance < payCreditBalance) {
      toast.warning(
        `Enter amount higher than balance amount ₹${selectedBill.balance}`,
        { position: "bottom-left" }
      );
      return;
    }

    let TransactionPayload = {
      status: "Increased",
      bill_no: selectedBill.bill_number,
      customer: "None",
      employee: "",
      method: paymentMethod,
      reason: `Customer paid the credit bill balance for ${selectedBill.bill_number}`,
      amount: Number(payCreditBalance),
      handler: username,
      billtransactionhistory: true,
      password: "",
    };
    //@ts-ignore
    await window.electronAPI.addTransactionHistory(TransactionPayload);
    //@ts-ignore
    let response = await window.electronAPI.payCreditBillBalance(
      selectedBill.bill_number,
      payCreditBalance
    );
    if (response.status !== 200) {
      toast.error(`${response.message}`, { position: "bottom-left" });
    } else {
      toast.success(`${response.message}`, { position: "bottom-left" });

      console.log("new response data", response.data);
      dispatch(setSelectedBills(response.data));
      dispatch(setnewReturnBill(response.data));
      dispatch(setPayCreditBalanceModal(false));
    }
  };
  return (
    <Modal
      open={payCreditBalanceModal}
      onClose={() => dispatch(setPayCreditBalanceModal(false))}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
          // backdropFilter: "blur(2px)", // Blur effect
        },
      }}
    >
      <Box
        sx={{
          ...style,
          width: { xs: "90%", sm: "60%", md: "40%", lg: "30%" }, // Adjust width based on screen size
          maxWidth: "500px", // Maximum width for large screens
          height: { xs: "auto", sm: "30%", md: "25%" }, // Adjust height dynamically
          minHeight: "200px", // Minimum height to avoid shrinking too much
          borderRadius: "8px",
          border: "0px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          p: 3, // Padding for better spacing
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          Pay Credit Balance
        </Typography>
        <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
          <OutlinedInput
            fullWidth
            placeholder="Enter Received Amount"
            type="number"
            value={payCreditBalance}
            onChange={(e) => dispatch(setPayCreditBalance(e.target.value))}
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start">₹</InputAdornment>}
            label="Amount"
          />
        </FormControl>

        <Box
          sx={{
            display: "flex",

            gap: 1,
            width: "100%",
          }}
        >
          {["Cash Paid", "UPI Paid"].map((label) => (
            <FormControlLabel
              key={label}
              control={
                <Checkbox
                  checked={paymentMethod === label}
                  onChange={() => setPaymentMethod(label)}
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
        <Box
          sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            onClick={() => handlePayCreditBalance()}
            sx={{
              px: 5,
              opacity:
                paymentMethod === "" || payCreditBalance <= 0 ? ".5" : "auto",
              pointerEvents:
                paymentMethod === "" || payCreditBalance <= 0 ? "none" : "auto",
            }}
          >
            Pay
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PayCreditBillModal;
