import CustomPieChart from "./CustomPieChart.jsx";
import { addThousandsSeparator } from "../util/util.js";

const FinanceOverview = ({ totalBalance = 0, totalIncome = 0, totalExpense = 0 }) => {
    const COLORS = ["#59168B", "#a0090e", "#016630"];

    const balanceData = [
        { name: "Total Balance", amount: totalBalance },
        { name: "Total Expenses", amount: totalExpense },
        { name: "Total Income", amount: totalIncome },
    ];

    const hasData =
        totalBalance > 0 || totalIncome > 0 || totalExpense > 0;

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h5 className="text-lg font-semibold text-gray-800">
                    Financial Overview
                </h5>
            </div>

            {/* Chart or Empty State */}
            {hasData ? (
                <CustomPieChart
                    data={balanceData}
                    label="Total Balance"
                    totalAmount={`₹${addThousandsSeparator(totalBalance)}`}
                    colors={COLORS}
                    showTextAnchor
                />
            ) : (
                <div className="flex flex-col items-center justify-center h-[320px] text-center text-gray-500 bg-gradient-to-b from-gray-50 to-white border border-dashed border-gray-200 rounded-lg">
                    <p className="font-medium text-gray-700">
                        No financial data available
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Add income or expense to see your financial summary here.
                    </p>
                </div>
            )}
        </div>
    );
};

export default FinanceOverview;
