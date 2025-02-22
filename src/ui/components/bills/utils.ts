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
      return qty * rate;

    case "gram":
      return (qty / 1000) * rate; // Convert grams to Kg

    default:
      console.warn(`Unknown UOM: ${uom}`);
      return 0; // Return 0 as a fallback
  }
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

export async function addData(itemData: any) {
  console.log("Adding item:", itemData);

  const sanitizedData = JSON.parse(JSON.stringify(itemData)); // Removes undefined & BigInt

  try {
    //@ts-ignore
    await window.electronAPI.insertItem(sanitizedData);
    console.log("Item added successfully!");
  } catch (error) {
    console.error("Error inserting item:", error);
  }
}
