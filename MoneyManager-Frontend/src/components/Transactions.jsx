import { ArrowRight } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard.jsx";
import moment from "moment";

const Transactions = ({ transactions, onMore, type, title }) => {
    const hasTransactions = transactions && transactions.length > 0;

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h5 className="text-lg font-semibold text-gray-800">{title}</h5>
                <button
                    className="flex items-center gap-1 text-sm font-medium text-purple-700 hover:text-purple-900 hover:underline transition-all duration-200"
                    onClick={onMore}
                >
                    More
                    <ArrowRight size={15} className="text-purple-700" />
                </button>
            </div>

            {/* Transaction list */}
            <div className="mt-4 space-y-3">
                {hasTransactions ? (
                    transactions.slice(0, 5).map((item) => (
                        <TransactionInfoCard
                            key={item.id}
                            title={item.name}
                            icon={item.icon}
                            date={moment(item.date).format("Do MMM YYYY")}
                            amount={item.amount}
                            type={type}
                            hideDeleteBtn
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-[150px] text-center text-gray-500 bg-gradient-to-b from-gray-50 to-white border border-dashed border-gray-200 rounded-lg">
                        <p className="font-medium text-gray-700">
                            No recent {type === "income" ? "income" : "expense"} transactions
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Add a new {type === "income" ? "income" : "expense"} to see it here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Transactions;
