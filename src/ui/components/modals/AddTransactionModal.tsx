import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  Modal,
  OutlinedInput,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { a11yProps } from "../../pages/ReportPage/ReportsTabs";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAddTransactionModal,
  selectTransactionAmountTakeTab,
  setAddTransactionModal,
  setTransactionAmountTakeTab,
} from "../../pages/ReportPage/ReportsSlice";
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

const AddTransactionModal = () => {
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const transactionModal = useSelector(selectAddTransactionModal);
  const transactionAmountTakeTab = useSelector(selectTransactionAmountTakeTab);
  const dispatch = useDispatch();
  const isFormValid = () => {
    return amount !== 0 && reason.trim() !== "" && password.trim() !== "";
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
            <FormControl fullWidth>
              <InputLabel htmlFor="outlined-adornment-amount">
                Amount
              </InputLabel>
              <OutlinedInput
                type="number"
                value={amount}
                onChange={(data) => setAmount(data.target.value)}
                id="outlined-adornment-amount"
                startAdornment={
                  <InputAdornment position="start">₹</InputAdornment>
                }
                label="Amount"
              />
            </FormControl>

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
              onClick={() => alert("hi")}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default AddTransactionModal;
