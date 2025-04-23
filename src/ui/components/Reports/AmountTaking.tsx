import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { a11yProps } from "../../pages/ReportPage/ReportsTabs";

const AmountTaking = () => {
  return (
    <Box
      sx={{
        width: "30%",
        display: "flex",
        flexDirection: "column",
        gap: 2,

        height: "100%",
        // borderLeft: ".1px solid lightgrey",
      }}
    >
      <Tabs value={0} onChange={() => {}} aria-label="basic tabs example">
        <Tab label="Add Amount" {...a11yProps(0)} />
        <Tab label="Take Amount" {...a11yProps(1)} />
      </Tabs>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 0 }}>
        <FormControl fullWidth>
          <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
          <OutlinedInput
            type="number"
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start">₹</InputAdornment>}
            label="Amount"
          />
        </FormControl>

        <TextField
          label="Reason for Adding Amount"
          multiline
          rows={8}
          fullWidth
          variant="outlined"
          placeholder="Enter your text here..."
        />
        <Button>Submit</Button>
      </Box>
    </Box>
  );
};

export default AmountTaking;
