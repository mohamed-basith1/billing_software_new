import { useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import {
  clearCustomerDetails,
  selectCustomerDetails,
  setCustomerDetails,
} from "./CustomersSlice";
import { useDispatch, useSelector } from "react-redux";
import customerImage from "../../assets/Image/illustrate/customer.png";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { toast } from "react-toastify";
const CustomersCreate = () => {
  const dispatch = useDispatch();
  const customerDetails = useSelector(selectCustomerDetails);
  const [error, setError] = useState(false);
  const sanitizedData = JSON.parse(JSON.stringify(customerDetails));
  const handleSubmit = async () => {
    if (!customerDetails.customerName.trim()) {
      setError(true);
      return;
    }
    setError(false);

    //@ts-ignore
    let response = await window.electronAPI.createCustomer(sanitizedData);

    if (response.status !== 201) {
      toast.error(`${response.message}`, { position: "bottom-left" });
    } else {
      dispatch(clearCustomerDetails());
      toast.success(`${response.message}`, { position: "bottom-left" });
    }
  };



  function isCustomerDataValid(state) {
    const requiredFields = [
      "customerName",
      // "customerAddress",
      // "customerPrimaryContact",
    ];

    // Check required fields are non-empty
    const areRequiredFieldsFilled = requiredFields.every(
      (field) => state[field] && state[field].trim() !== ""
    );

    // Check primary and secondary contact numbers (if present) are exactly 10 digits
    const isPrimaryContactValid =
      state.customerPrimaryContact &&
      state.customerPrimaryContact.trim().length === 10;

    const isSecondaryContactValid =
      !state.customerSecondaryContact || // allow empty
      state.customerSecondaryContact.trim().length === 10;

    // Check pincode (if present) is exactly 6 digits
    const isPincodeValid =
      !state.customerPincode || state.customerPincode.trim().length === 6;

    return (
      areRequiredFieldsFilled &&
      isPrimaryContactValid &&
      isSecondaryContactValid &&
      isPincodeValid
    );
  }


  const handleChange = (field: any, value: any) => {
    setError(false);
    //@ts-ignore
    dispatch(setCustomerDetails({ field, value }));
  };

  return (
    <Box
      sx={{
        height: "calc(100% - 3rem)",
        width: "100%",
        background: "white",
        // border: ".1px solid lightgrey",
        borderRadius: "8px",
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        mt: 2,
        overflow: "hidden",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          width: "100%",
          height: "3rem",
        }}
      >
        <Typography
          sx={{ fontSize: "2rem", fontWeight: 400, color: "#1E1E2D" }}
        >
          Create Customer
        </Typography>
        <Typography sx={{ fontSize: "0.8rem", fontWeight: 400, pt: 1 }}>
          Quickly Register New Customers for Better Service 😊
        </Typography>

        {/* Avatar Group */}
        <AvatarGroup
          max={4}
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {[...Array(5)].map((_, index) => (
            <Avatar
              key={index}
              sx={{
                bgcolor: "white",
                boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <PersonOutlineIcon sx={{ color: "#22b378" }} />
            </Avatar>
          ))}
        </AvatarGroup>
      </Box>

      {/* Form Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // Responsive layout
          gap: 3,
          height: "100%",
        }}
      >
        <Box
          sx={{
            flexBasis: "50%",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            mt: { xs: 2, md: 5 },
          }}
        >
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
              // { label: "Company Name", key: "customerCompanyName" },
              // { label: "Customer GST Number", key: "customerGSTNumber" },
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

          {/* Submit Button */}
          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "#1E1E2D",
              mt: 2,
              pointerEvents:
                isCustomerDataValid(customerDetails) === false
                  ? "none"
                  : "auto",
              opacity:
                isCustomerDataValid(customerDetails) === false ? ".5" : "1",
            }}
            onClick={handleSubmit}
          >
            Create Customer
          </Button>
        </Box>

        {/* Image Section */}
        <Box
          sx={{
            flexBasis: "50%",
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={customerImage}
            alt="Customer"
            style={{
              maxHeight: "60%",
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CustomersCreate;
