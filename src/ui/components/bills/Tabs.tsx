import { Box, Button, Typography } from "@mui/material";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectBillValue,
  addBillsTabs,
} from "../../pages/BillsPage/BillsSlice";
import DynamicTabs from "./DynamicTabs";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

const Tabs = () => {
  const billsValue = useSelector(selectBillValue);
  const dispatch = useDispatch();

  // Memoized function to prevent unnecessary re-renders
  const billsAddHandler = useCallback(() => {
    dispatch(addBillsTabs());
  }, [dispatch]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "d") {
        event.preventDefault();
        billsAddHandler();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [billsAddHandler]);

  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        height: "3rem",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          gap: 1.25,
          overflowX: "auto",
          height: "100%",
          width: "calc(100% - 9rem)",
        }}
      >
        {billsValue.map((data: any, index: number) => (
          <DynamicTabs key={index} data={data} />
        ))}
      </Box>
      <Button
        onClick={billsAddHandler}
        sx={{
          background: "#22b378",
          width: "8rem",
          borderRadius: "0px 8px 8px 0px",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography>Bill</Typography>
        <AddRoundedIcon />
      </Button>
    </Box>
  );
};

export default Tabs;
