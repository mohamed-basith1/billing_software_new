import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { Grid, IconButton, TextField, Typography } from "@mui/material";
import {
  clearCustomerDetails,
  selectCustomerCreateModal,
  selectCustomerDetails,
  setCustomerCreateModal,
  setCustomerDetails,
} from "../../pages/CustomersPage/CustomersSlice";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";

export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  bgcolor: "background.paper",

  pt: 2,
  px: 4,
  pb: 3,
};

const CustomerCreateModal = () => {
  const dispatch = useDispatch();

  const customerDetails = useSelector(selectCustomerDetails);
  const customerCreateModal = useSelector(selectCustomerCreateModal);
  const [error, setError] = React.useState(false);

  const handleCloseCustomerCreateModal = () => {
    dispatch(setCustomerCreateModal(false));
  };

  const handleChange = (field: any, value: any) => {
    setError(false);
    //@ts-ignore
    dispatch(setCustomerDetails({ field, value }));
  };

  const handleSubmitCustomerCreate = async () => {
    if (!customerDetails.customerName.trim()) {
     
      setError(true);
      return;
    }
    setError(false);

    //@ts-ignore
    let response = await window.electronAPI.createCustomer(customerDetails);

    if (response.status !== 201) {
      toast.error(`${response.message}`, { position: "bottom-left" });
    } else {
      dispatch(clearCustomerDetails());
      toast.success(`${response.message}`, { position: "bottom-left" });
      handleCloseCustomerCreateModal();
    }
  };

  return (
    <React.Fragment>
      <Modal
        open={customerCreateModal}
        onClose={handleCloseCustomerCreateModal}
        aria-labelledby="create-modal-title"
        aria-describedby="create-modal-description"
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(2px)",
          },
        }}
      >
        <Box
          sx={{
            ...style,
            width: 500,
            p: 4,
            borderRadius: "8px",
            bgcolor: "white",
            // boxShadow: 5,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Close Button */}
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={handleCloseCustomerCreateModal}
          >
            <CloseIcon />
          </IconButton>

          <Typography sx={{ fontSize: "1.5rem", mb: 2 }}>
            Create New Customer
          </Typography>

          <Grid container spacing={2}>
            {[
              { label: "Customer Name", key: "customerName" },
              { label: "Customer Address", key: "customerAddress" },
              { label: "Customer Area", key: "customerArea" },
              {
                label: "Customer Pincode",
                key: "customerPincode",
                type: "number",
                maxLength: 6,
              },
              { label: "Customer State", key: "customerState" },
              {
                label: "Primary Contact",
                key: "customerPrimaryContact",
                type: "number",
                maxLength: 10,
              },
              {
                label: "Secondary Contact",
                key: "customerSecondaryContact",
                type: "number",
                maxLength: 10,
              },
              { label: "Customer Email", key: "customerEmail" },
            ].map(({ label, key, type, maxLength }) => (
              <Grid
                item
                xs={12}
                sm={6}
                key={key}
                sx={{ display: "flex", flexGrow: 1 }}
              >
                <TextField
                  fullWidth
                  label={label}
                  variant="outlined"
                  type={type || "text"}
                  value={customerDetails[key] || ""}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (type === "number") {
                      const sanitizedValue = value
                        .replace(/\D/g, "")
                        .slice(0, maxLength);
                      handleChange(key, sanitizedValue);
                    } else {
                      handleChange(key, value);
                    }
                  }}
                  inputProps={type === "number" ? { maxLength } : {}}
                  sx={{ height: "100%" }}
                  error={error && key === "customerName"}
                  helperText={
                    error && key === "customerName"
                      ? "Customer Name is required"
                      : ""
                  }
                />
              </Grid>
            ))}
          </Grid>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Button
              variant="outlined"
              sx={{ height: "2.2rem" }}
              onClick={handleCloseCustomerCreateModal}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              sx={{ height: "2.2rem" }}
              onClick={handleSubmitCustomerCreate}
            >
              Create
            </Button>
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default CustomerCreateModal;
