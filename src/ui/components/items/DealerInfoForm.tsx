import { Grid, TextField, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

import React from "react";
import {
  selectItems,
  setDealerDetails,
} from "../../pages/ItemsPage/ItemsSlice";

export default function DealerInfoForm() {
  const dealerDetails = useSelector(selectItems);
  const dispatch = useDispatch();

  const handleChange = (field, value) => {
    dispatch(setDealerDetails({ field, value }));
  };

  const purchased = parseFloat(dealerDetails.dealerPurchasedPrice) || 0;
  const upi = parseFloat(dealerDetails.dealerGivenUPIAmount) || 0;
  const cash = parseFloat(dealerDetails.dealerGivenCashAmount) || 0;

  const totalPaid = upi + cash;
  const isOverpaid = totalPaid > purchased;

  return (
    <Grid container spacing={2}>
      {/* Dealer Name */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Dealer Name"
          fullWidth
          value={dealerDetails.dealerName}
          onChange={(e) => handleChange("dealerName", e.target.value)}
        />
      </Grid>

      {/* Purchased Price */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Purchased Price"
          type="number"
          fullWidth
          value={dealerDetails.dealerPurchasedPrice}
          onChange={(e) => handleChange("dealerPurchasedPrice", e.target.value)}
        />
      </Grid>

      {/* Given UPI Amount */}
      {/* <Grid item xs={12} sm={6}>
        <TextField
          label="Given UPI Amount"
          type="number"
          fullWidth
          error={isOverpaid}
          helperText={isOverpaid ? "Total exceeds purchased price" : ""}
          value={dealerDetails.dealerGivenUPIAmount}
          onChange={(e) => handleChange("dealerGivenUPIAmount", e.target.value)}
        />
      </Grid> */}

      {/* Given Cash Amount */}
      {/* <Grid item xs={12} sm={6}>
        <TextField
          label="Given Cash Amount"
          type="number"
          fullWidth
          error={isOverpaid}
          helperText={isOverpaid ? "Total exceeds purchased price" : ""}
          value={dealerDetails.dealerGivenCashAmount}
          onChange={(e) =>
            handleChange("dealerGivenCashAmount", e.target.value)
          }
        />
      </Grid> */}

      {/* Optional: Show remaining or overpaid amount */}
      {/* <Grid item xs={12}>
        <Typography
          variant="body2"
          color={isOverpaid ? "error" : "textSecondary"}
        >
          {isOverpaid
            ? `Overpaid by ₹${(totalPaid - purchased).toFixed(2)}`
            : `Remaining: ₹${(purchased - totalPaid).toFixed(2)}`}
        </Typography>
      </Grid> */}
    </Grid>
  );
}
