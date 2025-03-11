import React, { useEffect, useRef, useState } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { Box, Typography } from "@mui/material";
import { toast } from "react-toastify";

import utc from "dayjs/plugin/utc";
import { DataGrid } from "@mui/x-data-grid";
import { selectDateTigger } from "../../pages/ItemsPage/ItemsSlice";
import { useSelector } from "react-redux";

dayjs.extend(utc);

const columns = [
  { field: "code", headerName: "CODE", flex: 3 },
  { field: "item_name", headerName: "ITEM NAME", flex: 3 },
  { field: "stock_qty", headerName: "QTY", flex: 3 },
  { field: "uom", headerName: "UOM", flex: 3 },
  { field: "rate", headerName: "RATE", flex: 3 },
  {
    field: "item_expiry_date",
    headerName: "EXPIRY DATE",
    flex: 3,
    renderCell: (params: any) => new Date(params.value).toLocaleDateString(),
  },
];

const ItemEntryHistory = () => {
  const [entryHistory, setEntryHistory] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const gridRef = useRef<HTMLDivElement | null>(null);

  const dateTigger = useSelector(selectDateTigger); // Unused, consider removing it if not needed

  // 📌 Handle Date Selection & API Call (Only when Date Changes)
  const handleDateChange = async (date: Dayjs | null) => {
    if (!date) return;

    const formattedDate = date
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
        toast.warning("No items found for the selected date.", {
          position: "bottom-left",
        });
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
      handleDateChange(selectedDate);
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
  return (
    <Box sx={{ height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
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
      </Box>

      <Box
        ref={gridRef}
        sx={{ height: "90%", width: "100%", overflow: "hidden" }}
      >
        <DataGrid
          rows={entryHistory}
          columns={columns}
          disableColumnMenu
          hideFooter
          sx={{
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#1E1E2D !important",
              color: "white",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ItemEntryHistory;
