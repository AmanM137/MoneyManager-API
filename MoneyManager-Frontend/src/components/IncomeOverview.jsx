import { useEffect, useState } from "react";
import CustomLineChart from "./CustomLineChart";
import { prepareIncomeLineChartData } from "../util/util";
import { Plus } from "lucide-react";


const IncomeOverview = ({ transactions, onAddIncome }) => {

    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const result = prepareIncomeLineChartData(transactions);
        setChartData(result);

        return () => { };
    }, [transactions]);


    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h5 className="text-lg">
                        Income Overview
                    </h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Track your earnings over time and analyze your income trends.
                    </p>
                </div>
                <button
                    className="flex items-center gap-1 px-3 py-2 rounded-md font-medium bg-green-50 text-green-800 border border-green-200 hover:bg-green-100 hover:text-green-900 shadow-sm transition-all duration-200 cursor-pointer"
                    onClick={onAddIncome}
                >
                    <Plus size={15} className="text-green-800" />
                    Add Income
                </button>
            </div>
            <div className="mt-10">
                {/* Create line chart */}
                <CustomLineChart data={chartData} />
            </div>
        </div>
    )
}

export default IncomeOverview;
