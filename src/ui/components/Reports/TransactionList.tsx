import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"; // Crown icon
import CallReceivedOutlinedIcon from "@mui/icons-material/CallReceivedOutlined";
import CallMadeOutlinedIcon from "@mui/icons-material/CallMadeOutlined";
const columns = [
  {
    field: "status",
    headerName: "TYPE",
    flex: 0.5,
    renderCell: (params) => {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            justifyContent: "flex-start",

            // bgcolor:"red",
          }}
        >
          <Box
            sx={{
              height: "2rem",
              width: "2rem",

              bgcolor:
                params.value === "Increased"
                  ? "rgba(34, 179, 120, 0.2)"
                  : "rgba(255, 0, 0,.2)",
              borderRadius: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {params.value === "Increased" ? (
              <CallReceivedOutlinedIcon
                sx={{
                  fontSize: "1rem",
                  color: "green",
                }}
              />
            ) : (
              <CallMadeOutlinedIcon
                sx={{
                  fontSize: "1rem",
                  color: "red",
                }}
              />
            )}
          </Box>
        </Box>
      );
    },
    align: "left",
    headerAlign: "left",
  },
  {
    field: "name",
    headerName: "DATE",
    flex: 1,
    align: "left",
    headerAlign: "left",
    renderCell: (params) => (
      <span style={{ fontWeight: 500 }}>{params.value}</span>
    ),
  },
  {
    field: "bill_no",
    headerName: "BILL NO",
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "customer",
    headerName: "CUSTOMER",
    flex: 1,
    align: "left",
    headerAlign: "left",
  },

  {
    field: "method",
    headerName: "METHOD",
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "handler",
    headerName: "HANDLER",
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "reason",
    headerName: "REASON",
    flex: 1,
    align: "left",
    headerAlign: "left",
  },

  {
    field: "amount",
    headerName: "Amount",
    flex: 1,
    align: "left",
    headerAlign: "left",
    renderCell: (params) => {
      const isNegative = params?.value.startsWith("-");
      const color = isNegative ? "#f44336" : "green";
      return <span style={{ color: color }}>{params.value}</span>;
    },
  },
];

