import { Box } from "@mui/material";
import React from "react";
import PaymentsTabs from "./PaymentsTabs";
import { useSelector } from "react-redux";
import { selectCurrentPaymentsTab } from "./PaymentsSlice";
import PaymentsUPI from "./PaymentsUPI";
import PaymentsCash from "./PaymentsCash";
import PaymentsCredit from "./PaymentsCredit";

import PayCreditBillModal from "../../components/modals/PayCreditBillModal";
import ReturnBillHistoryModal from "../../components/modals/ReturnBillModal";
import PaymentsSelfUse from "./PaymentsSelfUse";

const PaymentsPage = () => {
  const currentTab = useSelector(selectCurrentPaymentsTab);
  console.log("render in payment");
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <PaymentsTabs />

      {currentTab === 0 ? (
        <PaymentsCash />
      ) : currentTab === 1 ? (
        <PaymentsUPI />
      ) : currentTab === 2 ? (
        <PaymentsCredit />
      ) : (
        <PaymentsSelfUse />
      )}
      <PayCreditBillModal />
      <ReturnBillHistoryModal />
    </Box>
  );
};

export default React.memo(PaymentsPage);
