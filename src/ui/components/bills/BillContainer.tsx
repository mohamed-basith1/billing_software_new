import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import {
  selectBillValue,
  selectCurrentTabValue,
} from "../../pages/BillsPage/BillsSlice";
import BillingItems from "./BillingItems";
import BillingPrice from "./BillingPrice";
import BillingSearch from "./BillingSearch";
import CustomerSelectModal from "../modals/CustomerSelectModal";

const BillContainer = () => {
  const billsValue = useSelector(selectBillValue);
  const currentTabValue = useSelector(selectCurrentTabValue);

  const selectedBill = billsValue.find(
    (data: any) => data.bill_number === currentTabValue
  );

  return (
    <Box sx={{ height: "calc(100% - 3rem)", width: "100%" }}>
      {selectedBill && (
        <Box
          sx={{
            background: "white",
            height: "100%",
            borderRadius: "8px",
            p: 1,
            mt: 2,
            // border: ".1px solid lightgrey",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <BillingSearch />
          <BillingItems />
          <BillingPrice />
          <CustomerSelectModal />
        </Box>
      )}
    </Box>
  );
};

export default BillContainer;
