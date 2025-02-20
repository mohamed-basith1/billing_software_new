import { Box } from "@mui/material";
import Tabs from "../../components/bills/Tabs";
import BillContainer from "../../components/bills/BillContainer";

const BillsPage = () => {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Dynamic tabs for bill */}
      <Tabs />
      {/* Item search */}
      
      {/* Billing Component */}
      <BillContainer />
    </Box>
  );
};

export default BillsPage;
