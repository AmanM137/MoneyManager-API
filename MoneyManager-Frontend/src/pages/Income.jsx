import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import toast from "react-hot-toast";
import IncomeList from "../components/IncomeList";
import Modal from "../components/Modal";
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
    const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });
    const [editingIncome, setEditingIncome] = useState(null);

    const fetchIncomeDetails = async () => {
        if (loading) return;
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES);
            const data = response.data || [];
            setIncomeData(data);
            if (data.length === 0) setErrorMessage("No income records found.");
        } catch (error) {
            console.error("Error fetching incomes:", error);
            const message = error.response?.data?.message || "Failed to fetch income details.";
            setErrorMessage(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const fetchIncomeCategories = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("income"));
            if (response.status === 200) setCategories(response.data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error(error.response?.data?.message || "Failed to fetch income categories.");
        }
    };

    const handleAddIncome = async (income) => {
        if (!validateIncome(income)) return;
        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_INCOME, income);
            if (response.status === 201) {
                toast.success("Income added successfully");
                setOpenAddIncomeModal(false);
                fetchIncomeDetails();
            }
        } catch (error) {
            console.error("Error adding income:", error);
            toast.error(error.response?.data?.message || "Failed to add income");
        }
    };

    const handleUpdateIncome = async (income) => {
        if (!validateIncome(income)) return;
        try {
            const response = await axiosConfig.put(API_ENDPOINTS.UPDATE_INCOME(editingIncome.id), income);
            if (response.status === 200) {
                toast.success("Income updated successfully");
                setEditingIncome(null);
                fetchIncomeDetails();
            }
        } catch (error) {
            console.error("Error updating income:", error);
            toast.error(error.response?.data?.message || "Failed to update income");
        }
    };

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

    const validateIncome = (income) => {
        const { name, amount, date, categoryId } = income;
        if (!name?.trim()) return toast.error("Please enter a name");
        if (!amount || isNaN(amount) || Number(amount) <= 0)
            return toast.error("Amount should be a valid number greater than 0");
        if (!date) return toast.error("Please select a date");
        const today = new Date().toISOString().split("T")[0];
        if (date > today) return toast.error("Date cannot be in the future");
        if (!categoryId) return toast.error("Please select a category");
        return true;
    };

    useEffect(() => {
        fetchIncomeDetails();
        fetchIncomeCategories();
    }, []);

    return (
        <Dashboard activeMenu="Income">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    <IncomeOverview
                        transactions={incomeData}
                        onAddIncome={() => setOpenAddIncomeModal(true)}
                    />

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
                            onDownload={() => {}}
                            onEmail={() => {}}
                            onEdit={(income) => setEditingIncome(income)}
                        />
                    )}

                    {/* Add Income Modal */}
                    <Modal
                        isOpen={openAddIncomeModal}
                        onClose={() => setOpenAddIncomeModal(false)}
                        title="Add Income"
                    >
                        <AddIncomeForm onAddIncome={handleAddIncome} categories={categories} />
                    </Modal>

                    {/* Edit Income Modal */}
                    <Modal
                        isOpen={!!editingIncome}
                        onClose={() => setEditingIncome(null)}
                        title="Edit Income"
                    >
                        <AddIncomeForm
                            onAddIncome={handleUpdateIncome}
                            categories={categories}
                            initialData={editingIncome}
                        />
                    </Modal>

                    {/* Delete Confirmation Modal */}
                    <Modal
                        isOpen={openDeleteAlert.show}
                        onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                        title="Delete Income"
                    >
                        <DeleteAlert
                            content="Are you sure you want to delete this income detail?"
                            onDelete={() => deleteIncome(openDeleteAlert.data)}
                        />
                    </Modal>
                </div>
            </div>
        </Dashboard>
    );
};

export default Income;
