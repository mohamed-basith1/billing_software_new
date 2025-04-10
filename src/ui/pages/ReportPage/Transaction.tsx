import { Box, Button, Tab, Tabs, TextField, Typography } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useEffect } from "react";
import PaymentMethodCharts from "../../components/Reports/PaymentMethodCharts";
import SalesGraph from "../../components/Reports/SalesGraph";
import TopCustomer from "../../components/Reports/TopCustomer";
import TopSellingProducts from "../../components/Reports/TopSellingProducts";
import { getGreeting, getDaysDifference } from "../../utils/utils";
import {
  selectDashboardData,
  selectReportsFromDate,
  selectReportsToDate,
  selectTransactionHistoryTab,
  setAddTransactionModal,
  setDashboardData,
  setReportsFromDate,
  setReportsToDate,
  setTransactionHistoryTab,
} from "./ReportsSlice";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { selectUserName } from "../LoginPage/LoginSlice";
import { AnimatedCounter } from "./Dashboard";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import AddCardOutlinedIcon from "@mui/icons-material/AddCardOutlined";
import {
  TrendingUp as ProfitIcon,
  ShoppingCart as OrdersIcon,
} from "@mui/icons-material";
import TransactionList from "../../components/Reports/TransactionList";
import { a11yProps } from "./ReportsTabs";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import LocalAtmOutlinedIcon from "@mui/icons-material/LocalAtmOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import AmountTaking from "../../components/Reports/AmountTaking";
import AddTransactionModal from "../../components/modals/AddTransactionModal";
const Transaction = () => {
  const dispatch = useDispatch();

  const dashboard = useSelector(selectDashboardData);

  const transactionHistoryTab = useSelector(selectTransactionHistoryTab);
  console.log("transactionHistoryTab", transactionHistoryTab);
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
      {/* Main Content Area */}

      <Box
        sx={{
          flex: 1,
          display: "flex",
          gap: 2,
          overflow: "hidden",
          flexDirection: "column",
        }}
      >
        {/* Left Column (70%) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
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
                name: "Amount Available",
                amount: dashboard?.totalRevenue ? dashboard?.totalRevenue : 0,
                icon: <AccountBalanceWalletOutlinedIcon fontSize="large" />, // UPI icon
                bgColor: "rgba(103, 58, 183, 0.2)", // Purple
                color: "#673ab7",
                description: "Total holding funds",
              },
              {
                name: "Total Outstanding",
                amount: dashboard?.totalProfit ? dashboard?.totalProfit : 0,
                icon: <AddCardOutlinedIcon fontSize="large" />,
                bgColor: "rgba(233, 30, 99, 0.2)", // Pink (Accent)
                color: "#e91e63",
                description: "Pending receivables",
              },
              {
                name: "UPI Balance",
                amount: dashboard?.totalProfit ? dashboard?.totalProfit : 0,
                icon: <QrCodeScannerOutlinedIcon fontSize="large" />,
                bgColor: "rgba(255, 152, 0, 0.2)",
                color: "#ff9800", // Full color
                description: "Digital payments",
              },
              {
                name: "Cash Balance",
                amount: dashboard?.totalProfit ? dashboard?.totalProfit : 0,
                icon: <CurrencyRupeeOutlinedIcon fontSize="large" />,
                bgColor: "rgba(34, 179, 120, 0.2)", // Green
                color: "#22b378",
                description: "Physical cash holdings",
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
                  {item.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Right Column (30%) */}
        <Box
          sx={{
            width: "100%",
            display: "flex",

            gap: 2,
            height: "100%",
          }}
        >
          {/* Chart Container */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              // gap: 2,
              overflow: "auto",
            }}
          >
            <Tabs
              value={transactionHistoryTab}
              onChange={(e,value) => dispatch(setTransactionHistoryTab(value))}
              aria-label="basic tabs example"
            >
              <Tab label="History" {...a11yProps(0)} />
              <Tab label="Salary" {...a11yProps(1)} />
              <Tab label="Others" {...a11yProps(2)} />

              <div
                style={{
                  marginLeft: "auto", // Pushes it to the right

                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Typography>Filter</Typography>
                <Button
                  sx={{ height: "1rem", p: 2 }}
                  onClick={() => dispatch(setAddTransactionModal(true))}
                >
                  Add Transaction
                </Button>
              </div>
            </Tabs>
            <Box
              sx={{
                borderRadius: 1,
                minHeight: "10rem",
                // mt: 2,
                fontWeight: 600,
              }}
            >
              {/* High Value Customers */}
              <TransactionList />
            </Box>
          </Box>

          {/* <AmountTaking /> */}
          <AddTransactionModal />
        </Box>
      </Box>
    </Box>
  );
};

export default Transaction;
