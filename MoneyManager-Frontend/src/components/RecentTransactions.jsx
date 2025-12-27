import { ArrowRight } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard.jsx";
import moment from "moment";

const RecentTransactions = ({ transactions, onMore }) => {
    const hasTransactions = transactions && transactions.length > 0;

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-800">
                    Recent Transactions
                </h4>
                <button
                    onClick={onMore}
                    className="flex items-center gap-1 text-sm font-medium text-purple-700 hover:text-purple-900 hover:underline transition-all duration-200"
                >
                    More
                    <ArrowRight size={15} className="text-purple-700" />
                </button>
            </div>

            {/* Transactions List */}
            <div className="mt-4 space-y-3">
                {hasTransactions ? (
                    transactions.slice(0, 5).map((item) => (
                        <TransactionInfoCard
                            key={item.id}
                            title={item.name}
                            icon={item.icon}
                            date={moment(item.date).format("Do MMM YYYY")}
                            amount={item.amount}
                            type={item.type}
                            hideDeleteBtn
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-[150px] text-center text-gray-500 bg-gradient-to-b from-gray-50 to-white border border-dashed border-gray-200 rounded-lg">
                        <p className="font-medium text-gray-700">
                            No recent transactions
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Add income or expense to see them here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentTransactions;
