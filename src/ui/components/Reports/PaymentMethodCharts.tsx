import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = ["#f6ad55", "rgba(34,179,120,1)", "rgba(155, 89, 182, 1)"]; // Green, Amber, Blue

const PaymentMethodCharts = ({ paymentSummary }: any) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={paymentSummary}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={100}
          paddingAngle={0}
          dataKey="value"
        >
          {paymentSummary.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
  );
};

export default PaymentMethodCharts;
