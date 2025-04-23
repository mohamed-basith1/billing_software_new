import { Grid, TextField } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

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
    </Grid>
  );
}