const rows = [
  {
    id: 1,
    status: "Increased",
    name: "2023-05-15",
    bill_no: "INV-1001",
    customer: "John Doe",
    method: "Credit Card",
    handler: "handler",
    reason: "Product Purchase",
    amount: "+1250.5",
  },
  {
    id: 2,
    status: "Increased",
    name: "2023-05-16",
    bill_no: "INV-1002",
    customer: "Jane Smith",
    method: "UPI",
    handler: "handler",
    reason: "Service Payment",
    amount: "+899.99", // Fixed: Changed "-" to "+"
  },
  {
    id: 3,
    status: "Decreased",
    name: "2023-05-17",
    bill_no: "INV-1003",
    customer: "Acme Corp",
    method: "Bank Transfer",
    handler: "admin",
    reason: "Bulk Order",
    amount: "-4200.0",
  },
  {
    id: 4,
    status: "Increased",
    name: "2023-05-18",
    bill_no: "INV-1004",
    customer: "Alice Johnson",
    method: "Cash",
    reason: "Retail Purchase",
    amount: "+750.25",
    handler: "basith",
  },
  {
    id: 5,
    status: "Decreased",
    name: "2023-05-19",
    bill_no: "INV-1005",
    customer: "Bob Brown",
    method: "Debit Card",
    reason: "Subscription Renewal",
    amount: "-299.99",
    handler: "basith",
  },
  {
    id: 6,
    status: "Increased",
    name: "2023-05-20",
    bill_no: "INV-1006",
    customer: "Charlie Davis",
    method: "Net Banking",
    reason: "Consultation Fee",
    amount: "+1500.0", // Fixed: Changed "-" to "+"
  },
  {
    id: 7,
    status: "Decreased",
    name: "2023-05-21",
    bill_no: "INV-1007",
    customer: "Diana Evans",
    method: "Credit Card",
    reason: "Refund Processed",
    amount: "-450.0", // Fixed: Removed space before "+"
  },
  {
    id: 8,
    status: "Increased",
    name: "2023-05-22",
    bill_no: "INV-1008",
    customer: "Ethan Wilson",
    method: "UPI",
    reason: "Software License",
    amount: "+899.0",
    handler: "basith",
  },
  {
    id: 9,
    status: "Decreased",
    name: "2023-05-23",
    bill_no: "INV-1009",
    customer: "Fiona Clark",
    method: "Bank Transfer",
    reason: "Service Cancellation",
    amount: "-200.0",
    handler: "basith",
  },
  {
    id: 10,
    status: "Increased",
    name: "2023-05-24",
    bill_no: "INV-1010",
    customer: "George Adams",
    method: "Cash",
    reason: "Hardware Purchase",
    amount: "+3200.5", // Fixed: Changed "-" to "+"
  },
  {
    id: 11,
    status: "Increased",
    name: "2023-05-25",
    bill_no: "INV-1011",
    customer: "Hannah White",
    method: "Debit Card",
    reason: "Membership Fee",
    amount: "+499.99", // Fixed: Changed "-" to "+"
  },
  {
    id: 12,
    status: "Decreased",
    name: "2023-05-26",
    bill_no: "INV-1012",
    customer: "Ian Scott",
    method: "Credit Card",
    reason: "Refund Issued",
    amount: "-150.75", // Fixed: Changed "+" to "-"
  },
  {
    id: 13,
    status: "Increased",
    name: "2023-05-27",
    bill_no: "INV-1013",
    customer: "Julia Green",
    method: "UPI",
    reason: "Event Tickets",
    amount: "+1200.0",
    handler: "basith",
  },
  {
    id: 14,
    status: "Decreased",
    name: "2023-05-28",
    bill_no: "INV-1014",
    customer: "Kevin Hall",
    method: "Bank Transfer",
    reason: "Cancellation Fee",
    amount: "-100.0",
    handler: "basith",
  },
  {
    id: 15,
    status: "Increased",
    name: "2023-05-29",
    bill_no: "INV-1015",
    customer: "Lily King",
    method: "Cash",
    reason: "Books Purchase",
    amount: "+450.25", // Fixed: Changed "-" to "+"
  },
  {
    id: 16,
    status: "Increased",
    name: "2023-05-30",
    bill_no: "INV-1016",
    customer: "Mike Lee",
    method: "Debit Card",
    reason: "Gadget Order",
    amount: "+2100.0", // Fixed: Changed "-" to "+"
  },
  {
    id: 17,
    status: "Decreased",
    name: "2023-05-31",
    bill_no: "INV-1017",
    customer: "Nina Patel",
    method: "Credit Card",
    reason: "Refund Processed",
    amount: "-350.5",
    handler: "basith",
  },
  {
    id: 18,
    status: "Increased",
    name: "2023-06-01",
    bill_no: "INV-1018",
    customer: "Oscar Wright",
    method: "UPI",
    reason: "Course Fee",
    amount: "+999.0",
    handler: "basith",
  },
  {
    id: 19,
    status: "Decreased",
    name: "2023-06-02",
    bill_no: "INV-1019",
    customer: "Paula Young",
    method: "Bank Transfer",
    reason: "Service Downgrade",
    amount: "-50.0", // Fixed: Changed "+" to "-"
  },
  {
    id: 20,
    status: "Increased",
    name: "2023-06-03",
    bill_no: "INV-1020",
    customer: "Quinn Harris",
    method: "Cash",
    reason: "Retail Purchase",
    amount: "+675.75",
    handler: "basith",
  },
];
const TransactionList = ({}: any) => {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      disableColumnMenu
      hideFooter
      disableSelectionOnClick
      disableColumnFilter
      disableColumnSelector
      sx={{
        border: "none",
        mt: 1,
        "& .MuiDataGrid-columnSeparator": {
          display: "none", // Removes the column separators
        },

        "& .MuiDataGrid-virtualScroller": {
          overflowX: "hidden", // Optional: hides horizontal scrollbar if not needed
        },

        "& .MuiDataGrid-columnHeader": {
          maxHeight: "50px",
          backgroundColor: "white !important",
          // color: "black",
          color: "rgba(0,0,0,.4)",
          border: "none",
        },

        "& .MuiDataGrid-columnHeaders": {
          border: "none", // Removes header bottom border
          backgroundColor: "white",
          maxHeight: "50px",
          fontSize: ".8rem",
          fontWeight: 800,
        },

        "& .MuiDataGrid-cell": {
          border: "none", // Removes cell borders,
        },
        "& .MuiDataGrid-row": {
          //   border: "none", // Removes row borders
          pt: 1,
          pb: 7,
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.02)", // Keep subtle hover effect
          },
        },
        "& .MuiDataGrid-virtualScroller": {
          overflowX: "hidden", // Cleaner scrollbar
        },
      }}
    />
  );
};

export default TransactionList;
