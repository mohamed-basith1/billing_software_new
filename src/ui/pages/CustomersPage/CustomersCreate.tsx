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
import customerImage from "../../assets/Image/Illustrate/customer.png";
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

  const handleChange = (field: any, value: any) => {
    setError(false);
    //@ts-ignore
    dispatch(setCustomerDetails({ field, value }));
  };

  return (
    <Box
      sx={{
        height: "calc(100% - 3.5rem)",
        width: "100%",
        background: "white",
        // boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        border: ".1px solid lightgrey",
        borderRadius: "8px",
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        mt: 3,
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
      <Box sx={{ height: "calc(100% - 4rem)", width: "100%", display: "flex" }}>
        <Box
          sx={{
            height: "100%",
            width: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            mt: 5,
          }}
        >
          <Grid container spacing={2} sx={{ height: "60%" }}>
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
                      // Remove non-numeric characters and limit length
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
            sx={{ bgcolor: "#1E1E2D" }}
            onClick={handleSubmit}
          >
            Create Customer
          </Button>
        </Box>

        {/* Image Section */}
        <Box
          sx={{
            height: "100%",
            width: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={customerImage} style={{ height: "60%" }} />
        </Box>
      </Box>
    </Box>
  );
};

export default CustomersCreate;
