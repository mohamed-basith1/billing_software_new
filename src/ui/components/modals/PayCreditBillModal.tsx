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
} from "@mui/material";
import React from "react";
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

const PayCreditBillModal = () => {
  const dispatch = useDispatch();
  const payCreditBalance = useSelector(selectPayCreditBalance);
  const payCreditBalanceModal = useSelector(selectPayCreditBalanceModal);
  const selectedBill = useSelector(selectSelectedBills);

  const handlePayCreditBalance = async () => {
    console.log("handlePayCreditBalance", selectedBill);

    if (selectedBill.balance < payCreditBalance) {
      toast.warning(
        `Enter amount higher than balance amount ₹${selectedBill.balance}`,
        { position: "bottom-left" }
      );
      return;
    }

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
    //payCreditBillBalance
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

        {/* <TextField
          fullWidth
          placeholder="Enter Received Amount"
          type="number"
          value={payCreditBalance}
          onChange={(e) => dispatch(setPayCreditBalance(e.target.value))}
        ></TextField> */}
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
          sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            onClick={() => handlePayCreditBalance()}
            sx={{
              px: 5,
              opacity: payCreditBalance <= 0 ? ".5" : "auto",
              pointerEvents: payCreditBalance <= 0 ? "none" : "auto",
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
