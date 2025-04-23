import jsPDF from "jspdf";
import "jspdf-autotable";
import { backgroundImage } from "./image";
import { v4 as uuidv4 } from "uuid";
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

function formatDateToReadable(isoDateStr) {
  const date = new Date(isoDateStr);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = date.toLocaleString("en-GB", {
    month: "long",
    timeZone: "UTC",
  });
  const year = date.getUTCFullYear();

  return `${day} ${month}, ${year}`;
}

//2025-04-22T22:22:45.495+00:00
function capitalizeWords(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const generateInvoicePDF = (
  items,
  subAmount,
  discount,
  TotalAmount,
  fulldata
) => {
  const doc = new jsPDF();

  doc.addImage(backgroundImage, "PNG", 0, 0, 210, 297);
  // Company Name (Centered Top)
  doc.setFontSize(22);
  doc.text("New Grocery Shop", 195, 28, { align: "right" });
  doc.setFontSize(10);
  doc.setTextColor(177, 177, 177);
  doc.text("4/53,west street, Vadakku Mangudi Main Rd", 195, 36, {
    align: "right",
  });
  doc.setFontSize(10);
  doc.text("Tel: +91 7010809398", 195, 41, { align: "right" });
  doc.setFontSize(10);
  doc.text("Tel: +91 7010809398", 195, 46, { align: "right" });

  // Invoice Details (Left)
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(40);
  doc.text(`INVOICE`, 14, 65);
  doc.setTextColor(177, 177, 177);
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Invoice No : `, 14, 82);
  doc.setTextColor(177, 177, 177);
  doc.text(`${fulldata.bill_number}`, 38, 82, { align: "left" });
  doc.setTextColor(0, 0, 0);
  doc.text("Bill To :", 14, 90);
  doc.setTextColor(177, 177, 177);
  doc.text(`${capitalizeWords(fulldata.customer_name)}`, 38, 90, {
    align: "left",
  });
  // doc.text(`Customer Adress`, 38, 95, { align: "left" });
  // doc.text(`7010809392`, 38, 100, { align: "left" });

  // Customer Details (Right)
  doc.setTextColor(0, 0, 0);
  doc.text(`Date : `, 165, 82, { align: "right" });
  doc.setTextColor(177, 177, 177);
  doc.text(`${formatDateToReadable(fulldata.createdAt)}`, 195, 82, {
    align: "right",
  });
  // Table Headers
  const headers = [
    ["NO", "CODE", "ITEM NAME", "QUANTITY", "UOM", "RATE", "AMOUNT"],
  ];

  // Table Data
  const rows = [...items].map((item, index) => [
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
      fontSize: 8,
      fillColor: [229, 229, 229],
      textColor: [0, 0, 0],
      // halign: "left", // Default center alignment for headers
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
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total`, 170, finalY, { align: "right" });
  doc.text(`${subAmount}`, 195, finalY, { align: "right" });
  doc.text(`Paid Amount`, 170, finalY + 7, { align: "right" });
  doc.text(`${fulldata.amount_paid}`, 195, finalY + 7, { align: "right" });
  doc.text(`Balance`, 170, finalY + 14, { align: "right" });
  doc.text(`${fulldata.balance}`, 195, finalY + 14, { align: "right" });

  // amount_paid

  // Save PDF
  doc.save(`${fulldata.bill_number}-Invoice.pdf`);
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

export const generateDummyData = (length = 10000) => {
  return Array.from({ length }).map((_, i) => ({
    _id: uuidv4(),
    status: i % 2 === 0 ? "Increased" : "Decreased",
    createdAt: `2025-04-${String((i % 30) + 1).padStart(2, "0")}`,
    bill_no: `BILL${i}`,
    customer: `Customer ${i}`,
    method: i % 2 === 0 ? "Cash" : "Card",
    handler: `Handler ${i}`,
    reason: i % 3 === 0 ? "Salary" : "Purchase",
    amount: i % 2 === 0 ? `+${i * 10}` : `-${i * 5}`,
  }));
};
export const generateRandomKey = (length = 8) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

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

export const getTimeSlot = (): "morning" | "night" | null => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  // Morning slot: 10:00 (600 mins) to 12:00 (720 mins)
  if (totalMinutes >= 600 && totalMinutes < 720) return "morning";
  if (totalMinutes > 720 && totalMinutes < 960) {
    localStorage.removeItem("notification");
  }

  // Afternoon slot: 4:00 PM to 6:00 PM
  if (totalMinutes >= 960 && totalMinutes < 1080) return "morning";
  if (totalMinutes > 1080 && totalMinutes < 1200) {
    localStorage.removeItem("notification");
  }

  // Night slot: 20:00 (1200 mins) to 22:00 (1320 mins)
  if (totalMinutes >= 1200 && totalMinutes < 1320) return "night";

  return null;
};
