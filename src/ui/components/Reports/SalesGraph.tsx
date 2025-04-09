import React from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

//   {
//     date: "12/01/25",
//     amount: 1250,
//   },
//   {
//     date: "13/02/25",
//     amount: 1875,
//   },
//   {
//     date: "14/03/25",
//     amount: 2340,
//   },
//   {
//     date: "15/04/25",
//     amount: 1820, // Dip after Q1
//   },
//   {
//     date: "16/05/25",
//     amount: 2100,
//   },
//   {
//     date: "17/06/25",
//     amount: 3250, // End of Q2 spike
//   },
//   {
//     date: "18/07/25",
//     amount: 2875,
//   },
//   {
//     date: "18/08/25",
//     amount: 3100,
//   },
//   {
//     date: "18/09/25",
//     amount: 4200, // Quarterly peak
//   },
//   {
//     date: "18/10/25",
//     amount: 3800,
//   },
//   {
//     date: "18/11/25",
//     amount: 4950, // Pre-holiday surge
//   },
//   {
//     date: "18/12/25",
//     amount: 6750, // Year-end peak
//   },
// ];

const SalesGraph = ({ data }:any) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 20,
          right: 0,
          left: 0, // Reduced from default 40-60
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22b378" stopOpacity={0.8} />
            <stop offset="100%" stopColor="white" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          axisLine={{ stroke: "white" }}
          tick={{
            fill: "#4a5568",
            fontSize: ".7rem",
            fontFamily: "sans-serif",
          }}
          tickLine={{ stroke: "white" }}
          tickFormatter={(value) => {
            // Parse the date string (assuming format DD/MM/YY or DD/MM/YYYY)
            const [day, month, year] = value.split("/");
            const date = new Date(`20${year}`, month - 1, day);

            // Format as "12 Dec"
            return `${day} ${date.toLocaleString("default", {
              month: "short",
            })}`;
          }}
        />

        <YAxis
          dataKey="amount"
          width={40}
          axisLine={{ stroke: "white" }} // Axis line color
          tick={{
            fill: "#4a5568", // Tick text color
            fontSize: ".7rem",
            fontFamily: "sans-serif",
          }}
          tickLine={{ stroke: "white" }} // Tick line color
          tickFormatter={(value) => {
            if (value >= 1000000) {
              return `₹${(value / 1000000).toFixed(1)}M`;
            } else if (value >= 1000) {
              return `₹${(value / 1000).toFixed(1)}k`;
            }
            return `₹${value}`;
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            padding: "12px",
          }}
          itemStyle={{
            color: "#2d3748",
            fontSize: "14px",
            fontWeight: 600,
          }}
          labelStyle={{
            color: "#4a5568",
            fontSize: "12px",
            fontWeight: 500,
            marginBottom: "8px",
          }}
          formatter={(value, name, props) => {
            // Format the displayed value in tooltip
            if (value >= 1000000) {
              return [`₹${(value / 1000000).toFixed(1)}M`, name];
            } else if (value >= 1000) {
              return [`₹${(value / 1000).toFixed(1)}k`, name];
            }
            return [`₹${value}`, name];
          }}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="#22b378"
          strokeWidth={1.5}
          fill="url(#colorUv)" // Reference the gradient
          fillOpacity={1}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};



export default React.memo(SalesGraph);
