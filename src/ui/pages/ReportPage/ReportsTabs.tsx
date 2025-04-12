import { Box, Tabs, Tab } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectCurrentReportsTab,
  setCurrentReportsTab,
  setReportsFromDate,
  setReportsToDate,
} from "./ReportsSlice";
import dayjs from "dayjs";

export function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const ReportsTabs = () => {
  const currentTab = useSelector(selectCurrentReportsTab);
  const dispatch = useDispatch();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    dispatch(setCurrentReportsTab(newValue));
  };

  useEffect(() => {
    dispatch(setReportsFromDate(dayjs().subtract(1, "month")));
    dispatch(setReportsToDate(dayjs()));
  }, []);
  return (
    <Box
      sx={{
        // borderBottom: 1,
        borderColor: "divider",
        height: "3rem",
        background: "white",
        // border: ".1px solid lightgrey",
        borderRadius: "8px",
      }}
    >
      <Tabs
        value={currentTab}
        onChange={handleChange}
        aria-label="basic tabs example"
      >
        <Tab label="Dashboard" {...a11yProps(0)} />
        <Tab label="Transaction" {...a11yProps(1)} />
      </Tabs>
    </Box>
  );
};

export default ReportsTabs;
