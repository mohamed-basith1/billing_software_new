import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCustomerSelectModal,
  selectCustomersList,
  setCustomerCreateModal,
  setCustomerSelectModal,
  setCustomersList,
} from "../../pages/CustomersPage/CustomersSlice";
import { handleSearchCustomer } from "../../utils/utils";
import CustomerCreateModal, { style } from "./CustomerCreateModal";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import {
  selectBillValue,
  selectCurrentTabValue,
  setBillCustomerDetails,
  setClearBill,
} from "../../pages/BillsPage/BillsSlice";
import { toast } from "react-toastify";
import { selectUserName } from "../../pages/LoginPage/LoginSlice";
const CustomerSelectModal = () => {
  const dispatch = useDispatch();
  const customerSelectModal = useSelector(selectCustomerSelectModal);
  const customersList = useSelector(selectCustomersList);
  const selectCurrentTab = useSelector(selectCurrentTabValue);
  const userName = useSelector(selectUserName);
  const selectBill = useSelector(selectBillValue);
  const customerSearchRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    customerSearchRef.current?.focus();
  }, []);

  const handleCloseCustomerSelectModal = () => {
    dispatch(setCustomerSelectModal(false));
  };
  const handleSearch = async (searchTerm: any) => {
    let response = await handleSearchCustomer(searchTerm);
    dispatch(setCustomersList(response));
  };

  const handleBillPrint = async () => {
    const selectedBill: any =
      selectBill.find((data: any) => data.bill_number === selectCurrentTab) ||
      {};

    let payload: any = {
      customer_name: selectedBill.customer_name,
      customer_id: selectedBill.customer_id,
      itemsList: selectedBill.items, // Embedding `ItemSchema`
      discount: selectedBill.discount,
      sub_amount: selectedBill.sub_amount,
      total_amount: selectedBill.total_amount,
      paid: selectedBill.paid,
      payment_method: selectedBill.payment_method,
      balance: selectedBill.balance,
      billed_by: userName,
    };
    //@ts-ignore
    let response = await window.electronAPI.createBill(payload);
    if (response.status !== 201) {
      toast.error(`${response.message}`, { position: "bottom-left" });
    } else {
      dispatch(setCustomerSelectModal(false));
      dispatch(setClearBill());
      toast.success(`${response.message}`, { position: "bottom-left" });
    }
  };

  return (
    <Modal
      open={customerSelectModal}
      onClose={handleCloseCustomerSelectModal}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
          backdropFilter: "blur(2px)", // Blur effect
        },
      }}
    >
      <Box
        sx={{
          ...style,
          width: { xs: "90%", sm: "60%", md: "40%", lg: "30%" }, // Adjust width based on screen size
          maxWidth: "500px", // Maximum width for large screens
          height: { xs: "auto", sm: "30%", md: "25%" }, // Adjust height dynamically
          minHeight: "200px", // Minimum height to avoid shrinking too much
          borderRadius: "8px",
          border: "0px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 3, // Padding for better spacing
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          Select Your Customer
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" }, // Stack in small screens
            gap: 2, // Spacing between elements
          }}
        >
          <Autocomplete
            freeSolo
            sx={{ width: "100%" }}
            options={customersList?.map((option: any) => option.customerName)}
            onInputChange={(_event, value) => handleSearch(value)}
            onChange={(_event, value) => {
              const selectedCustomer = customersList?.find(
                (data: any) => data.customerName === value
              );

              const payload: any = {
                customer_name: value,
                customer_id: selectedCustomer ? selectedCustomer.id : null,
              };
              console.log("payload action", payload);
              dispatch(setBillCustomerDetails(payload));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Customer Search"
                variant="outlined"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <SearchRoundedIcon
                          sx={{ fontSize: "1.9rem", color: "#1E1E2D" }}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <IconButton
            onClick={() => dispatch(setCustomerCreateModal(true))}
            size="small"
            sx={{ p: 0 }}
          >
            <Tooltip title="Create New Customer">
              <Box
                sx={{
                  borderRadius: "50%",
                  width: 50,
                  height: 50,
                  background: "#22b378",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PersonAddAltRoundedIcon
                  sx={{ width: 30, height: 30, color: "white" }}
                />
              </Box>
            </Tooltip>
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 2,
            mt: 2,
          }}
        >
          <Button
            variant="outlined"
            sx={{ height: "2.2rem", width: "6rem" }}
            onClick={handleCloseCustomerSelectModal}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ height: "2.2rem", width: "6rem" }}
            onClick={() => handleBillPrint()}
          >
            Print bill
          </Button>
        </Box>

        <CustomerCreateModal />
      </Box>
    </Modal>
  );
};

export default CustomerSelectModal;
