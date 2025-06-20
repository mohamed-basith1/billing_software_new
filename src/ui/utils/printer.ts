export const handlePrinter = async (printerData: any, balance = 0) => {
  const formattedDate = new Date(printerData.createdAt).toLocaleDateString(
    "en-IN"
  );

  const itemsBody = printerData.itemsList.map((item: any) => [
    {
      type: "text",
      value: item.item_name,
      style: { textAlign: "left" },
    },
    {
      type: "text",
      value: item.qty.toString(),
      style: { textAlign: "center" },
    },
    {
      type: "text",
      value: `₹${item.rate.toFixed(2)}`,
      style: { textAlign: "center" },
    },
    {
      type: "text",
      value: `₹${item.amount.toFixed(2)}`,
      style: { textAlign: "right" },
    },
  ]);
  const data = [
    // Header
    {
      type: "text",
      value: "New Karnataka Store",
      style: {
        marginTop: "20px",
        fontSize: "18px",
        textAlign: "center",
        fontWeight: "bold",
      },
    },
    {
      type: "text",
      value: "No. 48,8th Main Road, Vasanth Nagar, Bangalore",
      style: {
        fontSize: "12px",
        textAlign: "center",
      },
    },
    {
      type: "text",
      value: "Phone: 7904657184, 9538543025",
      style: {
        fontSize: "12px",
        textAlign: "center",
      },
    },
    {
      type: "text",
      value: "Pincode: 560052",
      style: {
        fontSize: "12px",
        textAlign: "center",
      },
    },

    // Bill number and date
    {
      type: "text",
      value: "",
      style: {
        fontSize: "12px",
        textAlign: "center",
        marginTop: "20px",
      },
    },
    {
      type: "table",
      style: {
        fontSize: "12px",
      },

      tableHeader: [
        {
          type: "text",
          value: `Bill No : ${printerData.bill_number}`,
          style: { textAlign: "left", fontSize: "10px" },
        },
        {
          type: "text",
          value: "",
          style: { textAlign: "left", fontSize: "10px" },
        },
        {
          type: "text",
          value: "",
          style: { textAlign: "right", fontSize: "10px" },
        },
        {
          type: "text",
          value: `Date : ${formattedDate}`,
          style: { textAlign: "right", fontSize: "10px" },
        },
      ],

      tableHeaderStyle: {
        style: { textAlign: "left", fontSize: "10px" },
      },
      tableBodyStyle: { border: "none", fontSize: "10px" },
      tableFooterStyle: { fontSize: "11px" },
    },
    {
      type: "table",
      style: {
        fontSize: "10px",
      },

      tableHeader: [
        {
          type: "text",
          value: `Payment Method : ${printerData.payment_method}`,
          style: { textAlign: "left", fontSize: "10px" },
        },
      ],

      tableHeaderStyle: {
        fontSize: "12px",
      },
      tableBodyStyle: { border: "none", fontSize: "10px" },
      tableFooterStyle: { fontSize: "11px" },
    },
    {
      type: "table",
      style: {
        fontSize: "10px",
      },

      tableHeader: [
        {
          type: "text",
          value:
            printerData.customer_name === ""
              ? "Customer Name : Guest"
              : `Customer Name : ${printerData.customer_name}`,
          style: { textAlign: "left", fontSize: "10px" },
        },
      ],

      tableHeaderStyle: {
        fontSize: "12px",
      },
      tableBodyStyle: { border: "none", fontSize: "10px" },
      tableFooterStyle: { fontSize: "11px" },
    },
    // Table
    {
      type: "text",
      value: "",
      style: {
        fontSize: "12px",
        textAlign: "center",
        marginTop: "30px",
      },
    },
    {
      type: "table",
      style: { borderRadious: "1px" },
      tableHeader: [
        {
          type: "text",
          value: "Item",
          style: { textAlign: "left", fontWeight: "bold" },
        },
        {
          type: "text",
          value: "Qty",
          style: { textAlign: "center", fontWeight: "bold" },
        },
        {
          type: "text",
          value: "Price",
          style: { textAlign: "center", fontWeight: "bold" },
        },
        {
          type: "text",
          value: "Amount",
          style: { textAlign: "right", fontWeight: "bold" },
        },
      ],

      tableBody: itemsBody,
      tableFooter: [
        {
          type: "text",
          value: "Sub Total",
          style: { textAlign: "left", fontSize: "10px" },
        },
        {
          type: "text",
          value: "",
          style: { textAlign: "right", fontSize: "10px" },
        },
        {
          type: "text",
          value: "",
          style: { textAlign: "right", fontSize: "10px" },
        },
        {
          type: "text",
          value: `₹${printerData.sub_amount.toFixed(2)}`,
          style: { textAlign: "right", fontSize: "10px" },
        },
      ],
      tableHeaderStyle: {
        borderBottom: "1px dashed black",
        borderTop: "1px dashed black",
        fontWeight: "bold",
        fontSize: "12px",
      },

      tableBodyStyle: {
        border: "none",
        borderBottom: "none",
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        fontSize: "10px",
      },
      tableFooterStyle: { fontSize: "10px", border: "none" },
    },

    // Discount
    {
      type: "table",
      style: {},

      tableFooter: [
        {
          type: "text",
          value: "Discount(-)",
          style: { textAlign: "left", fontSize: "10px" },
        },
        {
          type: "text",
          value: "",
          style: { textAlign: "right", fontSize: "10px" },
        },
        {
          type: "text",
          value: "",
          style: { textAlign: "right", fontSize: "10px" },
        },
        {
          type: "text",
          value: `${printerData.discount}%`,
          style: { textAlign: "right", fontSize: "10px" },
        },
      ],

      tableHeaderStyle: {
        fontSize: "12px",
      },
      tableBodyStyle: { border: "none", fontSize: "10px" },
      tableFooterStyle: { fontSize: "11px" },
    },

    //Total
    {
      type: "table",
      style: {},

      tableHeader: [
        {
          type: "text",
          value: "Total",
          style: { textAlign: "left", fontSize: "15px" },
        },
        {
          type: "text",
          value: "",
          style: { textAlign: "right", fontSize: "10px" },
        },
        {
          type: "text",
          value: "",
          style: { textAlign: "right", fontSize: "10px" },
        },
        {
          type: "text",
          value: `₹${printerData.total_amount.toFixed(2)}`,
          style: { textAlign: "right", fontSize: "15px" },
        },
      ],

      tableHeaderStyle: {
        borderBottom: "1px dashed black",
        borderTop: "1px dashed black",
        fontWeight: "bold",
        fontSize: "12px",
      },
      tableBodyStyle: { border: "none", fontSize: "10px" },
      tableFooterStyle: { fontSize: "11px" },
    },

    //BALANCE
    {
      type: "table",
      style: {},
      tableHeader: [
        {
          type: "text",
          value: "Balance",
          style: { textAlign: "left", fontSize: "15px" },
        },
        {
          type: "text",
          value: "",
          style: { textAlign: "right", fontSize: "10px" },
        },
        {
          type: "text",
          value: "",
          style: { textAlign: "right", fontSize: "10px" },
        },
        {
          type: "text",
          value: `₹${balance.toFixed(2)}`,
          style: { textAlign: "right", fontSize: "15px" },
        },
      ],

      tableHeaderStyle: {
        borderBottom: "1px dashed black",
        fontWeight: "bold",
        fontSize: "12px",
      },
      tableBodyStyle: { border: "none", fontSize: "10px" },
      tableFooterStyle: { fontSize: "11px" },
    },
    //GN TOTAl
    {
      type: "table",
      style: {},

      tableHeader: [
        {
          type: "text",
          value: "Grand Total",
          style: { textAlign: "left", fontSize: "15px" },
        },
        {
          type: "text",
          value: "",
          style: { textAlign: "right", fontSize: "10px" },
        },
        {
          type: "text",
          value: "",
          style: { textAlign: "right", fontSize: "10px" },
        },
        {
          type: "text",
          value: `₹${(printerData.total_amount + balance).toFixed(2)}`,
          style: { textAlign: "right", fontSize: "15px" },
        },
      ],

      tableHeaderStyle: {
        borderBottom: "1px dashed black",
      
        fontWeight: "bold",
        fontSize: "12px",
      },
      tableBodyStyle: { border: "none", fontSize: "10px" },
      tableFooterStyle: { fontSize: "11px" },
    },
    // Thank you message
    {
      type: "text",
      value: "THANK YOU FOR YOUR BUSINESS!",
      style: {
        fontSize: "12px",
        textAlign: "center",
        marginTop: "20px",
      },
    },
  ];

  //@ts-ignore
  await window.electronAPI
    .printReceipt(data)
    .then((res) => {
      if (res.success) {
        console.log("Printed successfully");
      } else {
        console.error("Print failed:", res.error);
      }
    })
    .catch((err) => console.error("IPC call failed:", err));
};
