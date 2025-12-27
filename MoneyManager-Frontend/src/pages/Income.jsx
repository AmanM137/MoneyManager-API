import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import toast from "react-hot-toast";
import IncomeList from "../components/IncomeList";
import Modal from "../components/Modal";
import { Plus } from "lucide-react";
import AddIncomeForm from "../components/AddIncomeForm";
import DeleteAlert from "../components/DeleteAlert";
import IncomeOverview from "../components/IncomeOverview";

const Income = () => {

    useUser();
    const [incomeData, setIncomeData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

    // Fetch income details from API 
    const fetchIncomeDetails = async () => {
        if (loading) return;
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES);

            if (response.status === 200) {
                const data = response.data || [];
                if (data.length === 0) {
                    setIncomeData([]);
                    setErrorMessage("No income records found.");
                } else {
                    setIncomeData(data);
                }
            } else {
                setErrorMessage("Failed to fetch income details.");
            }
        } catch (error) {
            console.error("Error fetching incomes:", error);
            const message = error.response?.data?.message || "Failed to fetch income details.";
            setErrorMessage(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories for income
    const fetchIncomeCategories = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("income"));
            if (response.status === 200) {
                setCategories(response.data || []);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error(error.response?.data?.message || "Failed to fetch income categories.");
        }
    };

    // Save new income details
    const handleAddIncome = async (income) => {
        const { name, amount, date, icon, categoryId } = income;

        // Validation
        if (!name.trim()) {
            toast.error("Please enter a name");
            return;
        }

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            toast.error("Amount should be a valid number greater than 0");
            return;
        }

        if (!date) {
            toast.error("Please select a date");
            return;
        }

        const today = new Date().toISOString().split("T")[0];
        if (date > today) {
            toast.error("Date cannot be in the future");
            return;
        }

        if (!categoryId) {
            toast.error("Please select a category");
            return;
        }

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_INCOME, {
                name,
                amount: Number(amount),
                date,
                icon,
                categoryId,
            });

            if (response.status === 201) {
                setOpenAddIncomeModal(false);
                toast.success("Income added successfully");
                fetchIncomeDetails();
                fetchIncomeCategories();
            }
        } catch (error) {
            console.error("Error adding income:", error);
            toast.error(error.response?.data?.message || "Failed to add income");
        }
    };

    // Delete income details
    const deleteIncome = async (id) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(id));
            setOpenDeleteAlert({ show: false, data: null });
            toast.success("Income deleted successfully");
            fetchIncomeDetails();
        } catch (error) {
            console.error("Error deleting income:", error);
            toast.error(error.response?.data?.message || "Failed to delete income");
        }
    };

    // Download income details as Excel
    const handleDownloadIncomeDetails = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.INCOME_EXCEL_DONWLOAD, {
                responseType: "blob",
            });
            const filename = "income_details.xlsx";
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Income details downloaded successfully");
        } catch (error) {
            console.error("Error downloading income:", error);
            toast.error(error.response?.data?.message || "Failed to download income details");
        }
    };

    // Email income details
    const handleEmailIncomeDetails = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_INCOME);
            if (response.status === 200) {
                toast.success("Income details emailed successfully");
            }
        } catch (error) {
            console.error("Error emailing income:", error);
            toast.error(error.response?.data?.message || "Failed to email income details");
        }
    };

    useEffect(() => {
        fetchIncomeDetails();
        fetchIncomeCategories();
    }, []);

    return (
        <Dashboard activeMenu="Income">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    {/* Income Overview */}
                    <div>
                        <IncomeOverview
                            transactions={incomeData}
                            onAddIncome={() => setOpenAddIncomeModal(true)}
                        />
                    </div>

                    {/* Income List or Empty Message */}
                    {loading ? (
                        <div className="text-center py-10 text-gray-500 font-medium">
                            Loading income data...
                        </div>
                    ) : errorMessage ? (
                        <div className="text-center py-10 text-gray-400 font-medium">
                            {errorMessage}
                        </div>
                    ) : (
                        <IncomeList
                            transactions={incomeData}
                            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
                            onDownload={handleDownloadIncomeDetails}
                            onEmail={handleEmailIncomeDetails}
                        />
                    )}

                    {/* Add Income Modal */}
                    <Modal
                        isOpen={openAddIncomeModal}
                        onClose={() => setOpenAddIncomeModal(false)}
                        title={"Add Income"}
                    >
                        <AddIncomeForm
                            onAddIncome={(income) => handleAddIncome(income)}
                            categories={categories}
                        />
                    </Modal>

                    {/* Delete Confirmation Modal */}
                    <Modal
                        isOpen={openDeleteAlert.show}
                        onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                        title={"Delete Income"}
                    >
                        <DeleteAlert
                            content={"Are you sure you want to delete this income detail?"}
                            onDelete={() => deleteIncome(openDeleteAlert.data)}
                        />
                    </Modal>
                </div>
            </div>
        </Dashboard>
    );
};

export default Income;
