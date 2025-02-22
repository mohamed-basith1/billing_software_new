import { Box, Button, TextField, Typography } from "@mui/material";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  selectCurrentTabValue,
  selectBillValue,
} from "../../pages/BillsPage/BillsSlice";

const BillingPrice = () => {
  const selectCurrentTab = useSelector(selectCurrentTabValue);
  const selectBill = useSelector(selectBillValue);
  const dispatch = useDispatch();

  const [selected, setSelected] = React.useState<string | null>(null);
  const [discount, setDiscount] = React.useState(0);

  const filteredBill =
    selectBill
      .find((data: any) => data.bill_number === selectCurrentTab)
      ?.items.map((item: any, index: number) => ({
        ...item,
        no: index + 1, // Adding index starting from 1
      })) || [];

  const subAmount = filteredBill.reduce(
    (total: any, item: any) => total + item.amount,
    0
  );
  const TotalAmount = subAmount - discount;

  console.log(
    "item List",
    filteredBill,
    "subAmount",
    subAmount,
    "TotalAmount",
    TotalAmount
  );

  const handleChange = (paymentType: string) => {
    setSelected((prev) => (prev === paymentType ? null : paymentType)); // Toggle selection
  };

  const generateInvoicePDF = (items, subAmount, discount, TotalAmount) => {
    const doc = new jsPDF();

    // Company Name (Centered Top)
    doc.setFontSize(16);
    doc.text("Your Company Name", 105, 15, { align: "center" });

    // Invoice Details (Left)
    doc.setFontSize(13);
    doc.text(`Invoice No`, 14, 25);

    doc.setFontSize(10);
    doc.text(`Invoice No`, 14, 31);
    doc.text(`${new Date().getTime()}`, 34, 31);
    doc.text(`Issue Date`, 14, 37);
    doc.text(`${new Date().toLocaleDateString()}`, 34, 37);

    // From Company Details
    doc.text("From:", 14, 45);
    doc.text("Your Company Name", 14, 50);
    doc.text("123 Street, City, Country", 14, 55);
    doc.text("Phone: +91 9876543210", 14, 60);

    // Customer Details (Right)
    doc.text("To:", 195, 45, { align: "right" });
    doc.text("Customer Name", 195, 50, { align: "right" });
    doc.text("Customer Address", 195, 55, { align: "right" });
    doc.text("Phone: +91 9876543210", 195, 60, { align: "right" });

    // Table Headers
    const headers = [
      ["NO", "CODE", "ITEM NAME", "QUANTITY", "UOM", "RATE", "AMOUNT"],
    ];

    // Table Data
    const rows = items.map((item, index) => [
      index + 1,
      item.code,
      item.item_name,
      item.qty,
      item.uom,
      { content: `${item.rate}`, styles: { halign: "right" } }, // Align Rate Right
      { content: `${item.amount}`, styles: { halign: "right" } }, // Align Amount Right
    ]);

    // AutoTable settings
    doc.autoTable({
      head: headers,
      body: rows,
      startY: 75,
      theme: "grid",
      styles: { fontSize: 8 }, // Reduce font size
      headStyles: {
        fontSize: 9,
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        halign: "left", // Default center alignment for headers
      },
      columnStyles: {
        5: { halign: "right" }, // RATE column right-aligned
        6: { halign: "right" }, // AMOUNT column right-aligned
      },
      didDrawCell: (data) => {
        if (
          data.section === "head" &&
          (data.column.index === 5 || data.column.index === 6)
        ) {
          data.cell.styles.halign = "right"; // Align RATE & AMOUNT headers to right
        }
      },
    });

    // Summary Section (Below Table)
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.text(`Sub Total:`, 150, finalY, { align: "right" });
    doc.text(`${subAmount}`, 195, finalY, { align: "right" });
    doc.text(`Discount:`, 150, finalY + 6, { align: "right" });
    doc.text(`${discount}`, 195, finalY + 6, { align: "right" });
    doc.text(`Total:`, 150, finalY + 12, { align: "right" });
    doc.setFontSize(13);
    doc.text(`${TotalAmount}`, 195, finalY + 12, { align: "right" });

    // Save PDF
    doc.save("invoice.pdf");
  };

  return (
    <Box
      sx={{
        height: "13rem",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Box></Box>
      <Box
        sx={{
          width: "25%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Typography>Sub Total</Typography>{" "}
            <Typography>₹{subAmount}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography>Discount</Typography>

            <Box
              sx={{
                width: "25%",
                height: "100%",
                display: "flex",
                gap: "5px",
                alignItems: "center",
              }}
            >
              ₹
              <TextField
                variant="outlined"
                value={discount}
                onChange={(e: any) => setDiscount(e.target.value)}
                sx={{
                  width: "100%", // Set width
                  "& .MuiInputBase-root": {
                    height: "30px", // Controls the input field height
                    padding: "1px", // Controls the padding inside input
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "10px", // Adjust text padding inside input
                    textAlign: "right",
                  },
                }}
              />
            </Box>
          </Box>
          {/* <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Typography>Gst %</Typography>
          </Box> */}
        </Box>

        <Box sx={{ bgcolor: "lightgray", height: ".5px", width: "100%" }}></Box>

        {/* Total price */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography>Total</Typography>{" "}
          <Typography sx={{ fontSize: "1.2rem" }}>₹{TotalAmount}</Typography>
        </Box>

        <Box sx={{ bgcolor: "lightgray", height: ".5px", width: "100%" }}></Box>
        {/* Paid By */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {["Cash Paid", "UPI Paid", "Credit Bill"].map((label) => (
            <FormControlLabel
              key={label}
              control={
                <Checkbox
                  checked={selected === label}
                  onChange={() => handleChange(label)}
                  size="small"
                  sx={{
                    color: "#1E1E2D", // Default color
                    "&.Mui-checked": { color: "#1E1E2D" }, // Checked state color
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: "0.8rem" }}>{label}</Typography>
              } // Small label
              sx={{ marginRight: 0, padding: 0 }} // Remove extra spacing
            />
          ))}
        </Box>

        <Button
          fullWidth
          variant="contained"
          sx={{ bgcolor: "#1E1E2D" }}
          onClick={() =>
            generateInvoicePDF(filteredBill, subAmount, discount, TotalAmount)
          }
        >
          Print Bill
        </Button>
      </Box>
    </Box>
  );
};

export default BillingPrice;
