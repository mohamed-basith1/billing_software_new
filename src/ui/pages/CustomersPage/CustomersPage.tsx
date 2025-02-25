import Box from "@mui/material/Box";
import CustomersTabs from "./CustomersTabs";
import CustomersList from "./CustomersList";
import CustomersCreate from "./CustomersCreate";
import { useDispatch, useSelector } from "react-redux";
import { clearCustomerDetails, selectCurrentTab } from "./CustomersSlice";
import CustomerEditModal from "../../components/modals/CustomerEditModal";
import DeleteModal from "../../components/modals/DeleteModal";
import { useEffect } from "react";

export default function CustomersPage() {
  const currentTab = useSelector(selectCurrentTab);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearCustomerDetails());
    };
  }, []);
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
      <CustomersTabs />
      {currentTab === 0 ? <CustomersList /> : <CustomersCreate />}
      <CustomerEditModal />
      <DeleteModal />
    </Box>
  );
}
