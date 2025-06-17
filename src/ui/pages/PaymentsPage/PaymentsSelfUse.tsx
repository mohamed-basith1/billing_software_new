import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { FixedSizeList as List } from "react-window";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
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
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PaymentsIcon from "@mui/icons-material/PaymentsOutlined";
import {
  fetchBills,
  filterTodayBills,
  getTotalAmount,
} from "../../utils/utils";
import {
  clearPaymentBillsDetail,
  clearReturnBillDetail,
  removeBill,
  selectBillSearch,
  selectFromDate,
  selectSelectedBills,
  selectTempRemoveItem,
  selectToDate,
  selectUPIBillsList,
  setBillSearch,
  setFromDate,
  setPaymentChange,
  setSelectedBills,
  setToDate,
  setUPIBillsList,
  setnewReturnBill,
} from "./PaymentsSlice";

import { selectUserName } from "../LoginPage/LoginSlice";
import utc from "dayjs/plugin/utc";

import timezone from "dayjs/plugin/timezone";
import { AnimatedCounter } from "../ReportPage/Dashboard";
import DeleteModal from "../../components/modals/DeleteModal";
import { setCustomerDeleteModal } from "../CustomersPage/CustomersSlice";
const Row = ({ index, style, data }) => {
  const bill = data.items[index];
  const selectedBills = data.selectedBills;
  const dispatch = data.dispatch;

  return (
    <Box
      style={style}
      onClick={() => dispatch(setSelectedBills(bill))}
      sx={{
        padding: "20px 15px",
        width: "100%",
        bgcolor:
          selectedBills?.bill_number === bill.bill_number ? "#F7F7FE" : "white",
        borderBottom: ".1px solid lightgrey",
        display: "flex",
        justifyContent: "space-between",
        cursor: "pointer",
      }}
    >
      <Box>
        <Typography sx={{ fontWeight: 600 }}>{bill.bill_number}</Typography>
        <Typography sx={{ opacity: ".5", mt: 1, fontSize: ".8rem" }}>
          Total Items {bill.itemsList.length} -{" "}
          {bill?.createdAt
            ? new Date(bill.createdAt).toLocaleString("en-GB", {
                timeZone: "UTC",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : ""}
        </Typography>
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 600 }}>₹ {bill.total_amount}</Typography>
      </Box>
    </Box>
  );
};

const PaymentsSelfUse = () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const columns: GridColDef[] = [
    { field: "item_name", headerName: "ITEM NAME", flex: 3 },
    {
      field: "qty",
      headerName: "QUANTITY",
      flex: 1,
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

  useEffect(() => {
    dispatch((dispatch) => {
      dispatch(setFromDate(dayjs().tz("Asia/Kolkata").subtract(1, "month")));
      dispatch(setToDate(dayjs().tz("Asia/Kolkata")));

      // Call getUPIBills after Redux state is updated
      setTimeout(() => {
        getUPIBills();
      }, 0);
    });

    return () => {
      dispatch(clearPaymentBillsDetail());
    };
  }, []);

  const getUPIBills = async () => {
    let response: any = await fetchBills(
      dayjs().subtract(1, "month").tz("Asia/Kolkata").add(1, "day"),
      dayjs().tz("Asia/Kolkata").add(1, "day"),
      "Self Use"
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
        "Self Use"
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
      "Self Use"
    );
    dispatch(setUPIBillsList(response.data));
  };

  const handleDeleteBill = async () => {
    let payload: any = UPIBillsList.find(
      (data: any) => data.bill_number === selectedBills.bill_number
    );
    //@ts-ignore
    let response = await window.electronAPI.deleteBill(payload);

    if (response.status === 200) {
      toast.success(response.message, { position: "bottom-left" });
      dispatch(removeBill(payload));
      dispatch(setCustomerDeleteModal(false));
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
                "linear-gradient(133deg, rgba(247,247,254,1) 60%, rgba(52, 152, 219, 1) 87%)",

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
                  <Typography sx={{ color: "grey", fontSize: ".8rem" }}>
                    Total Self Use Bill Received
                  </Typography>
                  <Typography sx={{ mt: 1 }}>
                    {" "}
                    <AnimatedCounter
                      value={getTotalAmount(UPIBillsList, "total_amount")}
                      isCurrency={true}
                    />
                    {/* ₹{getTotalAmount(UPIBillsList, "total_amount")} */}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: "grey", fontSize: ".8rem" }}>
                    Today Self Use Bill Received
                  </Typography>
                  <Typography sx={{ mt: 1 }}>
                    <AnimatedCounter
                      value={getTotalAmount(
                        filterTodayBills(UPIBillsList),
                        "total_amount"
                      )}
                      isCurrency={true}
                    />
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
              <PaymentsIcon
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
                  Self Use
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
            <List
              height={window.innerHeight * 0.7} // match 70% height
              itemCount={[...UPIBillsList].length}
              itemSize={90} // Estimate height of each item
              width="100%"
              itemData={{
                items: [...UPIBillsList].reverse(),
                selectedBills,
                dispatch,
              }}
            >
              {Row}
            </List>
            {/* {UPIBillsList?.map((data: any) => {
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
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>
                      ₹ {data.total_amount}
                    </Typography>{" "}
                  </Box>
                </Box>
              );
            })} */}
          </Box>
        </Box>

        {Object.keys(selectedBills).length !== 0 ? (
          <Box
            sx={{
              width: "70%",
              height: "100%",
              boxSizing: "border-box",
              overflow: "scroll",
              bgcolor: "white",
            }}
          >
            <Box
              sx={{
                bgcolor: "#F7F7FE",
                borderBottom: ".1px solid lightgrey",
                height: "100%",
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
                    backgroundColor: "rgba(220, 53, 69, 0.2)", // Light red background
                    color: "#C82333", // Deep red text for contrast
                  },

                  fontSize: ".7rem",
                  width: "8rem",
                  justifyContent: "center",
                }}
                onClick={() => dispatch(setCustomerDeleteModal(true))}
              >
                <DeleteOutlineOutlinedIcon
                  sx={{ fontSize: "1rem", color: "inherit" }}
                />
                DELETE
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
                      bgcolor: "white",
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
                          ? new Date(
                              selectedBills.createdAt
                            ).toLocaleDateString("en-GB", {
                              timeZone: "UTC",
                            })
                          : ""}
                      </Typography>
                      <Typography sx={{ mt: 2 }}>Billed BY</Typography>
                      <Typography
                        sx={{ fontSize: ".7rem", color: "grey", mt: 1 }}
                      >
                        {selectedBills?.billed_by}
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
                        sx={{
                          fontSize: ".7rem",
                          color: "grey",
                          fontWeight: 600,
                        }}
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
                          id: data.unique_id,
                        })) || []
                      }
                      columns={columns}
                      disableColumnMenu
                      hideFooter
                      sx={{
                        borderRadius: 0,

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
                      </Typography>
                    </Box>
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
        <DeleteModal bill={true} handleDeleteBill={handleDeleteBill} />
      </Box>
    </Box>
  );
};

export default React.memo(PaymentsSelfUse);
