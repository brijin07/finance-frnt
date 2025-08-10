import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

const BarChartComponent = ({ data }) => {
  return (
    <section
      className="w-full h-64 sm:h-96 rounded-3xl shadow-xl
      bg-white bg-opacity-90 backdrop-blur-md p-4 sm:p-6"
      aria-label="Bar chart of spending by description"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 30, right: 40, left: 0, bottom: 50 }}
          layout="horizontal"
        >
          <CartesianGrid strokeDasharray="4 4" stroke="#cbd5e1" />
          <XAxis
            dataKey="description"
            type="category"
            tick={{ fontWeight: '600' }}
            tickLine={false}
            width={150}
            interval={0}
          />
          <YAxis
            type="number"
            tick={{ fontWeight: '600' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `₹${val.toFixed(0)}`}
          />
          <Tooltip
            formatter={(value) => `₹${value.toFixed(2)}`}
            contentStyle={{ backgroundColor: '#eef2ff', borderRadius: '8px' }}
            cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: 10 }} />
          <Bar dataKey="income" fill="#22c55e" name="Income" radius={[6, 6, 6, 6]} />
          <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[6, 6, 6, 6]} />
          <Bar dataKey="debt_pay" fill="#facc15" name="Debt Pay" radius={[6, 6, 6, 6]} />
          <Bar dataKey="debt_receive" fill="#3b82f6" name="Debt Receive" radius={[6, 6, 6, 6]} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
};

export default BarChartComponent;
