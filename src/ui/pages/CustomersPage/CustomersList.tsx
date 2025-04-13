import { Box } from "@mui/material";
import CustomerDetails from "../../components/customers/CustomerDetails";
import CustomerslistUI from "../../components/customers/CustomerslistUI";

const CustomersList = () => {
  return (
    <Box
      sx={{
        height: "calc(100% - 3rem)",
        width: "100%",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          width: "100%",
          overflowY: "auto", // Enables scrolling if needed
          mt: 2,
          display: "flex",
          justifyContent: "space-between",
          // gap: "10px",
          height: "100%",
          borderRadius:"8px",
        }}
      >
        {/* Left Container */}
        <CustomerslistUI />
        {/* Right Container */}
        <CustomerDetails />
      </Box>
    </Box>
  );
};

export default CustomersList;
