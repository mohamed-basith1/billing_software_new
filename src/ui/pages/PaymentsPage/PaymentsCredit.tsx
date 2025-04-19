import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import {
  fetchBills,
  filterTodayBills,
  generateInvoicePDF,
  getTotalAmount,
} from "../../utils/utils";
import {
  clearPaymentBillsDetail,
  clearReturnBillDetail,
  selectBillSearch,
  selectFromDate,
  selectSelectedBills,
  selectTempRemoveItem,
  selectToDate,
  selectUPIBillsList,
  setBillSearch,
  setFromDate,
  setItemRemove,
  setPayCreditBalanceModal,
  setPaymentChange,
  setReturnAmountModel,
  setReturnBillHistoryModal,
  setReturnItem,
  setSelectedBills,
  setToDate,
  setUPIBillsList,
  setnewReturnBill,
} from "./PaymentsSlice";
import { selectUserName } from "../LoginPage/LoginSlice";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { AnimatedCounter } from "../ReportPage/Dashboard";
import ReturnAmountModal from "../../components/modals/ReturnAmountModal";

const PaymentsCredit = () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  console.log("render in credit");
  const columns: GridColDef[] = [
    {
      field: "action",
      headerName: "#",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
              outline: "none",
              border: "none",
              userSelect: "none", // Prevents text selection
            }}
            onMouseDown={(e) => e.stopPropagation()} // Prevents cell highlight
            onClick={(e) => e.stopPropagation()} // Prevents cell focus
          >
            <IconButton
              style={{ outline: "none", border: "none", padding: 0 }}
              disabled={selectedBills.itemsList.length === 1 ? true : false}
              onClick={(e) => {
                e.stopPropagation(); // Stops focus from moving to the cell
                dispatch(setItemRemove(params.row.code));
              }}
            >
              <ClearRoundedIcon
                sx={{
                  color: "red",
                  opacity: selectedBills.itemsList.length === 1 ? ".5" : "auto",
                }}
              />
            </IconButton>
          </div>
        );
      },
    },
    { field: "item_name", headerName: "ITEM NAME", flex: 3 },
    {
      field: "qty",
      headerName: "QUANTITY",
      flex: 1,
      editable: true,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "uom",
      headerName: "UOM",
      flex: 1,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "rate",
      headerName: "RATE",
      flex: 1,
      align: "right",
      headerAlign: "right",
      valueGetter: (params) => {
        return params !== undefined ? `₹${params}` : " ₹0";
      },
    },
    {
      field: "amount",
      headerName: "AMOUNT",
      flex: 1,
      align: "right",
      headerAlign: "right",
      valueGetter: (params) => {
        return params !== undefined ? `₹${params}` : " ₹0";
      },
    },
  ];
  const fromDate = useSelector(selectFromDate);
  const toDate = useSelector(selectToDate);
  const UPIBillsList = useSelector(selectUPIBillsList);
  const selectedBills: any = useSelector(selectSelectedBills);
  const tempRemoveItem: any = useSelector(selectTempRemoveItem);
  const billSearch: any = useSelector(selectBillSearch);
  const dispatch: any = useDispatch();
  const userName = useSelector(selectUserName);
  console.log("UPIBillsList", UPIBillsList);
  useEffect(() => {
    dispatch(setFromDate(dayjs().tz("Asia/Kolkata").subtract(1, "month")));
    dispatch(setToDate(dayjs().tz("Asia/Kolkata")));

    getUPIBills();
    return () => {
      dispatch(clearPaymentBillsDetail());
    };
  }, []);
  const getUPIBills = async () => {
    let response: any = await fetchBills(
      dayjs().subtract(1, "month").tz("Asia/Kolkata").add(1, "day"),
      dayjs().tz("Asia/Kolkata").add(1, "day"),
      "Credit Bill"
    );
    // Convert `_id` to string before dispatching
    const serializedData = response.data.map((bill: any) => ({
      ...bill,
      _id: bill._id.toString(),
    }));

    dispatch(setUPIBillsList(serializedData));
  };
  const handleBillSearch = async (billnumber: string) => {
    if (billnumber) {
      dispatch(setBillSearch(billnumber));
      //@ts-ignore
      let response: any = await window.electronAPI.getBillBySearch(
        billnumber,
        "Credit Bill"
      );
      if (response.status === 200) {
        dispatch(setUPIBillsList(response.data));
      }
    } else {
      dispatch(setBillSearch(billnumber));
      getUPIBills();
    }
  };
  const handleDateChange = async () => {
    let response: any = await fetchBills(
      dayjs.utc(fromDate).tz("Asia/Kolkata").add(1, "day"),
      dayjs.utc(toDate).tz("Asia/Kolkata").add(1, "day"),
      "Credit Bill"
    );
    dispatch(setUPIBillsList(response.data));
  };
  const handleReturnBill = async () => {
    let UPIBillsListSelectedBill = UPIBillsList?.find(
      (data: any) => data.bill_number === selectedBills.bill_number
    );

    let returnBillHistoryPayload = {
      bill_number: selectedBills.bill_number,
      previous_bill_amount: UPIBillsListSelectedBill.total_amount,
      returned_items: tempRemoveItem,
      return_method: "Item returned",
      returned_amount: Math.max(
        selectedBills?.amount_paid -
          selectedBills?.itemsList?.reduce((sum, item) => {
            const quantity = item.uom === "gram" ? item.qty / 1000 : item.qty;
            return sum + quantity * item.rate;
          }, 0),
        0
      ),

      returned_by: userName,
    };

    console.log("returnBillHistoryPayload", returnBillHistoryPayload);
    if (
      UPIBillsList?.find(
        (data: any) => data.bill_number === selectedBills.bill_number
      ).total_amount !== selectedBills?.total_amount
    ) {
      // @ts-ignore
      await window.electronAPI.createBillReturnHistory(
        returnBillHistoryPayload
      );
    }

    console.log("selectedBills return bill", selectedBills);
    //@ts-ignore
    let response: any = await window.electronAPI.returnBill(
      selectedBills._id,
      selectedBills,
      tempRemoveItem
    );
    dispatch(setnewReturnBill(response.data));
    toast.success(`${response.message}`, { position: "bottom-left" });
    dispatch(clearReturnBillDetail());
    console.log("return bill response", response);
  };
  const handleReturnPendingAmount = async () => {
    dispatch(setReturnAmountModel(true));

    console.log("selectedBills?.return_amount", selectedBills?.return_amount);
    // //@ts-ignore
    // let response: any = await window.electronAPI.returnPendingAmount(
    //   selectedBills._id,
    //   selectedBills.total_amount
    // );

    // console.log("response", response);
    // dispatch(setnewReturnBill(response.data));
    // dispatch(setSelectedBills(response.data));
  };

  const finalBillHanlder = async (method) => {
    let validatorPayload = {
      amount: Number(selectedBills?.return_amount),
      method: method,
    };

    //@ts-ignore
    let amountAvalaible = await window.electronAPI.amountValidator(
      validatorPayload
    );
    if (amountAvalaible.status === 200) {
      let UPIBillsListSelectedBill = UPIBillsList?.find(
        (data: any) => data.bill_number === selectedBills.bill_number
      );

      let returnBillHistoryPayload = {
        bill_number: selectedBills.bill_number,
        previous_bill_amount: UPIBillsListSelectedBill.total_amount,
        returned_items: tempRemoveItem,
        return_method: method,
        returned_amount: selectedBills?.return_amount,
        returned_by: userName,
      };

      console.log("returnBillHistoryPayload", returnBillHistoryPayload);
      // if (
      //   UPIBillsList?.find(
      //     (data: any) => data.bill_number === selectedBills.bill_number
      //   ).total_amount !== selectedBills?.total_amount
      // ) {

      // @ts-ignore
      await window.electronAPI.createBillReturnHistory(
        returnBillHistoryPayload
      );
      // }

      //@ts-ignore
      let response: any = await window.electronAPI.returnPendingAmount(
        selectedBills._id,
        selectedBills.total_amount
      );

      let TransactionPayload = {
        status: "Decreased",
        bill_no: selectedBills.bill_number,
        customer: "None",
        employee: "",
        method: method,
        reason: "Credit Billed Item Return",
        amount: Number(selectedBills?.return_amount),
        handler: userName,
        billtransactionhistory: true,
        password: "",
      };
      //@ts-ignore
      await window.electronAPI.addTransactionHistory(TransactionPayload);
      console.log("response", response);
      dispatch(setnewReturnBill(response.data));
      dispatch(setSelectedBills(response.data));
      dispatch(setReturnAmountModel(false));
    } else {
      toast.error(`${amountAvalaible.message}`, { position: "bottom-left" });
    }
  };
  return (
    <Box
      sx={{
        height: "calc(100% - 3.5rem)",
        width: "100%",
        background: "white",
        borderRadius: "8px",

        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        mt: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          height: "30%",
          gap: "10px",
          p: 2,
          borderBottom: ".1px solid lightgrey",
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
                placeholder="Bill Number"
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
                value={billSearch}
                size="small"
                type="number"
                onChange={(e) => handleBillSearch(e.target.value)}
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
                    onChange={(newValue) =>
                      dispatch(setFromDate(dayjs(newValue).tz("Asia/Kolkata")))
                    }
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
                    onChange={(newValue) =>
                      dispatch(setToDate(dayjs(newValue).tz("Asia/Kolkata")))
                    }
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
              borderRadius: "8px",
              width: "100%",
              background:
                // "linear-gradient(133deg, rgba(247,247,254,1) 60%, rgba(34,179,120,1) 87%)",
                "linear-gradient(133deg, rgba(247,247,254,1) 60%, rgba(155, 89, 182, 1) 87%)",
              // "linear-gradient(133deg, rgba(247,247,254,1) 60%, rgba(236,117,30,1) 72%, rgba(34,179,120,1) 90%)",
              my: 2,
              position: "relative",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                padding: "1.3rem",
                height: "100%",
                width: "60%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{ color: "grey", fontWeight: 600, fontSize: ".8rem" }}
              >
                {" "}
                Payment Summary
              </Typography>
              <Box sx={{ display: "flex", gap: "60px" }}>
                <Box>
                  <Typography
                    sx={{
                      color: "grey",
                      fontSize: ".8rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Total Credit Payments
                  </Typography>
                  <Typography sx={{ mt: 1 }}>
                    <AnimatedCounter
                      value={getTotalAmount(UPIBillsList, "total_amount")}
                      isCurrency={true}
                    />
                    {/* {" "}
                    ₹{getTotalAmount(UPIBillsList, "total_amount")} */}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: "grey",
                      fontSize: ".8rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Total Payments Received
                  </Typography>
                  <Typography sx={{ mt: 1 }}>
                    <AnimatedCounter
                      value={getTotalAmount(UPIBillsList, "amount_paid")}
                      isCurrency={true}
                    />
                    {/* ₹{getTotalAmount(UPIBillsList, "amount_paid")} */}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    sx={{
                      color: "grey",
                      fontSize: ".8rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Total Due Amount
                  </Typography>
                  <Typography sx={{ mt: 1 }}>
                    <AnimatedCounter
                      value={getTotalAmount(UPIBillsList, "balance")}
                      isCurrency={true}
                    />
                    {/* ₹{getTotalAmount(UPIBillsList, "balance")} */}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: "grey",
                      fontSize: ".8rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Return Pending Amount
                  </Typography>
                  <Typography sx={{ mt: 1 }}>
                    <AnimatedCounter
                      value={getTotalAmount(UPIBillsList, "return_amount")}
                      isCurrency={true}
                    />
                    {/* ₹{getTotalAmount(UPIBillsList, "return_amount")} */}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                padding: "2rem",
              }}
            >
              <CreditCardOutlinedIcon
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
                  Credit
                </span>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Bottom */}
      <Box
        sx={{
          height: "70%",
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
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "scroll",
              borderRight: ".1px solid lightgrey",
            }}
          >
            {UPIBillsList?.map((data: any) => {
              return (
                <Box
                  onClick={() => dispatch(setSelectedBills(data))}
                  sx={{
                    padding: "20px 15px",
                    width: "100%",

                    bgcolor:
                      selectedBills?.bill_number === data.bill_number
                        ? "#F7F7FE"
                        : "white",

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
                      Total Items {data.itemsList.length} -{" "}
                      {data?.createdAt
                        ? new Date(data.createdAt).toLocaleDateString("en-GB", {
                            timeZone: "UTC",
                          })
                        : ""}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>
                      ₹ {data.total_amount}
                    </Typography>{" "}
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: ".6rem",
                        color:
                          data.amount_paid === 0
                            ? "rgb(193,9,21)"
                            : "rgb(30, 120, 80)",
                      }}
                    >
                      {data.paid
                        ? "PAID"
                        : data.amount_paid === 0
                        ? "NOT PAID"
                        : "PARTIALLY PAID"}
                    </Typography>{" "}
                    {data.return_amount > 0 ? (
                      <Typography
                        sx={{ fontWeight: 600, color: "rgb(193,9,21)" }}
                      >
                        ₹ {data.return_amount}
                      </Typography>
                    ) : null}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {Object.keys(selectedBills).length !== 0 ? (
          <Box
            sx={{
              width: "70%",
              height: "100%",
              boxSizing: "border-box",
              overflow: "scroll",
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "100%",
                bgcolor: "#F7F7FE",
                borderBottom: ".1px solid lightgrey",
                boxShadow: "0px 11px 1px 0px rgba(0,0,0,0.15)",
                justifyContent: "flex-start",
                overflowX: "auto", // Enable horizontal scrolling
                whiteSpace: "nowrap", // Prevent wrapping
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  borderRight: ".1px solid lightgrey",
                  cursor: "pointer",

                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(34, 179, 120, 0.2)",
                    color: "#1E8449",
                  },
                  fontSize: ".7rem",
                }}
                onClick={() => dispatch(setPayCreditBalanceModal(true))}
              >
                <ReceiptLongOutlinedIcon
                  sx={{ fontSize: "1rem", color: "inherit" }}
                />
                PAY CREDIT BALANCE
              </Box>

              <Box
                sx={{
                  px: 2,
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  borderRight: ".1px solid lightgrey",
                  cursor: "pointer",

                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(52, 152, 219, 0.2)",
                    color: "#217DBB",
                  },
                  fontSize: ".7rem",
                }}
                onClick={() =>
                  generateInvoicePDF(
                    selectedBills?.itemsList,
                    selectedBills.sub_amount,
                    selectedBills.discount,
                    selectedBills.total_amount
                  )
                }
              >
                <FileDownloadOutlinedIcon
                  sx={{ fontSize: "1rem", color: "inherit" }}
                />
                GENERATE INVOICE
              </Box>
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  borderRight: ".1px solid lightgrey",
                  cursor: "pointer",

                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 215, 0, 0.2)", // Gold-like yellow
                    color: "#9A7D0A", // Dark golden text
                  },
                  fontSize: ".7rem",
                }}
                onClick={() => dispatch(setReturnBillHistoryModal(true))}
              >
                <HistoryOutlinedIcon
                  sx={{ fontSize: "1rem", color: "inherit" }}
                />
                RETURN BILL HISTORY
              </Box>
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  display:
                    UPIBillsList.find(
                      (data) => data.bill_number === selectedBills.bill_number
                    )?.return_amount > 0
                      ? "flex"
                      : "none",
                  alignItems: "center",
                  gap: "10px",
                  borderRight: ".1px solid lightgrey",
                  cursor: "pointer",

                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(156, 39, 176, .2)", //
                    color: "#6A1B9A", // Deep purple text for contrast
                  },
                  fontSize: ".7rem",
                  opacity:
                    UPIBillsList.find(
                      (data) => data.bill_number === selectedBills.bill_number
                    )?.total_amount === selectedBills.total_amount
                      ? "1"
                      : ".2",
                }}
                onClick={() => {
                  if (
                    UPIBillsList.find(
                      (data) => data.bill_number === selectedBills.bill_number
                    )?.total_amount === selectedBills.total_amount
                  ) {
                    handleReturnPendingAmount();
                  } else {
                    toast.warning(
                      "You are trying to settle the amount before billing. Please click the 'Bill Again' button first, then try to transfer the amount. ",
                      { position: "bottom-left" }
                    );
                  }
                }}
              >
                <RepeatOutlinedIcon
                  sx={{ fontSize: "1rem", color: "inherit" }}
                />
                RETURN AMOUNT TRANSFORED
              </Box>
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  borderRight: ".1px solid lightgrey",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(220, 53, 69, 0.2)", // Light red background
                    color: "#C82333", // Deep red text for contrast
                  },
                  fontSize: ".7rem",
                }}
                onClick={() => dispatch(setReturnBillHistoryModal(true))}
              >
                <DeleteOutlineOutlinedIcon
                  sx={{ fontSize: "1rem", color: "inherit" }}
                />
                DELETE
              </Box>
            </Box>

            <Box sx={{ bgcolor: "white", height: "100%" }}>
              <Box
                sx={{
                  bgcolor: "white",

                  py: 10,

                  px: 8,
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
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Typography>Order Date</Typography>
                    <Typography
                      sx={{ fontSize: ".7rem", color: "grey", mt: 1 }}
                    >
                      {selectedBills?.createdAt
                        ? new Date(selectedBills.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              timeZone: "UTC",
                            }
                          )
                        : ""}
                    </Typography>
                    <Typography sx={{ mt: 2 }}>Customer Name</Typography>
                    <Typography
                      sx={{ fontSize: ".7rem", color: "grey", mt: 1 }}
                    >
                      {selectedBills?.customer_name}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",

                      justifyContent: "space-between",
                      textAlign: "start",
                      alignItems: "flex-end",
                    }}
                  >
                    <Typography sx={{ fontSize: "3rem", lineHeight: 1.5 }}>
                      INVOICE
                    </Typography>
                    <Typography
                      sx={{ fontSize: ".7rem", color: "grey", fontWeight: 600 }}
                    >
                      BILL NUMBER - {selectedBills?.bill_number}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 5 }}>
                  <DataGrid
                    rows={
                      selectedBills?.itemsList?.map((data) => ({
                        ...data,
                        id: data.code,
                      })) || []
                    }
                    columns={columns}
                    disableColumnMenu
                    processRowUpdate={(newRow) => {
                      console.log("newRow", newRow, UPIBillsList);

                      let oldRow = UPIBillsList.find(
                        (data: any) =>
                          data.bill_number === selectedBills.bill_number
                      )?.itemsList?.find(
                        (data: any) => data.code === newRow.code
                      );

                      if (!/^\d*\.?\d+$/.test(newRow.qty)) {
                        toast.warning(
                          "Invalid quantity! Only numbers are allowed.",
                          { position: "bottom-left" }
                        );

                        return oldRow;
                      }

                      let updatedQty = Number(newRow.qty);

                      if (
                        newRow.uom.toLowerCase() === "piece" &&
                        !Number.isInteger(updatedQty)
                      ) {
                        toast.warning(
                          "Quantity must be a whole number for items with UOM 'piece'.",
                          { position: "bottom-left" }
                        );

                        return oldRow; // Revert to the old row
                      }

                      // Restriction: New quantity should not be more than the old quantity
                      if (updatedQty > oldRow.qty) {
                        toast.warning(
                          `New quantity cannot be greater than the billed quantity (${oldRow.qty})`,
                          { position: "bottom-left" }
                        );

                        return oldRow; // Revert to the old row
                      }

                      // Restriction: New quantity should be greater than zero
                      if (updatedQty <= 0) {
                        toast.warning("Quantity must be greater than zero", {
                          position: "bottom-left",
                        });

                        return oldRow; // Revert to the old row
                      }

                      let updatedAmount = updatedQty * newRow.rate; // Default calculation

                      if (newRow.uom.toLowerCase() === "gram") {
                        updatedAmount = (updatedQty / 1000) * newRow.rate; // Adjust for grams
                      }

                      const updatedRow = {
                        ...newRow,
                        qty: updatedQty, // Ensure qty is a number
                        amount: parseFloat(updatedAmount.toFixed(2)), // Round to 2 decimal places
                      };

                      dispatch(setReturnItem(updatedRow));
                      return updatedRow; // Apply the valid changes
                    }}
                    hideFooter
                    sx={{
                      "& .MuiDataGrid-columnSeparator": {
                        display: "none",
                      },
                      "& .MuiDataGrid-columnHeader": {
                        backgroundColor: "#1E1E2D !important",
                        color: "white",
                        maxHeight: "50px",
                        border: "none",
                      },
                      "& .MuiDataGrid-cell": {
                        border: "none",
                      },
                      borderRadius: 0,
                      // "& .MuiDataGrid-columnHeader": {
                      //   backgroundColor: "#1E1E2D !important", // Ensure each column header is colored
                      //   color: "white",
                      //   borderRadius: 0,
                      //   pt: 0,
                      // },
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "10px",
                    mt: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: "30%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography sx={{ fontSize: ".7rem" }}>
                      Sub Total{" "}
                    </Typography>
                    <Typography sx={{ fontSize: ".7rem" }}>
                      {selectedBills?.sub_amount}
                      {/* {selectedBills?.itemsList?.reduce((sum, item) => {
                        const quantity =
                          item.uom === "gram" ? item.qty / 1000 : item.qty;
                        return sum + quantity * item.rate;
                      }, 0)} */}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "30%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography sx={{ fontSize: ".7rem" }}>
                      Discount{" "}
                    </Typography>
                    <Typography sx={{ fontSize: ".7rem" }}>
                      {selectedBills?.discount}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "30%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography sx={{ fontSize: ".7rem" }}>Total </Typography>
                    <Typography sx={{ fontSize: ".7rem", fontWeight: 600 }}>
                      ₹ {selectedBills?.total_amount}
                      {/* {selectedBills?.itemsList?.reduce((sum, item) => {
                        const quantity =
                          item.uom === "gram" ? item.qty / 1000 : item.qty;
                        return sum + quantity * item.rate;
                      }, 0)} */}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: "30%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography sx={{ fontSize: ".7rem" }}>
                      Total Paid Amount
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: ".7rem",
                        fontWeight: 600,
                        color: "rgb(30, 120, 80)",
                      }}
                    >
                      ₹ {selectedBills?.amount_paid}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "30%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography sx={{ fontSize: ".7rem" }}>
                      Balance Amount
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: ".7rem",
                        fontWeight: 600,
                        color: "rgb(193,9,21)",
                      }}
                    >
                      ₹ {selectedBills?.balance}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "30%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography sx={{ fontSize: ".7rem" }}>
                      Return Amount{" "}
                    </Typography>
                    <Typography sx={{ fontSize: ".7rem", fontWeight: 600 }}>
                      ₹ {selectedBills?.return_amount}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: "30%",
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 3,
                    }}
                  >
                    <Button
                      sx={{
                        height: "",
                        opacity:
                          selectedBills?.itemsList?.length === 0
                            ? ".5"
                            : "auto",
                      }}
                      fullWidth
                      onClick={() => handleReturnBill()}
                    >
                      Bill Again
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              width: "70%",
              height: "100%",
              boxSizing: "border-box",
              overflow: "scroll",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography>Select The Listed Bills</Typography>
          </Box>
        )}
      </Box>
      <ReturnAmountModal finalBillHanlder={finalBillHanlder} />
    </Box>
  );
};

export default PaymentsCredit;
