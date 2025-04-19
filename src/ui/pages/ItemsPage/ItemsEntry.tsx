import { Box, Button, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import customerImage from "../../assets/Image/Illustrate/customer.png";
import { getGreeting } from "../../utils/utils";
import WavingHandOutlinedIcon from "@mui/icons-material/WavingHandOutlined";

import ItemsEntryTab from "../../components/items/ItemsEntryTab";
import ItemEntryHistory from "../../components/items/ItemEntryHistory";
import { AnimatedCounter } from "../ReportPage/Dashboard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BalanceIcon from "@mui/icons-material/Balance";
import { useSelector } from "react-redux";
import { selectUserName } from "../LoginPage/LoginSlice";
import DealerInfoForm from "../../components/items/DealerInfoForm";
import { selectItemsEntryTab } from "./ItemsSlice";
import ItemsDailyEntry from "../../components/items/ItemsDailyEntry";
import NewItemEntryModel from "../../components/modals/NewItemEntryModel";
import ItemsNewEntry from "../../components/items/ItemsNewEntry";
const ItemsEntry = () => {
  const user = useSelector(selectUserName);
  const ItemsEntryTabCurrent = useSelector(selectItemsEntryTab);
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
          mt: 2,
          overflow: "hidden",
          // gap: "20px",
        }}
      >
        {/* item new/upload  */}
        <Box
          sx={{
            height: "100%",
            width: ItemsEntryTabCurrent === 0 ? "50%" : "100%",
            bgcolor: "white",
            p: 2,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxSizing: "border-box",
            gap: 2,
            transition: ".5s",
          }}
        >
          <Box>
            <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
              <Typography sx={{ fontSize: "1.3rem" }}>Hello,</Typography>
              <WavingHandOutlinedIcon
                sx={{ fontSize: "1.3rem", color: "green" }}
              />
              <Typography sx={{ fontSize: "1.3rem", fontWeight: 600 }}>
                {/* {getGreeting().charAt(0).toUpperCase() + getGreeting().slice(1)} */}
                {user.charAt(0).toUpperCase() + user.slice(1)}
              </Typography>
            </Box>
            <Typography>
              Your hard work keeps our store running strong.
            </Typography>
          </Box>

          <ItemsEntryTab />

          {ItemsEntryTabCurrent === 0 ? (
            <Box
              sx={{
                height: "calc(100% - 30px)",
                overflow: "scroll",

                pt: 1,
              }}
            >
              <DealerInfoForm />
              <ItemsDailyEntry />
            </Box>
          ) : (
            <ItemsNewEntry />
          )}
        </Box>

        {/* history */}
        <Box
          sx={{
            height: "100%",
            width: ItemsEntryTabCurrent === 0 ? "50%" : "0%",
            bgcolor: "white",
            // borderLeft: ".1px solid lightgrey",
            // borderRadius: "8px",
            p: ItemsEntryTabCurrent === 0 ? 2 : 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          {ItemsEntryTabCurrent === 0 && <ItemEntryHistory />}
        </Box>
      </Box>

      <NewItemEntryModel />
    </LocalizationProvider>
  );
};

export default ItemsEntry;
