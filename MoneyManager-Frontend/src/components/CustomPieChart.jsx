import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import CustomTooltip from "./CustomTooltip.jsx";
import CustomLegend from "./CustomLegend.jsx";
import { PieChart as PieIcon } from "lucide-react";

const CustomPieChart = ({ data, label, totalAmount, showTextAnchor, colors, type = "generic" }) => {
  const hasData = Array.isArray(data) && data.length > 0;

  const config = {
    income: {
      color: "text-green-500",
      title: "No income category data",
      subtitle: "Add income entries to view category breakdown.",
    },
    expense: {
      color: "text-red-500",
      title: "No expense category data",
      subtitle: "Add expenses to see your spending by category.",
    },
    generic: {
      color: "text-purple-400",
      title: "No data available",
      subtitle: "Add data to visualize distribution.",
    },
  }[type];

  if (!hasData) {
    return (
      <div className="h-[380px] flex flex-col items-center justify-center text-center text-gray-500 bg-gradient-to-b from-gray-50 to-white rounded-lg border border-dashed border-gray-200">
        <PieIcon size={40} className={`${config.color} mb-2`} />
        <p className="font-medium text-gray-700">{config.title}</p>
        <p className="text-xs text-gray-400 mt-1">{config.subtitle}</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={380}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={130}
          innerRadius={100}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
        {showTextAnchor && (
          <>
            <text x="50%" y="50%" dy={-25} textAnchor="middle" fill="#666" fontSize="14px">
              {label}
            </text>
            <text
              x="50%"
              y="50%"
              dy={8}
              textAnchor="middle"
              fill="#333"
              fontSize="24px"
              fontWeight="semi-bold"
            >
              {totalAmount}
            </text>
          </>
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
