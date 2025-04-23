import { Box, Tabs, Tab } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentTab, setCurrentTab } from "./CustomersSlice";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}


function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const CustomersTabs = () => {
  const currentTab = useSelector(selectCurrentTab);
  const dispatch = useDispatch();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    dispatch(setCurrentTab(newValue));
  };
  return (
    <Box
      sx={{
       
        borderColor: "divider",
        height: "3rem",
        background: "white",
       
        borderRadius: "8px",
      }}
    >
      <Tabs
        value={currentTab}
        onChange={handleChange}
        aria-label="basic tabs example"
      >
        <Tab label="Customers" {...a11yProps(0)} />
        <Tab label="Create Customer" {...a11yProps(1)} />
      </Tabs>
    </Box>
  );
};

export default CustomersTabs;
