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

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning , ";
  if (hour < 18) return "Good Afternoon , ";
  return "Good Evening , ";
};
export const generateInvoicePDF = (items, subAmount, discount, TotalAmount) => {
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

export const sampleData = [
  {
    item_name: "Basmati Rice",
    code: "IR001",
    uom: "Kg",
    qty: 1,
    stock_qty: 15, // 1 + 1
    purchased_rate: 50,
    rate: 60,
    amount: 60,
  },
  {
    item_name: "Wheat Flour",
    code: "WF002",
    uom: "Kg",
    qty: 1,
    stock_qty: 15, // 1 + 1
    purchased_rate: 40,
    rate: 50,
    amount: 50,
  },
  {
    item_name: "Toor Dal",
    code: "TD003",
    uom: "Kg",
    qty: 1,
    stock_qty: 15, // 1 + 1
    purchased_rate: 90,
    rate: 110,
    amount: 110,
  },
  {
    item_name: "Mustard Seeds",
    code: "MS004",
    uom: "gram",
    qty: 100,
    stock_qty: 2000, // 100 + 100
    purchased_rate: 200,
    rate: 250,
    amount: 250,
  },
  {
    item_name: "Cumin Seeds",
    code: "CS005",
    uom: "gram",
    qty: 100,
    stock_qty: 2000, // 100 + 100
    purchased_rate: 400,
    rate: 500,
    amount: 500,
  },
  {
    item_name: "Turmeric Powder",
    code: "TP006",
    uom: "gram",
    qty: 100,
    stock_qty: 2000, // 100 + 100
    purchased_rate: 120,
    rate: 150,
    amount: 150,
  },
  {
    item_name: "Coconut Oil",
    code: "CO007",
    uom: "liter",
    qty: 1,
    stock_qty: 15, // 1 + 1
    purchased_rate: 180,
    rate: 220,
    amount: 220,
  },
  {
    item_name: "Sunflower Oil",
    code: "SO008",
    uom: "liter",
    qty: 1,
    stock_qty: 15, // 1 + 1
    purchased_rate: 160,
    rate: 190,
    amount: 190,
  },
  {
    item_name: "Milk",
    code: "MK009",
    uom: "liter",
    qty: 1,
    stock_qty: 15, // 1 + 1
    purchased_rate: 55,
    rate: 65,
    amount: 65,
  },
  {
    item_name: "Ghee",
    code: "GH010",
    uom: "Kg",
    qty: 1,
    stock_qty: 15, // 1 + 1
    purchased_rate: 500,
    rate: 600,
    amount: 600,
  },
  {
    item_name: "Tea Powder",
    code: "TP011",
    uom: "gram",
    qty: 100,
    stock_qty: 2000, // 100 + 100
    purchased_rate: 220,
    rate: 260,
    amount: 260,
  },
  {
    item_name: "Coffee Powder",
    code: "CP012",
    uom: "gram",
    qty: 100,
    stock_qty: 2000, // 100 + 100
    purchased_rate: 300,
    rate: 350,
    amount: 350,
  },
  {
    item_name: "Bread",
    code: "BR013",
    uom: "piece",
    qty: 1,
    stock_qty: 15, // 1 + 1
    purchased_rate: 30,
    rate: 40,
    amount: 40,
  },
  {
    item_name: "Egg",
    code: "EG014",
    uom: "piece",
    qty: 1,
    stock_qty: 15, // 1 + 1
    purchased_rate: 6,
    rate: 8,
    amount: 8,
  },
];

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

export const aggregateItemsByCode=(data)=> {
  const aggregated: any = {};

  data.forEach((item: any) => {
    const { code, qty, rate, uom } = item;

    if (!aggregated[code]) {
      aggregated[code] = { ...item, qty: 0 }; // Initialize qty to 0
    }

    aggregated[code].qty += qty; // Sum up qty
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
}
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

export const filterTodayBills=(bills:any)=> {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  return bills.filter(bill => bill.createdAt.startsWith(today));
}