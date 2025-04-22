import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { useEffect } from "react";
import {
  selectTransactionHistoryTab,
  selectTransactionSummary,
  setAddTransactionModal,
  setEmployeeList,
  setTransactionHistoryTab,
  setTransactionSummary,
} from "./ReportsSlice";
import { useDispatch, useSelector } from "react-redux";
import { AnimatedCounter } from "./Dashboard";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import AddCardOutlinedIcon from "@mui/icons-material/AddCardOutlined";
import TransactionList from "../../components/Reports/TransactionList";
import { a11yProps } from "./ReportsTabs";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import AddTransactionModal from "../../components/modals/AddTransactionModal";
import CustomizedMenus from "../../components/Reports/TransactionFilter";
const Transaction = () => {
  const dispatch = useDispatch();

  const transactionHistoryTab = useSelector(selectTransactionHistoryTab);
  const transactionSummary = useSelector(selectTransactionSummary);

  useEffect(() => {
    const getTransactionSummaryHandler = async () => {
      //@ts-ignore
      let response = await window.electronAPI.getTransactionSummary();
      dispatch(setTransactionSummary(response.data));
    };

    const getEmployeeListHandler = async () => {
      //@ts-ignore
      let response = await window.electronAPI.getEmployee();

      console.log("response employee list", response);
      dispatch(setEmployeeList(response.data));
    };

    getTransactionSummaryHandler();
    getEmployeeListHandler();
  }, []);
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
        // overflow: "scroll",
      }}
    >
      {/* Main Content Area */}

      <Box
        sx={{
          flex: 1,
          display: "flex",
          // gap: 2,
          overflow: "hidden",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Top Column (30%) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
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
                amount: transactionSummary.amount_available,
                icon: <AccountBalanceWalletOutlinedIcon fontSize="large" />, // UPI icon
                bgColor: "rgba(103, 58, 183, 0.2)", // Purple
                color: "#673ab7",
                description: "Total holding funds",
              },
              {
                name: "Total Outstanding",
                amount: transactionSummary.total_outstanding,
                icon: <AddCardOutlinedIcon fontSize="large" />,
                bgColor: "rgba(233, 30, 99, 0.2)", // Pink (Accent)
                color: "#e91e63",
                description: "Pending receivables",
              },
              {
                name: "UPI Balance",
                amount: transactionSummary.upi_balance,
                icon: <QrCodeScannerOutlinedIcon fontSize="large" />,
                bgColor: "rgba(255, 152, 0, 0.2)",
                color: "#ff9800", // Full color
                description: "Digital payments",
              },
              {
                name: "Cash Balance",
                amount: transactionSummary.cash_balance,
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

        {/* Bottom Column (70%) */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flex: 1,
          }}
        >
          {/* Chart Container */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              mt: 1,
              justifyContent: "flex-start",
            }}
          >
            <Tabs
              value={transactionHistoryTab}
              onChange={(e, value) => dispatch(setTransactionHistoryTab(value))}
              aria-label="basic tabs example"
            >
              <Tab label="Transaction" {...a11yProps(0)} />
              <Tab label="Salary" {...a11yProps(1)} />

              <div
                style={{
                  marginLeft: "auto", // Pushes it to the right
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <CustomizedMenus />
                <Button
                  sx={{ height: "1rem", p: 2 }}
                  onClick={() => dispatch(setAddTransactionModal(true))}
                >
                  Add Transaction
                </Button>
              </div>
            </Tabs>

            {/* High Value Customers */}
            <TransactionList />
          </Box>
        </Box>
      </Box>
      <AddTransactionModal />
    </Box>
  );
};

export default Transaction;
