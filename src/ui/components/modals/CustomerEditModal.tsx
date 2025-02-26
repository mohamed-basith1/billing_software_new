import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { Grid, TextField, Typography } from "@mui/material";
import {
  clearCustomerDetails,
  selectCustomerDetails,
  selectCustomerEditModal,
  setCustomerDetails,
  setCustomerEditModal,
  setSelectedCustomer,
} from "../../pages/CustomersPage/CustomersSlice";

import { toast } from "react-toastify";

export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  // boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const CustomerEditModal = () => {
  const dispatch = useDispatch();
  const customerDetails = useSelector(selectCustomerDetails);
  const customerEditModal = useSelector(selectCustomerEditModal);
  const [error, setError] = React.useState(false);

  const handleCloaseCustomerEditModal = () => {
    dispatch(setCustomerEditModal(false));
  };

  const handleChange = (field: any, value: any) => {
    setError(false);
    //@ts-ignore
    dispatch(setCustomerDetails({ field, value }));
  };

  const handleEditSubmit = async () => {
    if (!customerDetails.customerName.trim()) {
      setError(true);
      return;
    }
    setError(false);

    //@ts-ignore
    let response: any = await window.electronAPI.updateCustomer(
      customerDetails.id,
      customerDetails
    );

    if (response.status !== 200) {
      toast.error(`${response.message}`, { position: "bottom-left" });
    } else {
      let payload: any = { data: response?.data, edit: true };
      dispatch(setSelectedCustomer(payload));
      dispatch(clearCustomerDetails());
      toast.success(`${response.message}`, { position: "bottom-left" });
      handleCloaseCustomerEditModal();
    }
  };

  return (
    <React.Fragment>
      <Modal
        open={customerEditModal}
        onClose={handleCloaseCustomerEditModal}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
            backdropFilter: "blur(3px)", // Slight blur effect
          },
        }}
      >
        <Box
          sx={{
            ...style,
            width: 500,
            p: 4,
            borderRadius: "12px",
            bgcolor: "white",
            boxShadow: 5,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            id="edit-modal-title"
            sx={{
              fontSize: "1.4rem",
              fontWeight: 500,
              color: "#1E1E2D",
              textAlign: "center",
              mb: 5,
            }}
          >
            Edit Customer Details
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
              <Grid item xs={12} sm={6} key={key}>
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
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}
          >
            <Button
              variant="outlined"
              onClick={handleCloaseCustomerEditModal}
              sx={{
                height: "2.5rem",
                width: "100px",
                borderRadius: "8px",
                color: "#555",
                borderColor: "#bbb",
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleEditSubmit}
              sx={{
                height: "2.5rem",
                width: "100px",
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default CustomerEditModal;
