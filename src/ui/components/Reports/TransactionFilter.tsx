import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { setTransactionData } from "../../pages/ReportPage/ReportsSlice";
import { useDispatch } from "react-redux";
import utc from "dayjs/plugin/utc";

import timezone from "dayjs/plugin/timezone";
const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 100,
    color: "rgb(55, 65, 81)",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "6px 0",
    },
  },
}));

export default function CustomizedMenus() {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [dateDialogOpen, setDateDialogOpen] = React.useState(false);
  const [fromDate, setFromDate] = React.useState<Dayjs | null>(
    dayjs().tz("Asia/Kolkata").subtract(1, "month")
  );
  const [toDate, setToDate] = React.useState<Dayjs | null>(
    dayjs().tz("Asia/Kolkata")
  );
  const [activeFilter, setActiveFilter] = React.useState<string | null>(
    "Last 10 Transaction"
  );
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLastTransaction = () => {
    setActiveFilter("Last 10 Transaction");
    const getLastTenTransaction = async () => {
      //@ts-ignore
      let response: any =
        await window.electronAPI.getLast10TransactionHistory();

      dispatch(setTransactionData(response.data));
    };
    getLastTenTransaction();
    handleClose();
  };
  const handleFilterSelect = (range: string) => {
    const today = dayjs().tz("Asia/Kolkata");
    let newFromDate = today;
    // const istDate = dayjs(newValue).tz("Asia/Kolkata");
    switch (range) {
      case "today":
        newFromDate = today.startOf("day");
        setToDate(today.endOf("day"));
        setActiveFilter("today");
        break;
      case "1 month":
        newFromDate = today.subtract(1, "month");
        setActiveFilter("1 month");
        break;
      case "3 month":
        newFromDate = today.subtract(3, "month");
        setActiveFilter("3 month");
        break;
      case "6 month":
        newFromDate = today.subtract(6, "month");
        setActiveFilter("6 month");
        break;
      default:
        break;
    }

    const getFilterTransaction = async (from, to) => {
      //@ts-ignore
      let response: any = await window.electronAPI.getTransactionHistory(
        from,
        to
      );

      dispatch(setTransactionData(response.data));
    };
    getFilterTransaction(
      dayjs.utc(newFromDate).tz("Asia/Kolkata").add(1, "day").toISOString(),
      dayjs.utc(today).tz("Asia/Kolkata").add(1, "day").toISOString()
    );

    setFromDate(newFromDate);
    setToDate(today);
    handleClose();

    // Here you can trigger your data filtering logic
    console.log(`Filter: ${range}`, {
      from: newFromDate.format("YYYY-MM-DD"),
      to: today.format("YYYY-MM-DD"),
    });
  };
  const handleDateRangeSelect = () => {
    setDateDialogOpen(true);
    console.log("fromDate", fromDate, "toDate", toDate);
    handleClose();
  };

  const handleDateDialogClose = () => {
    setDateDialogOpen(false);
  };

  const handleApplyDateRange = () => {
    const getFilterTransaction = async (from, to) => {
      //@ts-ignore
      let response: any = await window.electronAPI.getTransactionHistory(
        from,
        to
      );

      dispatch(setTransactionData(response.data));
    };

    getFilterTransaction(
      dayjs.utc(fromDate).tz("Asia/Kolkata").add(1, "day").toISOString(),
      dayjs.utc(toDate).tz("Asia/Kolkata").add(1, "day").toISOString()
    );

    setActiveFilter(
      `${fromDate?.format("DD/MM/YYYY")} - ${toDate?.format("DD/MM/YYYY")}`
    );
    setDateDialogOpen(false);
  };

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{ height: "1rem", p: 2 }}
      >
        Filter {activeFilter && `(${activeFilter})`}
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => handleLastTransaction()}
          disableRipple
          selected={activeFilter === "Last 10 Transaction"}
        >
          Last 15 Transaction
        </MenuItem>
        <MenuItem
          onClick={() => handleFilterSelect("today")}
          disableRipple
          selected={activeFilter === "today"}
        >
          Today
        </MenuItem>
        <MenuItem
          onClick={() => handleFilterSelect("1 month")}
          disableRipple
          selected={activeFilter === "1 month"}
        >
          1 Month
        </MenuItem>
        <MenuItem
          onClick={() => handleFilterSelect("3 month")}
          disableRipple
          selected={activeFilter === "3 month"}
        >
          3 Month
        </MenuItem>
        <MenuItem
          onClick={() => handleFilterSelect("6 month")}
          disableRipple
          selected={activeFilter === "6 month"}
        >
          6 Month
        </MenuItem>
        <MenuItem
          onClick={handleDateRangeSelect}
          disableRipple
          selected={activeFilter === "custom"}
        >
          By Date
        </MenuItem>
      </StyledMenu>

      {/* Date Range Picker Dialog */}
      <Dialog open={dateDialogOpen} onClose={handleDateDialogClose}>
        <DialogTitle>Select Date Range</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: "flex", gap: 2, mt: 2, mb: 2 }}>
              <DatePicker
                label="From Date"
                value={fromDate}
                onChange={(newValue) => {
                  const istDate = dayjs(newValue).tz("Asia/Kolkata");
                  console.log("Selected IST date:", istDate.format()); // or .toISOString() if needed
                  return setFromDate(istDate);
                }}
                maxDate={toDate || undefined}
              />
              <DatePicker
                label="To Date"
                value={toDate}
                onChange={(newValue) =>
                  setToDate(dayjs(newValue).tz("Asia/Kolkata"))
                }
                minDate={fromDate || undefined}
              />
            </Box>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDateDialogClose}>Cancel</Button>
          <Button onClick={handleApplyDateRange} variant="contained">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
