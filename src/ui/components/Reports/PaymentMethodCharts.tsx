import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useEffect, useRef, useState } from "react";

const COLORS = ["rgba(155, 89, 182, 1)", "#f6ad55", "rgba(34,179,120,1)"]; // Green, Amber, Blue

const PaymentMethodCharts = ({ paymentSummary }: any) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState({ inner: 50, outer: 80 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const size = Math.min(width, height); // use the smaller side to keep it a circle

        const outer = Math.max(90, Math.min(size / 3, 260)); // clamp between 90 and 160
        const inner = outer * 0.7;

        setRadius({ inner, outer });
      }
    });

    if (chartRef.current) {
      resizeObserver.observe(chartRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={chartRef} style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={paymentSummary}
            cx="50%"
            cy="50%"
            innerRadius={radius.inner}
            outerRadius={radius.outer}
            paddingAngle={0}
            dataKey="value"
          >
            {paymentSummary.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

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
            formatter={(value) => [
              `₹${value}`,
              paymentSummary.find((item) => item.value === value)?.name,
            ]}
          />
          <Legend
            iconType="circle"
            layout="vertical"
            verticalAlign="middle"
            align="right"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PaymentMethodCharts;
