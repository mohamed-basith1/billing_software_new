import { Box, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import customerImage from "../../assets/Image/Illustrate/customer.png";
import { getGreeting } from "../../utils/utils";
import WavingHandRoundedIcon from "@mui/icons-material/WavingHandRounded";

import ItemsEntryTab from "../../components/items/ItemsEntryTab";

const ItemsEntry = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          height: "calc(100% - 3.5rem)",
          width: "100%",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          mt: 3,
          overflow: "hidden",
          gap: "20px",
        }}
      >
        {/* item new/upload  */}
        <Box
          sx={{
            height: "100%",
            width: "50%",
            bgcolor: "white",
            border: ".1px solid lightgrey",
            borderRadius: "8px",
            p: 2,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.3rem",
              fontWeight: 400,
              color: "#1E1E2D",
              my: 2,
              display: "flex",
              alignItems: "center",
              gap: "3px",
              height: "30px",
            }}
          >
            {getGreeting()}
            <span style={{ color: "#22b378" }}>Admin</span>{" "}
            <WavingHandRoundedIcon sx={{ ml: 1, color: "#1E1E2D" }} />
          </Typography>

          <Box sx={{ height: "calc(100% - 30px)" }}>
            <ItemsEntryTab />
          </Box>
        </Box>

        {/* today data item entry  */}
        <Box
          sx={{
            flexBasis: "50%",
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "white",
          }}
        >
          <img
            src={customerImage}
            alt="Customer"
            style={{
              maxHeight: "60%",
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default ItemsEntry;
