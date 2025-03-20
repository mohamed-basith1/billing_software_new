import { Box, Tabs, Tab } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentPaymentsTab,
  setCurrentPaymentsTab,
} from "./PaymentsSlice";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const PaymentsTabs = () => {
  const currentTab = useSelector(selectCurrentPaymentsTab);
  const dispatch = useDispatch();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    dispatch(setCurrentPaymentsTab(newValue));
  };
  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        height: "3rem",
        background: "white",
        border: ".1px solid lightgrey",
        borderRadius: "8px",
      }}
    >
      <Tabs
        value={currentTab}
        onChange={handleChange}
        aria-label="basic tabs example"
      >
  
        <Tab label="Cash Payments" {...a11yProps(0)} />
        <Tab label="UPI Payments" {...a11yProps(1)} />
        <Tab label="Credit Payments" {...a11yProps(2)} />
      </Tabs>
    </Box>
  );
};

export default PaymentsTabs;
