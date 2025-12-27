import { Download, LoaderCircle, Mail } from "lucide-react"
import TransactionInfoCard from "./TransactionInfoCard"
import moment from "moment"
import { useState } from "react"


const IncomeList = ({ transactions, onDelete, onDownload, onEmail }) => {

    const [emailLoading, setEmailLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);

    const handleEmail = async () => {
        setEmailLoading(true);
        try {
            await onEmail();
        } finally {
            setEmailLoading(false);
        }
    }

    const handleDownload = async () => {
        setDownloadLoading(true);
        try {
            await onDownload();
        } finally {
            setDownloadLoading(false);
        }
    }


    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Income Sources</h5>
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={handleEmail}
                        disabled={emailLoading}
                        className="flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 text-sm font-medium px-3 py-1.5 rounded-md transition-all duration-200 cursor-pointer">
                        {emailLoading ? (
                            <>
                                <LoaderCircle className="w-4 h-4 animate-spin" />
                                Emailing...
                            </>
                        ) : (
                            <>
                                <Mail size={15} className="text-base" />Email
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={downloadLoading}
                        className="flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 text-sm font-medium px-3 py-1.5 rounded-md transition-all duration-200 cursor-pointer">
                        {downloadLoading ? (
                            <>
                                <LoaderCircle className="w-4 h-4 animate-spin" />
                                Downloading...
                            </>
                        ) : (
                            <>
                                <Download size={15} className="text-base" />Download
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Display the incomes */}
                {transactions?.map((income) => (
                    <TransactionInfoCard
                        key={income.id}
                        title={income.name}
                        icon={income.icon}
                        date={moment(income.date).format('Do MMM YYYY')}
                        amount={income.amount}
                        type={"income"}
                        onDelete={() => onDelete(income.id)}
                    />
                ))}
            </div>
        </div>
    )
}

export default IncomeList
