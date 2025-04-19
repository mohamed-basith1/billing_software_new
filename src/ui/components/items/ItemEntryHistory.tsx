import React, { useEffect, useRef, useState } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { toast } from "react-toastify";

import utc from "dayjs/plugin/utc";
import { DataGrid } from "@mui/x-data-grid";
import {
  clearDealerDetails,
  removeEnteredListedItem,
  selectDateTigger,
  selectDealerPurchasedPrice,
  selectItems,
  selectLoadItemWithDealer,
  selectNewItemWithDealer,
} from "../../pages/ItemsPage/ItemsSlice";
import { useDispatch, useSelector } from "react-redux";
import timezone from "dayjs/plugin/timezone";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

const ItemEntryHistory = () => {
  const columns = [
    {
      field: "unique_id",
      headerName: "#",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        return (
          <IconButton
            onClick={() =>
              dispatch(removeEnteredListedItem({ unique_id: params.value }))
            }
          >
            <ClearRoundedIcon sx={{ color: "red" }} />
          </IconButton>
        );
      },
    },
    { field: "code", headerName: "CODE", flex: 3 },
    { field: "item_name", headerName: "NAME", flex: 3 },
    { field: "stock_qty", headerName: "QTY", flex: 3 },
    { field: "uom", headerName: "UOM", flex: 3 },
    { field: "rate", headerName: "RATE", flex: 3 },
    { field: "purchased_rate", headerName: "PURCHASED", flex: 3 },
    {
      field: "total_purchased_amount",
      headerName: "Total",
      flex: 3,
    },
  ];
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const [entryHistory, setEntryHistory] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    dayjs().tz("Asia/Kolkata")
  );
  const gridRef = useRef<HTMLDivElement | null>(null);

  const dateTigger = useSelector(selectDateTigger); // Unused, consider removing it if not needed
  const loadItemWithDealer = useSelector(selectLoadItemWithDealer);
  const newItemWithDealer = useSelector(selectNewItemWithDealer);
  const dealerDetails = useSelector(selectItems);
  const dealerPurchasedPrice = useSelector(selectDealerPurchasedPrice);

  const dispatch = useDispatch();
  console.log(
    "loadItemWithDealer",
    loadItemWithDealer,
    "newItemWithDealer",
    newItemWithDealer,
    dealerDetails.dealerName,
    dealerDetails.dealerPurchasedPrice
  );
  // 📌 Handle Date Selection & API Call (Only when Date Changes)
  const handleDateChange = async (date: Dayjs | null) => {
    if (!date) return;

    const formattedDate = dayjs(date)
      .tz("Asia/Kolkata")
      .startOf("day")
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    console.log("📅 Selected Date (UTC):", formattedDate);

    try {
      const response: any = await window.electronAPI.filterByData(
        formattedDate
      );

      if (response.status !== 200) {
        toast.error(`${response.message}`, { position: "bottom-left" });
        return;
      }

      if (!response.data || response.data.length === 0) {
        setEntryHistory([]);
        return;
      }

      setEntryHistory(
        response.data.map((item: any, index: number) => ({
          ...item,
          id: index + 1,
        }))
      );

      console.log("✅ Filtered Items Response:", response.data);
    } catch (error) {
      console.error("❌ Error fetching items by date:", error);
      toast.error("Failed to fetch items.", { position: "bottom-left" });
    }
  };

  // 📌 Call handleDateChange when `selectedDate` updates
  useEffect(() => {
    if (selectedDate) {
      // handleDateChange(selectedDate);
    }
  }, [selectedDate, dateTigger]);

  // 📌 Scroll to Bottom when Entry History Updates
  useEffect(() => {
    const scrollToBottom = () => {
      if (gridRef.current) {
        const gridContainer = gridRef.current.querySelector(
          ".MuiDataGrid-virtualScroller"
        ) as HTMLElement | null;
        if (gridContainer) {
          setTimeout(() => {
            gridContainer.scrollTop = gridContainer.scrollHeight;
          }, 100);
        }
      }
    };

    if (entryHistory.length > 0) {
      scrollToBottom();
    }
  }, [entryHistory.length]);

  function calculateTotalAmount(items) {
    let total = 0;

    for (const item of items) {
      const isGram = item.uom.toLowerCase() === "gram";
      const quantity = isGram ? item.stock_qty / 1000 : item.stock_qty;
      total += quantity * item.purchased_rate;
    }

    return total;
  }

  const submitStockUpload = async () => {
    console.log(
      "loadItemWithDealer",
      loadItemWithDealer,
      "newItemWithDealer",
      newItemWithDealer
    );
    const combine = [...loadItemWithDealer, ...newItemWithDealer];

    console.log("combine", combine);
    let totalItemPrice = calculateTotalAmount(combine);
    if (totalItemPrice !== Number(dealerPurchasedPrice)) {
      toast.error(
        `The item price does not match the dealer's purchase price.`,
        {
          position: "bottom-left",
        }
      );
      return;
    }

    if (newItemWithDealer.length > 0) {
      newItemWithDealer.forEach(async (element: any) => {
        // @ts-ignore
        let response = await window.electronAPI.insertItem(element);
        if (response.status !== 201) {
          toast.error(`${response.message}`, { position: "bottom-left" });
        } else {
          // toast.success(`${response.message}`, { position: "bottom-left" });
        }
      });
    }
    if (loadItemWithDealer.length > 0) {
      loadItemWithDealer.forEach(async (element: any) => {
        // this is for already item present updating qty
        //@ts-ignore
        let response: any = await window.electronAPI.updateItem(
          element._id,
          element
        );
        if (response.status !== 200) {
          toast.error(`${response.message}`, { position: "bottom-left" });
        } else {
          // toast.success(`${response.message}`, { position: "bottom-left" });
        }
      });
    }

    let payload = {
      purchasedItemList: [...loadItemWithDealer, ...newItemWithDealer],
      dealerName: dealerDetails.dealerName,
      dealerPurchasedPrice: Number(dealerDetails.dealerPurchasedPrice),
      givenAmount: 0,
      history: [],
    };

    // @ts-ignore
    let response = await window.electronAPI.createDealerBill(payload);
    if (response.status !== 201) {
      toast.error(`${response.message}`, { position: "bottom-left" });
    } else {
      dispatch(clearDealerDetails());
      toast.success(`${response.message}`, { position: "bottom-left" });
    }
  };
  return (
    <Box sx={{ height: "100%" }}>
      {/* <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          height: "2%",
        }}
      >
        <Typography
          sx={{
            fontSize: "1.3rem",
            fontWeight: 400,
            color: "#1E1E2D",
            my: 2,
            display: "flex",
            alignItems: "center",
            gap: "3px",
            height: "30px",
          }}
        >
          Entry History
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select the Date"
            value={selectedDate}
            onChange={(newValue) => handleDateChange(newValue)}
            renderInput={(params) => (
              <TextField {...params} fullWidth size="small" />
            )}
          />
        </LocalizationProvider>
      </Box> */}

      <Box
        ref={gridRef}
        sx={{
          height: "80%",
          width: "100%",
          overflow: "hidden",
          border: "none",

          // bgcolor:"red"
        }}
      >
        <DataGrid
          // rows={entryHistory}
          rows={[...loadItemWithDealer, ...newItemWithDealer]}
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
            border: "none",
          }}
        />
      </Box>

      <Box
        sx={{
          height: "20%",
          display: "flex",
          alignItems: "flex-end",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "50%",
            justifyContent: "space-between",
          }}
        >
          <Typography>Total Item Purchased</Typography>
          <Typography>
            ₹{" "}
            {calculateTotalAmount([
              ...loadItemWithDealer,
              ...newItemWithDealer,
            ])}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            width: "50%",
            justifyContent: "space-between",
          }}
        >
          <Typography>Total Dealer Purchased</Typography>
          <Typography>₹ {dealerPurchasedPrice}</Typography>
        </Box>

        <Button
          fullWidth
          onClick={() => submitStockUpload()}
          sx={{
            pointerEvents:
              [...loadItemWithDealer, ...newItemWithDealer].length === 0
                ? "none"
                : "auto",
            opacity:
              [...loadItemWithDealer, ...newItemWithDealer].length === 0
                ? ".5"
                : "1",
          }}
        >
          Upload Stock
        </Button>
      </Box>
    </Box>
  );
};

export default ItemEntryHistory;
