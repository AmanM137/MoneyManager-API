import { useEffect, useState } from "react";
import {Plus} from "lucide-react";
import CustomLineChart from "./CustomLineChart.jsx";
import {prepareIncomeLineChartData} from "../util/util.js";

const ExpenseOverview = ({transactions, onExpenseIncome}) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const result = prepareIncomeLineChartData(transactions);
        setChartData(result);

        return () => {};
    }, [transactions]);

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
                <div className="">
                    <h5 className="text-lg">Expense Overview</h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Track your spending trends over time and gain insights into where
                        your money goes.
                    </p>
                </div>

                <button 
                className="flex items-center gap-1 px-3 py-2 rounded-md font-medium bg-red-50 text-red-800 border border-red-200 hover:bg-red-100 hover:text-red-900 shadow-sm transition-all duration-200 cursor-pointer" 
                onClick={onExpenseIncome}
                >
                    <Plus size={15} className="text-red-800" />
                    Add Expense
                </button>
            </div>

            <div className="mt-10">
                <CustomLineChart data={chartData} />
            </div>
        </div>
    );
};

export default ExpenseOverview;
