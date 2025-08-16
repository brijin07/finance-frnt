import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#22c55e", "#ef4444"]; // Income=green, Expense=red

const YearlyIncomeExpenseChart = ({ data }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Track screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // For pie chart (mobile) → show total income vs expense
  const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
  const totalExpense = data.reduce((sum, item) => sum + item.expense, 0);
  const total = totalIncome + totalExpense;

  const pieData = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
  ];

  return (
    <div className="w-full flex justify-center items-center">
      {isMobile ? (
        // 📱 Mobile → Pie Chart
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="white"
                  strokeWidth={2}
                  style={{
                    filter: "drop-shadow(0px 2px 6px rgba(0,0,0,0.15))",
                  }}
                />
              ))}
            </Pie>

            {/* Center total */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: "16px",
                fontWeight: "600",
                fill: "#374151",
              }}
            >
              ₹{total.toLocaleString()}
            </text>

            <Tooltip
              formatter={(val, name) => [`₹${val.toLocaleString()}`, name]}
              contentStyle={{
                borderRadius: "10px",
                boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{
                fontSize: "14px",
                marginTop: "10px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        // 🖥️ Desktop → Bar Chart
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
            <Legend />
            <Bar dataKey="income" fill="#22c55e" name="Income" />
            <Bar dataKey="expense" fill="#ef4444" name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default YearlyIncomeExpenseChart;
