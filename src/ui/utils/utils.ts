import jsPDF from "jspdf";
import "jspdf-autotable";

export const calculateAmount = (
  uom: string,
  qty: number,
  rate: number
): number => {
  switch (uom) {
    case "Kg":
    case "liter":
    case "piece":
      return qty * rate; // No conversion for these UOMs
    case "gram":
      return (qty / 1000) * rate; // Convert grams to Kg
    default:
      console.warn(`Unknown UOM: ${uom}`);
      return 0; // Return 0 as a fallback
  }
};

export const getDaysDifference = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning , ";
  if (hour < 18) return "Good Afternoon , ";
  return "Good Evening , ";
};

export const generateInvoicePDF = (
  items,
  subAmount,
  discount,
  TotalAmount,
  fulldata
) => {
  const doc = new jsPDF();
  console.log("fulldata", fulldata);
  // Company Name (Centered Top)
  doc.setFontSize(40);
  doc.text("INVOICE", 165, 28, { align: "center" });

  // Invoice Details (Left)
  doc.setFontSize(10);
  doc.text(`INVOICE N0 :`, 14, 51);
  doc.text(`${new Date().getTime()}`, 38, 51);
  doc.text(`ISSUE DATE :`, 14, 57);
  doc.text(`${new Date().toLocaleDateString()}`, 38, 57);

  // From Company Details
  doc.text("FROM :", 14, 75);
  doc.text(`${fulldata.customer_name}`, 14, 82);
  doc.text("123 Street, City, Country", 14, 87);
  doc.text("Phone: +91 9876543210", 14, 92);

  // Customer Details (Right)
  doc.text("BILL TO :", 195, 75, { align: "right" });
  doc.text(`${fulldata.customer_name}`, 195, 82, { align: "right" });
  doc.text("Customer Address", 195, 87, { align: "right" });
  doc.text("Phone: +91 9876543210", 195, 92, { align: "right" });

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
    startY: 120,
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
  doc.text(`SUB TOTAL:`, 150, finalY, { align: "right" });
  doc.text(`${subAmount}`, 195, finalY, { align: "right" });
  doc.text(`DISCOUNT:`, 150, finalY + 6, { align: "right" });
  doc.text(`${discount}`, 195, finalY + 6, { align: "right" });
  doc.text(`TOTAL:`, 150, finalY + 12, { align: "right" });
  doc.setFontSize(13);
  doc.text(`${TotalAmount}`, 195, finalY + 12, { align: "right" });

  // Save PDF
  doc.save("invoice.pdf");
};

export async function addData(itemData: any) {
  const sanitizedData = JSON.parse(JSON.stringify(itemData)); // Removes undefined & BigInt

  try {
    //@ts-ignore
    await window.electronAPI.insertItem(sanitizedData);
  } catch (error) {
    console.error("Error inserting item:", error);
  }
}

const renameIdField = (array) => {
  return array.map((obj) => {
    if (!obj.id && obj._id) {
      const { _id, ...rest } = obj;
      return { id: _id, ...rest };
    }
    return obj;
  });
};

export const handleSearchCustomer = async (searchTerm: string) => {
  //@ts-ignore
  let response = await window.electronAPI.searchCustomer(searchTerm);

  return renameIdField(response.data);
};

export const fetchBills = async (
  fromDatePara: any,
  toDatePara: any,
  payment_method: any
) => {
  const toDate = toDatePara.toISOString();
  // // Get 1 month ago UTC time
  const fromDate = fromDatePara.toISOString();
  //@ts-ignore
  let response: any = await window.electronAPI.getBills(
    fromDate,
    toDate,
    payment_method
  );
  return response;
};

export const aggregateItemsByCode = (data) => {
  console.log("data agrregateItem", JSON.stringify(data));
  const aggregated: any = {};

  data.forEach((item: any) => {
    const { qty, rate, uom, unique_id } = item;

    if (!aggregated[unique_id]) {
      aggregated[unique_id] = { ...item, qty: 0 }; // Initialize qty to 0
    }

    aggregated[unique_id].qty += qty; // Sum up qty
  });

  // Recalculate amount based on qty and rate
  Object.values(aggregated).forEach((item: any) => {
    if (item.uom === "gram") {
      item.amount = (item.qty / 1000) * item.rate; // Convert grams to kg
    } else {
      item.amount = item.qty * item.rate;
    }
  });

  return Object.values(aggregated);
};
//dark
export const colorsList = [
  "rgb(30, 120, 80)", // Dark Green
  "rgb(75, 45, 140)", // Dark Purple
  "rgb(180, 120, 10)", // Dark Orange-Yellow
  "rgb(180, 60, 40)", // Dark Red
  "rgb(20, 110, 150)", // Dark Blue
];

export const getTotalAmount = <T>(bills: T[], key: keyof T): number => {
  return bills.reduce((sum, bill) => sum + (bill[key] as number), 0);
};

export const filterTodayBills = (bills: any) => {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  return bills.filter((bill) => bill.createdAt.startsWith(today));
};
