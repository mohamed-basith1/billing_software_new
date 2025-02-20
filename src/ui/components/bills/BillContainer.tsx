import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { selectBillValue, selectCurrentTabValue } from "../../pages/BillsPage/BillsSlice";
import BillingItems from "./BillingItems";
import BillingPrice from "./BillingPrice";
import BillingSearch from "./BillingSearch";

const BillContainer = () => {
  const billsValue = useSelector(selectBillValue);
  const currentTabValue = useSelector(selectCurrentTabValue);
  
  const selectedBill = billsValue.find((data: any) => data.bill_number === currentTabValue);

  return (
    <Box sx={{ height: "calc(100% - 4.5rem)", width: "100%" }}>
      {selectedBill && (
        <Box
          sx={{
            background: "white",
            height: "100%",
            borderRadius: "8px",
            p: 1,
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.05)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <BillingSearch billingSearch={selectedBill} />
          <BillingItems billingItems={selectedBill} />
          <BillingPrice billingPrice={selectedBill} />
        </Box>
      )}
    </Box>
  );
};

export default BillContainer;
