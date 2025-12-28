import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUser } from "../hooks/useUser.jsx";
import axiosConfig from "../util/axiosConfig.js";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import Dashboard from "../components/Dashboard.jsx";
import ExpenseOverview from "../components/ExpenseOverview.jsx";
import ExpenseList from "../components/ExpenseList.jsx";
import Modal from "../components/Modal.jsx";
import AddExpenseForm from "../components/AddExpenseForm.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";

const Expense = () => {
  useUser();
  const navigate = useNavigate();
  const [expenseData, setExpenseData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });
  const [editingExpense, setEditingExpense] = useState(null);

  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSE);
      const data = response.data || [];
      setExpenseData(data);
      if (data.length === 0) setErrorMessage("No expense records found.");
    } catch (error) {
      console.error("Error fetching expenses:", error);
      const message = error.response?.data?.message || "Failed to fetch expense details.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenseCategories = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("expense"));
      if (response.status === 200) setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching expense categories:", error);
      toast.error(error.response?.data?.message || "Failed to fetch expense categories.");
    }
  };

  const validateExpense = (expense) => {
    const { name, categoryId, amount, date } = expense;
    if (!name?.trim()) return toast.error("Please enter a name");
    if (!categoryId) return toast.error("Please select a category");
    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return toast.error("Amount should be a valid number greater than 0");
    if (!date) return toast.error("Please select a date");
    const today = new Date().toISOString().split("T")[0];
    if (date > today) return toast.error("Date cannot be in the future");
    return true;
  };

  const handleAddExpense = async (expense) => {
    if (!validateExpense(expense)) return;
    try {
      const response = await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSE, {
        ...expense,
        amount: Number(expense.amount),
      });
      if (response.status === 201) {
        toast.success("Expense added successfully");
        setOpenAddExpenseModal(false);
        fetchExpenseDetails();
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error(error.response?.data?.message || "Failed to add expense.");
    }
  };

  const handleUpdateExpense = async (expense) => {
    if (!validateExpense(expense)) return;
    try {
      const response = await axiosConfig.put(
        API_ENDPOINTS.UPDATE_EXPENSE(editingExpense.id),
        { ...expense, amount: Number(expense.amount) }
      );
      if (response.status === 200) {
        toast.success("Expense updated successfully");
        setEditingExpense(null);
        fetchExpenseDetails();
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error(error.response?.data?.message || "Failed to update expense.");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense deleted successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error(error.response?.data?.message || "Failed to delete expense.");
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
    fetchExpenseCategories();
  }, []);

  return (
    <Dashboard activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <ExpenseOverview
            transactions={expenseData}
            onExpenseIncome={() => setOpenAddExpenseModal(true)}
          />

          {loading ? (
            <div className="text-center py-10 text-gray-500 font-medium">
              Loading expense data...
            </div>
          ) : errorMessage ? (
            <div className="text-center py-10 text-gray-400 font-medium">{errorMessage}</div>
          ) : (
            <ExpenseList
              transactions={expenseData}
              onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
              onDownload={() => {}}
              onEmail={() => {}}
              onEdit={(expense) => setEditingExpense(expense)}
            />
          )}

          {/* Add Expense Modal */}
          <Modal
            isOpen={openAddExpenseModal}
            onClose={() => setOpenAddExpenseModal(false)}
            title="Add Expense"
          >
            <AddExpenseForm onAddExpense={handleAddExpense} categories={categories} />
          </Modal>

          {/* Edit Expense Modal */}
          <Modal
            isOpen={!!editingExpense}
            onClose={() => setEditingExpense(null)}
            title="Edit Expense"
          >
            <AddExpenseForm
              onAddExpense={handleUpdateExpense}
              categories={categories}
              initialData={editingExpense}
            />
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({ show: false, data: null })}
            title="Delete Expense"
          >
            <DeleteAlert
              content="Are you sure you want to delete this expense detail?"
              onDelete={() => deleteExpense(openDeleteAlert.data)}
            />
          </Modal>
        </div>
      </div>
    </Dashboard>
  );
};

export default Expense;
