"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import styles from "./ProductChart.module.css";

const data = [
  { name: "Laptop", sales: 120 },
  { name: "Phone", sales: 98 },
  { name: "Mouse", sales: 45 },
  { name: "Keyboard", sales: 70 },
];

export default function ProductChart() {
  return (
    <div className={styles.chartCard}>
      <div className={styles.header}>
        <h3>Product Sales</h3>
        <p>Top selling products</p>
      </div>

      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="name"
              tick={{ fill: "#64748b", fontSize: 13 }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
            />

            <YAxis
              tick={{ fill: "#64748b", fontSize: 13 }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 10px 25px rgba(0,0,0,.08)",
              }}
            />

            <Bar
              dataKey="sales"
              fill="#4f46e5"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}