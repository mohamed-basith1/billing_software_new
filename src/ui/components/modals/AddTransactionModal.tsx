import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { a11yProps } from "../../pages/ReportPage/ReportsTabs";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAddTransactionModal,
  selectEmployeeList,
  selectSubmitLoader,
  selectTransactionAmountTakeTab,
  selectTransactionData,
  selectTransactionSummary,
  setAddTransactionModal,
  setSubmitLoader,
  setTransactionAmountTakeTab,
  setTransactionData,
  setTransactionSummary,
} from "../../pages/ReportPage/ReportsSlice";
import { Padding } from "@mui/icons-material";
import { selectUserName } from "../../pages/LoginPage/LoginSlice";
import { toast } from "react-toastify";
export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  bgcolor: "background.paper",

  pt: 2,
  px: 4,
  pb: 3,
};

const StyledTab = styled(Tab)(({ theme }) => ({
  borderRadius: "8px",
  marginRight: theme.spacing(0.5),

  "&.Mui-selected": {
    backgroundColor: "#1E1E2D",
    color: theme.palette.primary.contrastText,
  },
  transition: "all 0.3s ease",
}));
const AddTransactionModal = () => {
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [insideTab, setInsideTab] = useState(0);
  const [methodTab, setMethodTab] = useState(0);
  const [error, setError] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const transactionModal = useSelector(selectAddTransactionModal);
  const transactionAmountTakeTab = useSelector(selectTransactionAmountTakeTab);
  const username = useSelector(selectUserName);
  const loader = useSelector(selectSubmitLoader);
  const transactionHistoryList = useSelector(selectTransactionData);
  const transactionSummary = useSelector(selectTransactionSummary);

  const employeeList = useSelector(selectEmployeeList);
  const dispatch = useDispatch();

  useEffect(() => {
    clearState();
    return () => {
      clearState();
    };
  }, [transactionAmountTakeTab, methodTab]);

  const maxUPIAmount = Number(transactionSummary.upi_balance);
  const maxCashAmount = Number(transactionSummary.cash_balance);

  const isFormValid = () => {
    if (transactionAmountTakeTab === 0) {
      return amount !== 0 && reason.trim() !== "" && password.trim() !== "";
    }

    if (transactionAmountTakeTab === 1 && insideTab === 0) {
      return (
        amount !== 0 &&
        selectedEmployee.trim() !== "" &&
        password.trim() !== "" &&
        error === ""
      );
    }
    if (transactionAmountTakeTab === 1 && insideTab === 1) {
      return (
        amount !== 0 &&
        reason.trim() !== "" &&
        password.trim() !== "" &&
        error === ""
      );
    }
  };

  const clearState = () => {
    setAmount(0);
    setReason("");
    setPassword("");
    setSelectedEmployee("");
    setError("");
  };

  const submitHandler = async () => {
    dispatch(setSubmitLoader(true));
    let TransactionPayload = {
      status: transactionAmountTakeTab === 0 ? "Increased" : "Decreased",
      bill_no: "None",
      customer: "None",
      employee: selectedEmployee,
      method: methodTab === 0 ? "Cash Paid" : "UPI Paid",
      reason:
        transactionAmountTakeTab === 0
          ? reason
          : insideTab === 0
          ? "Salary"
          : reason,
      amount: Number(amount),
      handler: username,
      password,
      billtransactionhistory:false
    };
    //@ts-ignore
    let response = await window.electronAPI.addTransactionHistory(
      TransactionPayload
    );
    if (response.status !== 201) {
      dispatch(setSubmitLoader(false));
      toast.error(`${response.message}`, { position: "bottom-left" });
    } else {
      toast.success(`${response.message}`, { position: "bottom-left" });
      let finallist = [...response.data, ...transactionHistoryList];

      console.log("finallist", finallist);
      dispatch(
        setTransactionData([...response.data, ...transactionHistoryList])
      );

      const getTransactionSummaryHandler = async () => {
        //@ts-ignore
        let response = await window.electronAPI.getTransactionSummary();
        dispatch(setTransactionSummary(response.data));
      };
      getTransactionSummaryHandler();
      dispatch(setAddTransactionModal(false));
      dispatch(setSubmitLoader(false));

      clearState();
    }
  };

  return (
    <React.Fragment>
      <Modal
        open={transactionModal}
        onClose={() => dispatch(setAddTransactionModal(false))}
        aria-labelledby="create-modal-title"
        aria-describedby="create-modal-description"
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(2px)",
          },
        }}
      >
        <Box
          sx={{
            ...style,
            width: 500,
            // p: 4,
            borderRadius: "8px",
            bgcolor: "white",
            // boxShadow: 5,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Tabs
            value={transactionAmountTakeTab}
            onChange={(e, value) =>
              dispatch(setTransactionAmountTakeTab(value))
            }
            aria-label="basic tabs example"
          >
            <Tab label="Add Amount" {...a11yProps(0)} />
            <Tab label="Take Amount" {...a11yProps(1)} />
          </Tabs>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 4 }}>
            <Tabs
              value={methodTab}
              onChange={(e, value) => setMethodTab(value)}
              aria-label="basic tabs example"
              sx={{
                "& .MuiTabs-indicator": {
                  display: "none", // Hide default indicator
                },
              }}
            >
              <StyledTab label="Cash" {...a11yProps(0)} />
              <StyledTab label="UPI" {...a11yProps(1)} />
            </Tabs>
            <FormControl fullWidth>
              <InputLabel htmlFor="outlined-adornment-amount">
                Amount
              </InputLabel>

              <OutlinedInput
                type="number"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value;
                  // Check if value exceeds maximum
                  if (
                    value &&
                    Number(value) >
                      (methodTab === 0 ? maxCashAmount : maxUPIAmount)
                  ) {
                    setError(
                      `Amount cannot exceed ₹${
                        methodTab === 0
                          ? maxCashAmount.toLocaleString()
                          : maxUPIAmount.toLocaleString()
                      }`
                    );
                  } else {
                    setError("");
                  }

                  setAmount(value);
                }}
                id="outlined-adornment-amount"
                startAdornment={
                  <InputAdornment position="start">₹</InputAdornment>
                }
                label="Amount"
              />
              {error && transactionAmountTakeTab === 1 ? (
                <FormHelperText error>{error}</FormHelperText>
              ) : null}
            </FormControl>

            {transactionAmountTakeTab === 0 ? (
              <TextField
                label="Reason for Adding Amount"
                multiline
                rows={4}
                value={reason}
                onChange={(data) => setReason(data.target.value)}
                fullWidth
                variant="outlined"
                placeholder="Enter your text here..."
              />
            ) : (
              <Tabs
                value={insideTab}
                onChange={(e, value) => setInsideTab(value)}
                aria-label="basic tabs example"
                sx={{
                  "& .MuiTabs-indicator": {
                    display: "none", // Hide default indicator
                  },
                }}
              >
                <StyledTab label="Salary" {...a11yProps(0)} />
                <StyledTab label="other" {...a11yProps(1)} />
              </Tabs>
            )}

            {insideTab === 0 && transactionAmountTakeTab === 1 ? (
              <Box>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Select Employee
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedEmployee}
                    label="Select Employee"
                    onChange={(e: any) => setSelectedEmployee(e.target.value)}
                  >
                    {employeeList.map((data: any) => (
                      <MenuItem value={data.username}>{data.username}</MenuItem>
                    ))}
                    {/* <MenuItem value={"admin"}>Admin</MenuItem>
                    <MenuItem value={"amrin"}>Amrin</MenuItem>
                    <MenuItem value={"test"}>Test</MenuItem> */}
                  </Select>
                </FormControl>
              </Box>
            ) : transactionAmountTakeTab === 1 ? (
              <TextField
                label="Reason for Taking Amount"
                multiline
                rows={4}
                value={reason}
                onChange={(data) => setReason(data.target.value)}
                fullWidth
                variant="outlined"
                placeholder="Enter your text here..."
              />
            ) : null}
            <FormControl fullWidth>
              <InputLabel htmlFor="outlined-adornment-amount">
                Admin Password
              </InputLabel>
              <OutlinedInput
                value={password}
                startAdornment={
                  <InputAdornment position="start" sx={{ cursor: "pointer" }}>
                    {visible === false ? (
                      <VisibilityOffOutlinedIcon
                        onClick={() => setVisible(true)}
                      />
                    ) : (
                      <RemoveRedEyeOutlinedIcon
                        onClick={() => setVisible(false)}
                      />
                    )}
                  </InputAdornment>
                }
                onChange={(data) => setPassword(data.target.value)}
                id="outlined-adornment-amount"
                label="Admin Password"
                type={visible ? "text" : "password"}
              />
            </FormControl>
            <Button
              sx={{
                opacity: !isFormValid() ? 0.5 : 1,
                pointerEvents: !isFormValid() ? "none" : "auto",
              }}
              onClick={() => submitHandler()}
            >
              {loader ? (
                <CircularProgress size="1.5rem" color="white" />
              ) : (
                <Typography>Submit</Typography>
              )}
            </Button>
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default AddTransactionModal;
