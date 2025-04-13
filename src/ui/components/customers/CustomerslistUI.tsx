import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Typography,
} from "@mui/material";
import { useEffect, useRef } from "react";
import {
  selectCustomerSearch,
  selectCustomersList,
  selectSelectedCustomer,
  setCustomerSearch,
  setCustomersList,
  setSelectedCustomer,
} from "../../pages/CustomersPage/CustomersSlice";
import { useDispatch, useSelector } from "react-redux";
import { colorsList, handleSearchCustomer } from "../../utils/utils";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

const CustomerslistUI = () => {
  const dispatch = useDispatch();
  const customerSearch = useSelector(selectCustomerSearch);
  const customersList = useSelector(selectCustomersList);
  const selectedCustomer = useSelector(selectSelectedCustomer);
  const customerSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    customerSearchRef.current?.focus();
    const handleGetCustomerAPI = async () => {
      //@ts-ignore
      let response = await window.electronAPI.getCustomers();
      dispatch(setCustomersList(response.data));
    };
    if (customerSearch === "") {
      handleGetCustomerAPI();
    }
  }, [customerSearch]);

  const handleSearch = async (data: any) => {
    dispatch(setCustomerSearch(data));
    let response = await handleSearchCustomer(customerSearch);
    dispatch(setCustomersList(response));
  };
  return (
    <Box
      sx={{
        width: "40%",
        p: 2,
        // borderRadius: "8px",
        // border: ".1px solid lightgrey",
        bgcolor: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start", // Aligns content at the top
        // mr: 2,
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
      
          // p: 2,
        }}
      >
        <TextField
          // label="Customer Search"
          placeholder="Customer Search"
          variant="outlined"
          sx={{
            width: "100%",
            p: 0.5,
            background: "#F7F7FE",
            borderRadius: "8px",

            "& .MuiOutlinedInput-notchedOutline": {
              border: "0px solid lightgrey !important",
              borderRadius: "8px",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "0px solid lightgrey !important",
              borderRadius: "8px",
            },
          }}
          value={customerSearch}
          size="small"
          inputRef={customerSearchRef}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton edge="start">
                  <SearchRoundedIcon
                    sx={{ fontSize: "1.9rem", color: "#1E1E2D", p: 0 }}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* List Container */}
      <Box
        sx={{
          // Enables scrolling when needed
          display: "flex",
          flexDirection: "column",
          overflow: "scroll",
        }}
      >
        {customersList?.map((data: any, index: any) => (
          <Box
            onClick={() =>
              dispatch(setSelectedCustomer({ index: index, ...data }))
            }
            key={index}
            sx={{
              width: "100%",
              borderBottom:
                selectedCustomer?.id === data.id
                  ? "0px"
                  : ".1px solid lightgrey",
              mt: 2,
              p: 1,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              bgcolor:
                selectedCustomer?.id === data.id
                  ? "rgba(30, 30, 45, 1)"
                  : "#FFF",
              color: selectedCustomer?.id === data?.id ? "white" : "",
              borderRadius: "8px",
            }}
          >
            <Avatar
              sx={{
                background: colorsList[index % colorsList.length],
                height: "2rem",
                width: "2rem",
              }}
              alt={data.customerName}
            />
            <Box sx={{ width: "100%" }}>
              <Typography
                sx={{
                  fontWeight: 400,
                  mb: 0.5,
                  textTransform: "capitalize",
                }}
              >
                {data.customerName}
              </Typography>
              <Typography sx={{ fontSize: ".6rem !important" }}>
                {data.customerPrimaryContact}
              </Typography>
            </Box>
            <KeyboardArrowRightRoundedIcon sx={{ fontSize: "1.5rem" }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CustomerslistUI;
