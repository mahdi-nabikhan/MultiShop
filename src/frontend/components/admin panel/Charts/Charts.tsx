"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Laptop", sales: 120 },
  { name: "Phone", sales: 98 },
  { name: "Mouse", sales: 45 },
  { name: "Keyboard", sales: 70 },
];

export default function ProductChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="sales" />
      </BarChart>
    </ResponsiveContainer>
  );
}