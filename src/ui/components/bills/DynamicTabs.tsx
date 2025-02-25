import { Box, Typography, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentTabValue,
  decrementBillsTabs,
  setCurrentTab,
} from "../../pages/BillsPage/BillsSlice";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const DynamicTabs = ({ data }: { data: { bill_number: number } }) => {
  const dispatch = useDispatch();
  const currentTabValue = useSelector(selectCurrentTabValue);
  const isActive = data.bill_number === currentTabValue;

  const handleCloseTab = (e: React.MouseEvent, bill_number: any) => {
    e.stopPropagation(); // Prevents the event from bubbling up
    dispatch(decrementBillsTabs(bill_number));
  };

  return (
    <Box
      onClick={() => dispatch(setCurrentTab(data.bill_number))}
      sx={{
        background: isActive ? "rgba(30, 30, 45)" : "white",
        padding: "3px 25px",
        flexDirection: "row",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minWidth: "10rem",
        // borderBottom: isActive ? "1px solid rgba(34, 179, 120, 1)" : "",
        cursor: "pointer",
        height: "100%",
        borderRadius: "8px",
      }}
    >
      <Typography sx={{ color: isActive ? "white" : "lightgrey" }}>
        Bill No. {data.bill_number}
      </Typography>
      <IconButton
        color="inherit"
        sx={{
          padding: 0,
          color: isActive ? "white" : "lightgrey",
        }}
        onClick={(e) => handleCloseTab(e, data.bill_number)}
      >
        <CloseRoundedIcon sx={{ fontSize: "1.5rem" }} />
      </IconButton>
    </Box>
  );
};

export default DynamicTabs;
