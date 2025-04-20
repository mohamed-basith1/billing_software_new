import { Box, Button, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import customerImage from "../../assets/Image/Illustrate/customer.png";
import { getGreeting } from "../../utils/utils";
import WavingHandOutlinedIcon from "@mui/icons-material/WavingHandOutlined";
import ItemsEntryTab from "../../components/items/ItemsEntryTab";
import ItemEntryHistory from "../../components/items/ItemEntryHistory";
import { AnimatedCounter } from "../ReportPage/Dashboard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BalanceIcon from "@mui/icons-material/Balance";
import { useDispatch, useSelector } from "react-redux";
import { selectUserName } from "../LoginPage/LoginSlice";
import DealerInfoForm from "../../components/items/DealerInfoForm";
import {
  selectDealerHistoryList,
  selectDealerHistorySummary,
  selectDealerHistoryselected,
  selectItems,
  setDealerHistoryList,
  setDealerHistorySummary,
  setDealerHistoryselected,
  setDealerPurchasedDeleteModel,
  setPayDealerAmountHistoryModel,
  setPayDealerAmountModel,
} from "./ItemsSlice";
import ItemsDailyEntry from "../../components/items/ItemsDailyEntry";
import NewItemEntryModel from "../../components/modals/NewItemEntryModel";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import DealerDeleteHistoryModal from "../../components/modals/DealerDeleteHistoryModal";
import DealerAmountModal from "../../components/modals/DealerAmountModal";
import DealerAmountHistoryModal from "../../components/modals/DealerAmountHistoryModal";
const ItemPurchasedHistory = () => {
  const user = useSelector(selectUserName);
  const dealerHistorySummary = useSelector(selectDealerHistorySummary);
  const dealerHistoryselected = useSelector(selectDealerHistoryselected);
  const dealerHistoryList = useSelector(selectDealerHistoryList);
  const testinf = useSelector(selectItems);
  const columns = [
    { field: "code", headerName: "CODE", flex: 1 },
    { field: "item_name", headerName: "NAME", flex: 3 },
    { field: "stock_qty", headerName: "QTY", flex: 1 },
    { field: "uom", headerName: "UOM", flex: 1 },
    { field: "rate", headerName: "SELLING RATE", flex: 1 },
    { field: "purchased_rate", headerName: "PURCHASED", flex: 1 },
    {
      field: "total_purchased_amount",
      headerName: "Total",
      flex: 1,
      align: "right",
      headerAlign: "right",
    },
  ];

  console.log("testinf", testinf);
  const dispatch = useDispatch();
  useEffect(() => {
    getDealerBillList();
    getDealerBillSummaryHandler();
  }, []);
  const getDealerBillList = async () => {
    //@ts-ignore
    let response = await window.electronAPI.getDealerBill();

    console.log("ressdsjdponse", response);
    dispatch(setDealerHistoryList(response.data));
  };
  const getDealerBillSummaryHandler = async () => {
    //@ts-ignore
    let response = await window.electronAPI.getDealerBillSummary();

    dispatch(setDealerHistorySummary(response.data));
  };

  useEffect(() => {
    console.log(
      "dealerHistorySummary",
      dealerHistorySummary,
      "dealerHistoryList",
      dealerHistoryList
    );
  }, [dealerHistorySummary]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          height: "calc(100% - 3.5rem)",
          width: "100%",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",

          mt: 2,
          overflow: "hidden",
          // gap: "20px",
        }}
      >
        {/* top  */}
        <Box
          sx={{
            height: "30%",
            width: "100%",
            bgcolor: "white",
            p: 2,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxSizing: "border-box",
            gap: 2,
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
            <Typography>
              Your hard work keeps our store running strong.
            </Typography>
          </Box>

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
                name: "Total Items Purchased",
                value: dealerHistorySummary?.total_purchased_amount ?? 0,
                icon: <AccountBalanceWalletIcon fontSize="large" />,
                tab: 0,
                bgColor: "rgba(246, 173, 85, 0.2)", // Amber
                color: "#f6ad55",
                description:
                  "Total item purchased amount",
              },
              {
                name: "Total Pending Amount",
                value: dealerHistorySummary?.balance_amount ?? 0,
                icon: <BalanceIcon fontSize="large" />,
                tab: 1,
                bgColor: "rgba(66, 153, 225, 0.2)", // Blue
                color: "#4299e1",
                description: "Total pending amount to be paid to the dealer.",
              },
            ].map((item) => (
              <Box
                key={item.tab}
                sx={{
                  flex: "1 1 200px",
                  bgcolor: item.bgColor,
                  p: 3,
                  borderRadius: 2,
                  maxWidth: "23%",
                  height: "8rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  borderLeft: `4px solid ${item.color}`,
                  transition: "box-shadow 0.5s ease-in-out",
                  cursor: item.tab !== 2 ? "pointer" : "auto",
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
                    <AnimatedCounter value={item.value} isCurrency={true} />
                  </Box>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  width={"10rem"}
                  sx={{ mt: 2 }}
                >
                  {item.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            height: "70%",
            width: "100%",
            display: "flex",
            bgcolor: "white",
            borderTop: ".1px solid lightgrey",
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
              {dealerHistoryList?.map((data: any) => {
                return (
                  <Box
                    onClick={() => dispatch(setDealerHistoryselected(data))}
                    sx={{
                      padding: "20px 15px",
                      width: "100%",

                      bgcolor:
                        dealerHistoryselected?._id === data._id
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
                        {data.dealerName}
                      </Typography>
                      <Typography
                        sx={{ opacity: ".5", mt: 1, fontSize: ".8rem" }}
                      >
                        {data?.createdAt
                          ? new Date(data.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                timeZone: "UTC",
                              }
                            )
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
                        ₹ {data.dealerPurchasedPrice}
                      </Typography>{" "}
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: ".6rem",
                          color:
                            data.givenAmount === 0
                              ? "rgb(193,9,21)"
                              : "rgb(30, 120, 80)",
                        }}
                      >
                        {data.dealerPurchasedPrice === data.givenAmount
                          ? "PAID"
                          : data.givenAmount === 0
                          ? "NOT PAID"
                          : "PARTIALLY PAID"}
                      </Typography>{" "}
                      {data.dealerPurchasedPrice !== data.givenAmount ? (
                        <Typography
                          sx={{ fontWeight: 600, color: "rgb(193,9,21)" }}
                        >
                          ₹ {data.dealerPurchasedPrice - data.givenAmount}
                        </Typography>
                      ) : null}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {Object.keys(dealerHistoryselected).length !== 0 ? (
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
                    display:
                      dealerHistoryselected.dealerPurchasedPrice ===
                      dealerHistoryselected.givenAmount
                        ? "none"
                        : "flex",
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
                  onClick={() => dispatch(setPayDealerAmountModel(true))}
                >
                  <ReceiptLongOutlinedIcon
                    sx={{ fontSize: "1rem", color: "inherit" }}
                  />
                  PAY PURCHASED BALANCE
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
                  onClick={() => dispatch(setPayDealerAmountHistoryModel(true))}
                >
                  <HistoryOutlinedIcon
                    sx={{ fontSize: "1rem", color: "inherit" }}
                  />
                  GIVEN AMOUNT HISTORY
                </Box>

                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    display:
                      dealerHistoryselected.history.length === 0
                        ? "flex"
                        : "none",
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
                  onClick={() => dispatch(setDealerPurchasedDeleteModel(true))}
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
                        {dealerHistoryselected?.createdAt
                          ? new Date(
                              dealerHistoryselected.createdAt
                            ).toLocaleDateString("en-GB", {
                              timeZone: "UTC",
                            })
                          : ""}
                      </Typography>
                      <Typography sx={{ mt: 2 }}>Dealer Name</Typography>
                      <Typography
                        sx={{ fontSize: ".7rem", color: "grey", mt: 1 }}
                      >
                        {dealerHistoryselected?.dealerName}
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
                        {/* BILL NUMBER - {selectedBills?.bill_number} */}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 5 }}>
                    <DataGrid
                      rows={
                        dealerHistoryselected?.purchasedItemList?.map(
                          (data) => ({
                            ...data,
                            id: data.unique_id,
                          })
                        ) || []
                      }
                      columns={columns}
                      disableColumnMenu
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
                        Total Purchased Price
                      </Typography>
                      <Typography sx={{ fontSize: ".7rem" }}>
                        {dealerHistoryselected?.dealerPurchasedPrice}
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
                        Total Given Amount
                      </Typography>
                      <Typography sx={{ fontSize: ".7rem" }}>
                        {dealerHistoryselected?.givenAmount}
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
                        Balance
                      </Typography>
                      <Typography sx={{ fontSize: ".7rem", fontWeight: 600 }}>
                        ₹{" "}
                        {dealerHistoryselected?.dealerPurchasedPrice -
                          dealerHistoryselected?.givenAmount}
                      </Typography>
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
        <DealerAmountModal />
        <DealerDeleteHistoryModal />
        <DealerAmountHistoryModal />
      </Box>
    </LocalizationProvider>
  );
};

export default ItemPurchasedHistory;
