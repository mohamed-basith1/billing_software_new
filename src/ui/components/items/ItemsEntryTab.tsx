import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ItemsNewEntry from "./ItemsNewEntry";
import ItemsDailyEntry from "./ItemsDailyEntry";
import { useDispatch, useSelector } from "react-redux";
import {
  selectItemsEntryTab,
  setItemsEntryTab,
} from "../../pages/ItemsPage/ItemsSlice";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ItemsEntryTab() {
  const ItemsEntryTab = useSelector(selectItemsEntryTab);
  const dispatch = useDispatch();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    dispatch(setItemsEntryTab(newValue));
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "calc(100%)",

        boxSizing: "border-box",
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider", height: "50px" }}>
        <Tabs
          value={ItemsEntryTab}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Item Entry" {...a11yProps(0)} />
          <Tab label="New Item" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <Box sx={{ height: "calc(100% - 50px)" }}>
        {ItemsEntryTab === 0 ? <ItemsDailyEntry /> : <ItemsNewEntry />}
      </Box>
    </Box>
  );
}
