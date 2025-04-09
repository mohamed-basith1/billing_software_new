import { Box } from "@mui/material";
import React from "react";

const Transaction = () => {
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
    ></Box>
  );
};

export default Transaction;
