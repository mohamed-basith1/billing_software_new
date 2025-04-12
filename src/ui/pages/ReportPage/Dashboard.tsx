import { Box, Button, TextField, Typography } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDashboardData,
  selectReportsFromDate,
  selectReportsToDate,
  setDashboardData,
  setReportsFromDate,
  setReportsToDate,
} from "./ReportsSlice";
import SalesGraph from "../../components/Reports/SalesGraph";
import WavingHandOutlinedIcon from "@mui/icons-material/WavingHandOutlined";
import PaymentMethodCharts from "../../components/Reports/PaymentMethodCharts";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";

import {
  TrendingUp as ProfitIcon,
  ShoppingCart as OrdersIcon,
} from "@mui/icons-material";
import { getDaysDifference, getGreeting } from "../../utils/utils";
import { selectUserName } from "../LoginPage/LoginSlice";
import TopSellingProducts from "../../components/Reports/TopSellingProducts";
import TopCustomer from "../../components/Reports/TopCustomer";
import dayjs from "dayjs";

export const AnimatedCounter = ({ value, isCurrency = false }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const duration = 500; // Animation duration in ms
  const startTime = useRef(null);
  const animationRef = useRef();

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const currentValue = Math.floor(progress * value);
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value]);

  const formattedValue = isCurrency
    ? `₹${displayValue.toLocaleString("en-IN")}`
    : displayValue.toLocaleString("en-IN");

  return (
    <Typography variant="h5" sx={{ fontWeight: 600 }}>
      {formattedValue}
    </Typography>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const fromDate = useSelector(selectReportsFromDate);
  const toDate = useSelector(selectReportsToDate);
  const user = useSelector(selectUserName);
  const dashboard = useSelector(selectDashboardData);
  useEffect(() => {
    const getDashboardHandler = async () => {
      let from: any = dayjs().subtract(1, "month");
      let to: any = dayjs();

      const fromDateFormat = from?.toISOString();
      const toDateFormat = to?.toISOString();

      //@ts-ignore
      let response: any = await window.electronAPI.getDashboardData(
        fromDateFormat,
        toDateFormat
      );

      dispatch(setDashboardData(response.data));
    };
    getDashboardHandler();
  }, []);

  const getDashboardData = async () => {
    if (!fromDate || !toDate) {
      console.warn("Date range not set yet");
      return;
    }

    const fromDateFormat = fromDate.toISOString();
    const toDateFormat = toDate.toISOString();

    try {
      // @ts-ignore
      const response: any = await window.electronAPI.getDashboardData(
        fromDateFormat,
        toDateFormat
      );
      console.log("response", response.data);
      dispatch(setDashboardData(response.data));
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        gap: 2,
        height: "calc(100% - 3.5rem)",
        width: "100%",
        background: "white",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        mt: 2,
        overflow: "scroll",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 1,
          height: { xs: "auto", md: "3.5rem" },
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
          <Typography>Let's grow your business</Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="From"
              value={fromDate}
              onChange={(newValue) => dispatch(setReportsFromDate(newValue))}
              renderInput={(params) => (
                <TextField {...params} fullWidth size="small" />
              )}
            />
          </LocalizationProvider>
          <Typography sx={{ fontSize: "2rem" }}>-</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="To"
              value={toDate}
              onChange={(newValue) => dispatch(setReportsToDate(newValue))}
              renderInput={(params) => (
                <TextField {...params} fullWidth size="small" />
              )}
            />
          </LocalizationProvider>

          <Button sx={{ px: 3 }} onClick={() => getDashboardData()}>
            Search
          </Button>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          gap: 2,
          overflow: "hidden",
        }}
      >
        {/* Left Column (70%) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "70%",
            height: "100%",
          }}
        >
          {/* Stats Row */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              minHeight: "8rem",
            }}
          >
            {[
              {
                name: "Total Revenue",
                amount: dashboard?.totalRevenue ? dashboard?.totalRevenue : 0,
                icon: <CurrencyRupeeOutlinedIcon fontSize="large" />,
                bgColor: "rgba(34, 179, 120, 0.2)", // Green
                color: "#22b378",
              },
              {
                name: "Total Profits",
                amount: dashboard?.totalProfit ? dashboard?.totalProfit : 0,
                icon: <ProfitIcon fontSize="large" />,
                bgColor: "rgba(66, 153, 225, 0.2)", // Blue
                color: "#4299e1",
              },
              {
                name: "Total Orders",
                amount: dashboard?.totalorder ? dashboard?.totalorder : 0,
                icon: <OrdersIcon fontSize="large" />,
                bgColor: "rgba(246, 173, 85, 0.2)", // Amber
                color: "#f6ad55",
              },
            ].map((item) => (
              <Box
                key={item.name}
                sx={{
                  flex: "1 1 200px",
                  bgcolor: item.bgColor,
                  p: 3,
                  borderRadius: 2,
                  minWidth: "200px",
                  height: "8rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  borderLeft: `4px solid ${item.color}`,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    justifyContent: "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: item.color,
                      color: "white",
                      p: 1,
                      borderRadius: "50%",
                      display: "flex",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      {item.name}
                    </Typography>
                    <AnimatedCounter
                      value={item.amount}
                      isCurrency={
                        item.name.includes("Revenue") ||
                        item.name.includes("Profit")
                      }
                    />
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {getDaysDifference(fromDate, toDate) === 1
                    ? "Last day"
                    : `Last ${getDaysDifference(fromDate, toDate)} days`}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Chart Container */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              overflow: "auto",
            }}
          >
            <Box
              sx={{
                // bgcolor: "success.light",
                borderRadius: 1,
                // p: 2,
                flex: "1 1 60%",
                minHeight: "300px",
              }}
            >
              Sales Graph
              <SalesGraph
                data={dashboard?.salegraphdata ? dashboard?.salegraphdata : []}
              />
            </Box>

            <Box
              sx={{
                borderRadius: 1,
                minHeight: "10rem",
                mt: 2,
                fontWeight: 600,
              }}
            >
              High Value Customers
              <TopCustomer
                topCustomer={
                  dashboard?.topcustomer ? dashboard?.topcustomer : []
                }
              />
            </Box>
          </Box>
        </Box>

        {/* Right Column (30%) */}
        <Box
          sx={{
            width: "30%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            height: "100%",
          }}
        >
          <Box
            sx={{
              // bgcolor: "pink",
              borderRadius: 1,
              // p: 2,
              flex: 1,
              overflow: "auto",
              // fontWeight: 600,
            }}
          >
            <Box sx={{ fontWeight: 600 }}> Payments Types</Box>

            <PaymentMethodCharts
              paymentSummary={
                dashboard?.paymentSummary ? dashboard?.paymentSummary : []
              }
            />
          </Box>

          <Box
            sx={{
              borderRadius: 1,

              flex: 1,
              overflow: "auto",
              fontWeight: 600,
            }}
          >
            Top Selling Products
            <TopSellingProducts
              topsellingproduct={
                dashboard?.topsellingproduct ? dashboard?.topsellingproduct : []
              }
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
