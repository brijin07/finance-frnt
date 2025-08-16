import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const useMediaQuery = (width) => {
  const [targetReached, setTargetReached] = React.useState(false);

  React.useEffect(() => {
    const updateTarget = () => {
      setTargetReached(window.innerWidth < width);
    };

    updateTarget();
    window.addEventListener("resize", updateTarget);

    return () => window.removeEventListener("resize", updateTarget);
  }, [width]);

  return targetReached;
};

const COLORS = ["#22c55e", "#ef4444", "#facc15", "#3b82f6"];

// 🔹 Short labels for legend only
const LABELS = {
  Income: "Income",
  Expense: "Expense",
  "Debt Pay": "debt pay",
  "Debt Receive": "debt Recv",
};

const BarChartComponent = ({ data }) => {
  const isMobile = useMediaQuery(640);

  // 📊 Aggregate data for Pie Chart
  const aggregatedData = [
    { name: "Income", value: data.reduce((s, i) => s + (i.income || 0), 0) },
    { name: "Expense", value: data.reduce((s, i) => s + (i.expense || 0), 0) },
    { name: "Debt Pay", value: data.reduce((s, i) => s + (i.debt_pay || 0), 0) },
    { name: "Debt Receive", value: data.reduce((s, i) => s + (i.debt_receive || 0), 0) },
  ];

  const total = aggregatedData.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="w-full h-64 sm:h-96">
      <ResponsiveContainer width="100%" height="100%">
        {isMobile ? (
          // 📱 Mobile: Clean Donut Pie Chart without text around
          <PieChart>
            <Tooltip
              formatter={(value, name) => [
                `₹${value.toFixed(2)} (${((value / total) * 100).toFixed(1)}%)`,
                name, // full name in tooltip
              ]}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "6px",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => LABELS[value] || value} // short legend text
            />
            <Pie
              data={aggregatedData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="80%"
              isAnimationActive
              animationDuration={800}
            >
              {aggregatedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        ) : (
          // 💻 Desktop: Bar Chart
          <BarChart
            data={data}
            margin={{ top: 30, right: 40, left: 0, bottom: 60 }}
            barSize={40}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />

            <XAxis
              dataKey="description"
              type="category"
              tick={{ fontWeight: "600" }}
              tickLine={false}
              minTickGap={20}
              angle={-25}
              textAnchor="end"
              height={70}
            />

            <YAxis
              type="number"
              tick={{ fontWeight: "600" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) =>
                val >= 1000 ? `₹${(val / 1000).toFixed(1)}K` : `₹${val}`
              }
            />

            <Tooltip
              formatter={(value, name) => [`₹${value.toFixed(2)}`, name]}
              labelStyle={{ fontWeight: "bold" }}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "6px",
              }}
              cursor={{ fill: "rgba(99, 102, 241, 0.1)" }}
            />

            <Legend verticalAlign="bottom" height={36} />

            <Bar dataKey="income" fill={COLORS[0]} name="Income" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" fill={COLORS[1]} name="Expense" radius={[6, 6, 0, 0]} />
            <Bar dataKey="debt_pay" fill={COLORS[2]} name="Debt Pay" radius={[6, 6, 0, 0]} />
            <Bar dataKey="debt_receive" fill={COLORS[3]} name="Debt Receive" radius={[6, 6, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </section>
  );
};

export default BarChartComponent;
