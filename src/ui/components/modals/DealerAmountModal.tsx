import {
  Modal,
  Box,
  Typography, Button,
  OutlinedInput,
  InputAdornment,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import { useState } from "react";
import { style } from "./CustomerCreateModal";
import { useDispatch, useSelector } from "react-redux";
import {
  selectPayCreditBalance, selectSelectedBills
} from "../../pages/PaymentsPage/PaymentsSlice";
import { toast } from "react-toastify";
import {
  selectDealerHistoryselected,
  selectPayDealerAmountModel,
  setDealerHistorySummary,
  setPayDealerAmountModel,
  setUpdateDealerBill,
} from "../../pages/ItemsPage/ItemsSlice";
import { selectUserName } from "../../pages/LoginPage/LoginSlice";

const DealerAmountModal = () => {
  const dispatch = useDispatch();
  const dealerAmountModel = useSelector(selectPayDealerAmountModel);
  const dealerHistoryselected = useSelector(selectDealerHistoryselected);
  const username = useSelector(selectUserName);
  const [paymentMethod, setPaymentMethod] = useState<string | null>("");
  const [amount, setAmount] = useState<number>(0);

  const handlePayBalance = async () => {
    if (
      dealerHistoryselected.dealerPurchasedPrice -
        dealerHistoryselected.givenAmount <
      Number(amount)
    ) {
      toast.warning(
        `Enter amount higher than balance amount ₹${
          dealerHistoryselected.dealerPurchasedPrice -
          dealerHistoryselected.givenAmount
        }`,
        { position: "bottom-left" }
      );
      return;
    }
    let validatorPayload = {
      amount,
      method: paymentMethod,
    };
    //@ts-ignore
    let amountAvalaible = await window.electronAPI.amountValidator(
      validatorPayload
    );
    if (amountAvalaible.status === 200) {
      let payload = {
        paymentMethod,
        amount,
        id: dealerHistoryselected._id,
      };
      //@ts-ignore
      let response = await window.electronAPI.addDealerBillHistory(payload);
      if (response.status !== 200) {
        toast.error(`${response.message}`, { position: "bottom-left" });
      } else {
        let TransactionPayload = {
          status: "Decreased",
          bill_no: "None",
          customer: `Dealer ${dealerHistoryselected.dealerName}`,
          employee: "None",
          method: paymentMethod,
          reason: `Amount transfer to dealer ${dealerHistoryselected.dealerName}`,
          amount: Number(amount),
          handler: username,
          billtransactionhistory: true,
          password: "",
        };



        //@ts-ignore
        await window.electronAPI.addTransactionHistory(TransactionPayload);
        toast.success(`${response.message}`, { position: "bottom-left" });
        setAmount(0);
        setPaymentMethod("");

        dispatch(setPayDealerAmountModel(false));
        dispatch(setUpdateDealerBill(response.data));
        const getDealerBillSummaryHandler = async () => {
          //@ts-ignore
          let response = await window.electronAPI.getDealerBillSummary();

          dispatch(setDealerHistorySummary(response.data));
        };
        getDealerBillSummaryHandler();
      }
    } else {
      toast.error(`${amountAvalaible.message}`, { position: "bottom-left" });
    }
  };
  return (
    <Modal
      open={dealerAmountModel}
      onClose={() => dispatch(setPayDealerAmountModel(false))}
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
          Pay Balance Amount
        </Typography>
        <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
          <OutlinedInput
            fullWidth
            placeholder="Enter Received Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
            onClick={() => handlePayBalance()}
            sx={{
              px: 5,
              opacity: paymentMethod === "" || amount <= 0 ? ".5" : "auto",
              pointerEvents:
                paymentMethod === "" || amount <= 0 ? "none" : "auto",
            }}
          >
            Pay
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DealerAmountModal;
