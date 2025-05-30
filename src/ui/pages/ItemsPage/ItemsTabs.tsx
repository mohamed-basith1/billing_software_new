import { Box, Tabs, Tab } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentTab, setCurrentTab } from "./ItemsSlice";

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
const ItemsTabs = () => {
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
        <Tab label="Items" {...a11yProps(0)} />

        <Tab label="Items Entry" {...a11yProps(1)} />
        <Tab label="Items Purchased History" {...a11yProps(2)} />
        <Tab label="Expired Item" {...a11yProps(3)} />
      </Tabs>
    </Box>
  );
};

export default ItemsTabs;
