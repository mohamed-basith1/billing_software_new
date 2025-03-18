import QrCode2Icon from "@mui/icons-material/QrCode2";
import ReceiptIcon from "@mui/icons-material/ReceiptOutlined";
import ReplayIcon from "@mui/icons-material/Replay";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";

import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { fetchBills } from "../../utils/utils";
import { selectUPIBillsList, setUPIBillsList } from "./PaymentsSlice";

const PaymentsUPI = () => {
  // State for From and To dates
  const [fromDate, setFromDate] = useState(dayjs().subtract(1, "month"));
  const [toDate, setToDate] = useState(dayjs());
  const UPIBillsList = useSelector(selectUPIBillsList);
  const dispatch: any = useDispatch();
console.log("UPIBillsList",UPIBillsList);
  useEffect(() => {
    const getUPIBills = async () => {
      let response: any = await fetchBills(
        dayjs().subtract(1, "month"),
        dayjs(),
        "UPI Paid"
      );
      // Convert `_id` to string before dispatching
      const serializedData = response.data.map((bill: any) => ({
        ...bill,
        _id: bill._id.toString(),
      }));

      dispatch(setUPIBillsList(serializedData));
    };
    getUPIBills();
  }, []);
  const handleDateChange = async () => {
    let response: any = await fetchBills(fromDate, toDate, "UPI Paid");
    dispatch(setUPIBillsList(response.data));
  };
  return (
    <Box
      sx={{
        height: "calc(100% - 3.5rem)",
        width: "100%",
        background: "white",
        borderRadius: "8px",
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        mt: 2,
        // overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          height: "30%",
          gap: "10px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",

            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              height: "10%",
              // bgcolor: "red",
              alignItems: "flex-start",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <TextField
                placeholder="Bill Search"
                variant="outlined"
                sx={{
                  width: "20rem",
                  p: 0.5,
                  background: "white",
                  borderRadius: "8px",
                  border: ".1px solid lightgrey",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "0px solid lightgrey !important",
                    borderRadius: "8px",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "0px solid lightgrey !important",
                    borderRadius: "8px",
                  },
                }}
                value={""}
                size="small"
                onChange={(e) => console.log("")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton edge="start">
                        <SearchRoundedIcon
                          sx={{ fontSize: "1.9rem", color: "#1E1E2D", p: 0 }}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box>
              <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="From"
                    value={fromDate}
                    onChange={(newValue) => setFromDate(newValue)}
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
                    onChange={(newValue) => setToDate(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth size="small" />
                    )}
                  />
                </LocalizationProvider>

                <Button sx={{ px: 3 }} onClick={() => handleDateChange()}>
                  Search
                </Button>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              height: "60%",
              // bgcolor: "#F7F7FE",
              borderRadius: "8px",
              padding: "2rem",
              width: "100%",
              background:
                "linear-gradient(133deg, rgba(247,247,254,1) 60%, rgba(34,179,120,1) 87%)",
              my: 2,
              position: "relative",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>Payment Summary</Box>
            <Box
              sx={{ display: "flex", alignItems: "flex-start", gap: "10px" }}
            >
              <QrCode2Icon
                sx={{
                  color: "white",
                  fontSize: "4rem",
                }}
              />
              <Typography color="white" sx={{ fontSize: "1rem" }}>
                Bills Paid By <br />{" "}
                <span
                  style={{
                    fontSize: "2rem",
                    fontWeight: 600,
                    marginTop: "-100px",
                  }}
                >
                  UPI
                </span>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Bottom */}
      <Box
        sx={{
          height: "68%",
          width: "100%",
          display: "flex",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: "30%",
            display: "flex",
            flexDirection: "column",
            // overflow: "scroll",
            // borderRight: ".1px solid lightgrey",
            // gap: "10px",
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "scroll",
              // borderRight: ".1px solid lightgrey",
              // borderLeft: ".1px solid lightgrey",
            }}
          >
            {UPIBillsList?.map((data) => {
              return (
                <Box
                  sx={{
                    padding: "20px 5px",
                    width: "100%",

                    // bgcolor: "#F7F7FE",
                    // borderRadius: "8px",
                    borderBottom: ".1px solid lightgrey",
                    display: "flex",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>
                     {data.bill_number}
                    </Typography>
                    <Typography
                      sx={{ opacity: ".5", mt: 1, fontSize: ".8rem" }}
                    >
                      Total Items {data.itemsList.length} - {data.createdAt.toLocaleDateString("en-GB")}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>₹ {data.total_amount}</Typography>{" "}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box
          sx={{
            width: "70%",
            height: "100%",
            p: 1,
            // bgcolor: "red",
            boxSizing: "border-box",
            overflow: "scroll",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              pl: 1,
              gap: "10px",
              justifyContent: "flex-end",
              mb: 1,
            }}
          >
            <Button sx={{ px: 3, height: "", bgcolor: "#22b378" }}>
              RETURN <ReplayIcon sx={{ ml: 1 }} />
            </Button>
            <Button sx={{ px: 3, height: "", bgcolor: "#22b378" }}>
              PRINT BILL <ReceiptIcon sx={{ ml: 1 }} />
            </Button>
          </Box>

          <Box sx={{ bgcolor: "white", height: "100%", p: 5 }}>
            <Box
              sx={{
                bgcolor: "white",
                height: "100%",
                p: 5,
                boxShadow: " 1px 1px 5px 1px rgba(0,0,0,0.15)",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography>Order Date</Typography>
                  <Typography sx={{ fontSize: ".7rem", color: "grey", mt: 1 }}>
                    02/03/2025
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography sx={{ fontSize: "2rem" }}>INVOICE</Typography>
                  <Typography sx={{ fontSize: ".7rem", color: "grey" }}>
                    BILL - 1
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        
      </Box>
    </Box>
  );
};

export default PaymentsUPI;
