import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { addThousandsSeparator } from "../util/util.js";
import { LineChart } from "lucide-react";

const CustomLineChart = ({ data, type = "generic" }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;

      const groupedItemsForTooltip = (dataPoint.items || []).reduce((acc, item) => {
        const { categoryName, amount } = item;
        if (!acc[categoryName]) {
          acc[categoryName] = { categoryName, totalAmount: 0 };
        }
        acc[categoryName].totalAmount += amount;
        return acc;
      }, {});

      const categoriesInTooltip = Object.values(groupedItemsForTooltip);

      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
          <p className="text-sm font-semibold text-gray-800 mb-2">{label}</p>
          <hr className="my-1 border-gray-200" />
          <p className="text-sm text-gray-700 font-bold mb-2">
            Total:{" "}
            <span className="text-purple-800">
              ₹{addThousandsSeparator(dataPoint.totalAmount)}
            </span>
          </p>
          {categoriesInTooltip?.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-600 mb-1">Details:</p>
              {categoriesInTooltip.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-xs text-gray-700"
                >
                  <span>{item.categoryName}:</span>
                  <span>₹{addThousandsSeparator(item.totalAmount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const hasData = Array.isArray(data) && data.length > 0;

  // Dynamic message & color based on type
  const config = {
    income: {
      color: "text-green-500",
      title: "No income data available",
      subtitle: "Add income entries to visualize your earnings.",
    },
    expense: {
      color: "text-red-500",
      title: "No expense data available",
      subtitle: "Add expense entries to track your spending habits.",
    },
    generic: {
      color: "text-purple-400",
      title: "No data available",
      subtitle: "Add records to visualize your data trends.",
    },
  }[type] || config.generic;

  return (
    <div className="bg-white">
      {hasData ? (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#875cf5" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#875cf5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="none" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
            <YAxis tick={{ fontSize: 12, fill: "#555" }} stroke="none" />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="totalAmount"
              stroke="#875cf5"
              fill="url(#chartGradient)"
              strokeWidth={3}
              dot={{ r: 3, fill: "#ab8df8" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex flex-col items-center justify-center text-center text-gray-500 bg-gradient-to-b from-gray-50 to-white rounded-lg border border-dashed border-gray-200">
          <LineChart size={38} className={`${config.color} mb-2`} />
          <p className="font-medium text-gray-700">{config.title}</p>
          <p className="text-xs text-gray-400 mt-1">{config.subtitle}</p>
        </div>
      )}
    </div>
  );
};

export default CustomLineChart;
