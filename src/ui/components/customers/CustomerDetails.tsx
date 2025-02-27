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
  selectSelectedCustomer,
  setCustomerDeleteModal,
  setCustomerDetails,
  setCustomerEditModal,
} from "../../pages/CustomersPage/CustomersSlice";
import { colorsList } from "../../utils/utils";

const purchaseHistoryColumn: any = [
  {
    field: "bill_no",
    headerName: "PRODUCT",
    flex: 1,

    align: "left",
    headerAlign: "left",
  },
  {
    field: "price",
    headerName: "PRICE",
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
              background: "rgb(180,228,201)",
              textAlign: "center",
              padding: "4px 15px",
              borderRadius: "8px",
            }}
          >
            ₹{params.row.price}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: "date",
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
              height: "50%",
              width: "100%",
              display: "flex",
              mt: 5,
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
            <Box sx={{ width: "100%", mt: 5 }}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {customerDetails.map((detail, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      gap: "10px",
                      minWidth: "45%",
                      flex: "1 1 45%",
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
            sx={{ height: "45%", width: "100%", display: "flex", mt: 3, pb: 3 }}
          >
            <DataGrid
              rows={purchaseHistoryRow}
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
