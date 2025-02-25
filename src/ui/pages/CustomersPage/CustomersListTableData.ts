import { Box, Button, Typography } from "@mui/material";

export const columns = [
  {
    field: "customerName",
    headerName: "CUSTOMER NAME",
    flex: 2,
  },

  {
    field: "customerPrimaryContact",
    headerName: "CONTACT NUMBER 1",
    flex: 1,
  },
  {
    field: "customerSecondaryContact",
    headerName: "CONTACT NUMBER 2",
    flex: 1,
  },
  {
    field: "customerEmail",
    headerName: "EMAIL",
    flex: 1,
  },
  { field: "customerAddress", headerName: "ADDRESS", flex: 1 },
  { field: "customerArea", headerName: "AREA", flex: 1 },
  { field: "customerPincode", headerName: "PINCODE", flex: 1 },
  {
    field: "customerState",
    headerName: "STATE",
    flex: 1,
  },
  {
    field: "action",
    headerName: "ACTION",
    flex: 1,
  },
];
