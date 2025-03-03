import AddLocationRoundedIcon from "@mui/icons-material/AddLocationRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import LocalPostOfficeRoundedIcon from "@mui/icons-material/LocalPostOfficeRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCustomerBillHistory,
  selectSelectedCustomer,
  setCustomerBillHistory,
  setCustomerDeleteModal,
  setCustomerDetails,
  setCustomerEditModal,
} from "../../pages/CustomersPage/CustomersSlice";
import { colorsList, getTotalAmount } from "../../utils/utils";
import { useEffect } from "react";
import { toast } from "react-toastify";

const purchaseHistoryColumn: any = [
  {
    field: "bill_number",
    headerName: "BILL NO",
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "total_amount",
    headerName: "TOTAL AMOUNT",
    flex: 1,
    align: "center",
    headerAlign: "center",
    renderCell: (params: any) => {
      return (
        <Box
          sx={{
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography
            sx={{
              // background: "rgb(180,228,201)",
              // textAlign: "center",
              padding: "4px 15px",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {params.row.total_amount}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: "amount_paid",
    headerName: "PAID",
    flex: 1,
    align: "center",
    headerAlign: "center",
    renderCell: (params: any) => {
      return (
        <Box
          sx={{
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography
            sx={{
              // background: "rgb(180,228,201)",
              // textAlign: "center",
              padding: "4px 15px",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {params.row.amount_paid}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: "balance",
    headerName: "BALANCE",
    flex: 1,
    align: "center",
    headerAlign: "center",
    renderCell: (params: any) => {
      return (
        <Box
          sx={{
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography
            sx={{
              // background: "rgba(193,9,21,.7)",
              // color: "white",
              padding: "4px 15px",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {params.row.balance}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: "createdAt",
    headerName: "DATE",
    flex: 1,
    align: "right",
    headerAlign: "right",
  },
];

const purchaseHistoryRow = [
  {
    id: 1,
    bill_no: "Bill No",
    price: "100",
    date: "24/02/2025",
  },
  {
    id: 2,
    bill_no: "Bill No",
    price: "100",
    date: "24/02/2025",
  },
  {
    id: 3,
    bill_no: "Bill No",
    price: "100",
    date: "24/02/2025",
  },
  {
    id: 4,
    bill_no: "Bill No",
    price: "100",
    date: "24/02/2025",
  },
  {
    id: 5,
    bill_no: "Bill No",
    price: "100",
    date: "24/02/2025",
  },
  {
    id: 6,
    bill_no: "Bill No",
    price: "100",
    date: "24/02/2025",
  },
  {
    id: 7,
    bill_no: "Bill No",
    price: "100",
    date: "24/02/2025",
  },
  {
    id: 8,
    bill_no: "Bill No",
    price: "100",
    date: "24/02/2025",
  },
  {
    id: 9,
    bill_no: "Bill No",
    price: "100",
    date: "24/02/2025",
  },
  {
    id: 10,
    bill_no: "Bill No",
    price: "100",
    date: "24/02/2025",
  },
  {
    id: 11,
    bill_no: "Bill No",
    price: "100",

    date: "24/02/2025",
  },
  {
    id: 12,
    bill_no: "Bill No",
    price: "100",
    date: "24/02/2025",
  },
];

const CustomerDetails = () => {
  const selectedCustomer = useSelector(selectSelectedCustomer);
  const customerBillHistory = useSelector(selectCustomerBillHistory);

  useEffect(() => {
    const fetchCustomerBillHistoryHandle = async () => {
      //@ts-ignore
      let response = await window.electronAPI.getCustomerBillHistory(
        selectedCustomer.id
      );
      if (response.status !== 200) {
        toast.error(`${response.message}`, { position: "bottom-left" });
      } else {
        dispatch(setCustomerBillHistory(response.data));
        console.log("response data for customer bill history", response.data);
      }
    };
    if (selectedCustomer) {
      fetchCustomerBillHistoryHandle();
    }
  }, [selectedCustomer]);
  const dispatch = useDispatch();
  const customerDetails = [
    {
      icon: <PhoneIphoneRoundedIcon />,
      label: "Primary Number",
      value: selectedCustomer?.customerPrimaryContact,
    },
    {
      icon: <LocalPhoneRoundedIcon />,
      label: "Secondary Number",
      value: selectedCustomer?.customerSecondaryContact,
    },
    {
      icon: <HomeRoundedIcon />,
      label: "Address",
      value: selectedCustomer?.customerAddress,
    },
    {
      icon: <AddLocationRoundedIcon />,
      label: "Area",
      value: selectedCustomer?.customerArea,
    },
    {
      icon: <PublicRoundedIcon />,
      label: "State",
      value: selectedCustomer?.customerState,
    },
    {
      icon: <LocalPostOfficeRoundedIcon />,
      label: "Pincode",
      value: selectedCustomer?.customerPincode,
    },
  ];

  const handleEdit = () => {
    dispatch(setCustomerDetails(selectedCustomer));
    dispatch(setCustomerEditModal(true));
  };
  const handleDelete = () => {
    dispatch(setCustomerDetails(selectedCustomer));
    dispatch(setCustomerDeleteModal(true));
  };
  return (
    <Box
      sx={{
        height: "100%",
        width: "60%",
        minWidth: "400px",
        maxWidth: "900px",
        p: 2,
        borderRadius: "8px",
        border: ".1px solid lightgrey",
        bgcolor: "white",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",

        "@media (max-width: 1024px)": {
          width: "90%", // Adjust for smaller laptops
        },
        "@media (max-width: 768px)": {
          width: "100%", // Adjust for tablets
        },
      }}
    >
      <Typography sx={{ fontSize: "1.8rem", fontWeight: 400 }}>
        Customer Details
      </Typography>

      {selectedCustomer ? (
        <>
          <Box
            sx={{
              height: "40%",
              width: "100%",
              display: "flex",
              mt: 3,
              flexDirection: "column",
            }}
          >
            {/* Header Name and Email */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{
                  background:
                    colorsList[selectedCustomer?.index % colorsList.length],
                  height: "5rem",
                  width: "5rem",
                }}
                alt={selectedCustomer?.customerName}
              />
              <Box sx={{ width: "100%", pl: 2 }}>
                <Typography
                  sx={{
                    fontWeight: 400,
                    mb: 0.5,
                    textTransform: "capitalize",
                    fontSize: "1.2rem",
                  }}
                >
                  {selectedCustomer?.customerName}
                </Typography>
                <Typography sx={{ fontSize: ".8rem !important" }}>
                  {selectedCustomer?.customerEmail}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: "10px" }}>
                <Button
                  variant="outlined"
                  sx={{ height: "2.2rem" }}
                  onClick={() => handleEdit()}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleDelete()}
                  sx={{
                    height: "2.2rem",
                    bgcolor: "rgb(193,9,21)",
                    "&:hover": { bgcolor: "rgb(193,9,21)" },
                    "&:focus, &:focus-visible, &.Mui-focusVisible": {
                      outline: "none",
                    },
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Box>

            {/* Address & Other Details */}
            <Box sx={{ width: "100%", mt: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                  bgcolor: "#F7F7FE",
                  p: 3,
                  borderRadius: "8px",
                  border: ".1px solid lightgrey",
                }}
              >
                {customerDetails.map((detail, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      gap: "10px",
                      minWidth: "35%",
                      flex: "1 1 35%",
                    }}
                  >
                    {detail.icon}
                    <Box sx={{ width: "90%" }}>
                      <Typography sx={{ fontWeight: 500, mb: 1 }}>
                        {detail.label}
                      </Typography>
                      <Typography sx={{ fontSize: ".8rem" }}>
                        {detail.value}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              height: "50%",
              width: "100%",
              display: "flex",
              mt: 3.5,
              pb: 3,
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                gap: "10px",

                py: 3,
              }}
            >
              <Box
                sx={{ display: "flex", flexDirection: "column", p: 1, pb: 0 }}
              >
                <Typography sx={{ fontSize: ".7rem" }}>
                  Total Bill Amount
                </Typography>
                <Typography sx={{ fontSize: "1.2rem", fontWeight: 600 }}>
                  ₹{getTotalAmount(customerBillHistory, "total_amount")}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", flexDirection: "column", p: 1, pb: 0 }}
              >
                <Typography sx={{ fontSize: ".7rem" }}>
                  Total Paid Amount
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1.2rem",
                    color: "rgb(30, 120, 80)",
                    fontWeight: 600,
                  }}
                >
                  ₹{getTotalAmount(customerBillHistory, "amount_paid")}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", flexDirection: "column", p: 1, pb: 0 }}
              >
                <Typography sx={{ fontSize: ".7rem" }}>
                  Total Pending Amount
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1.2rem",
                    color: "rgb(193,9,21)",
                    fontWeight: 600,
                  }}
                >
                  ₹{getTotalAmount(customerBillHistory, "balance")}
                </Typography>
              </Box>
            </Box>
            <DataGrid
              rows={customerBillHistory}
              columns={purchaseHistoryColumn}
              disableColumnMenu
              hideFooter
              sx={{
                "& .MuiDataGrid-columnHeader": { color: "black" },
                border: "1px solid white",
              }}
            />
          </Box>
        </>
      ) : (
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>Select Your Customer</Typography>
        </Box>
      )}
    </Box>
  );
};

export default CustomerDetails;
