import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig.js";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import TransactionInfoCard from "../components/TransactionInfoCard.jsx";
import moment from "moment";
import Modal from "../components/Modal.jsx";
import AddIncomeForm from "../components/AddIncomeForm.jsx";
import AddExpenseForm from "../components/AddExpenseForm.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";

const Filter = () => {
  useUser();

  const [type, setType] = useState("income");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [deleteTransaction, setDeleteTransaction] = useState(null);

  // ✅ Categories state
  const [categories, setCategories] = useState([]);

  // ✅ Fetch categories dynamically when editing
  const fetchCategories = async (transactionType) => {
    try {
      const response = await axiosConfig.get(
        API_ENDPOINTS.CATEGORY_BY_TYPE(transactionType)
      );
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories.");
    }
  };

  // ✅ Load categories when an edit modal opens
  useEffect(() => {
    if (editTransaction?.transactionType) {
      fetchCategories(editTransaction.transactionType);
    }
  }, [editTransaction]);

  // ✅ Fetch transactions based on filters
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosConfig.post(API_ENDPOINTS.APPLY_FILTERS, {
        type,
        startDate,
        endDate,
        keyword,
        sortField,
        sortOrder,
      });

      const updatedData = response.data.map((t) => ({
        ...t,
        transactionType: type, // preserve income/expense context
      }));
      setTransactions(updatedData);
    } catch (error) {
      console.error("Failed to fetch transactions: ", error);
      toast.error(
        error.message || "Failed to fetch transactions. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle update
  const handleUpdate = async (updated) => {
    try {
      if (updated.transactionType === "income") {
        await axiosConfig.put(API_ENDPOINTS.UPDATE_INCOME(updated.id), updated);
      } else {
        await axiosConfig.put(
          API_ENDPOINTS.UPDATE_EXPENSE(updated.id),
          updated
        );
      }
      toast.success("Transaction updated successfully!");
      setEditTransaction(null);
      handleSearch({ preventDefault: () => {} });
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Failed to update transaction.");
    }
  };

  // ✅ Handle delete
  const handleDelete = async () => {
    try {
      if (deleteTransaction.transactionType === "income") {
        await axiosConfig.delete(
          API_ENDPOINTS.DELETE_INCOME(deleteTransaction.id)
        );
      } else {
        await axiosConfig.delete(
          API_ENDPOINTS.DELETE_EXPENSE(deleteTransaction.id)
        );
      }
      toast.success("Transaction deleted successfully!");
      setDeleteTransaction(null);
      handleSearch({ preventDefault: () => {} });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction.");
    }
  };

  return (
    <Dashboard activeMenu="Filters">
      <div className="my-5 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Filter Transactions</h2>
        </div>

        {/* Filter Form */}
        <div className="card p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-semibold">Select the filters</h5>
          </div>
          <form className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="type">
                Type
              </label>
              <select
                value={type}
                id="type"
                className="w-full border rounded px-3 py-2"
                onChange={(e) => setType(e.target.value)}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label htmlFor="startdate" className="block text-sm font-medium mb-1">
                Start Date
              </label>
              <input
                value={startDate}
                id="startdate"
                type="date"
                className="w-full border rounded px-3 py-2"
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="enddate" className="block text-sm font-medium mb-1">
                End Date
              </label>
              <input
                value={endDate}
                id="enddate"
                type="date"
                className="w-full border rounded px-3 py-2"
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="sortfield" className="block text-sm font-medium mb-1">
                Sort Field
              </label>
              <select
                value={sortField}
                id="sortfield"
                className="w-full border rounded px-3 py-2"
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="category">Category</option>
              </select>
            </div>
            <div>
              <label htmlFor="sortorder" className="block text-sm font-medium mb-1">
                Sort Order
              </label>
              <select
                value={sortOrder}
                id="sortorder"
                className="w-full border rounded px-3 py-2"
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            <div className="sm:col-span-1 md:col-span-1 flex items-end">
              <div className="w-full">
                <label htmlFor="keyword" className="block text-sm font-medium mb-1">
                  Search
                </label>
                <input
                  value={keyword}
                  id="keyword"
                  type="text"
                  placeholder="Search..."
                  className="w-full border rounded px-3 py-2"
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <button
                onClick={handleSearch}
                className="ml-2 mb-1 p-2 bg-purple-800 text-white rounded flex items-center justify-center cursor-pointer"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>

        {/* Transactions List */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-semibold">Transactions</h5>
          </div>
          {transactions.length === 0 && !loading && (
            <p className="text-gray-500">Select filters and click apply</p>
          )}
          {loading && <p className="text-gray-500">Loading Transactions...</p>}

          {transactions.map((t) => (
            <TransactionInfoCard
              key={t.id}
              title={t.name}
              icon={t.icon}
              date={moment(t.date).format("Do MMM YYYY")}
              amount={t.amount}
              type={t.transactionType}
              onEdit={() => setEditTransaction(t)}
              onDelete={() => setDeleteTransaction(t)}
            />
          ))}
        </div>

        {/* Edit Modal */}
        <Modal
          isOpen={!!editTransaction}
          onClose={() => setEditTransaction(null)}
          title={`Edit ${editTransaction?.transactionType || ""}`}
        >
          {editTransaction?.transactionType === "income" ? (
            <AddIncomeForm
              onAddIncome={(data) => handleUpdate({ ...editTransaction, ...data })}
              categories={categories}
              initialData={editTransaction}
            />
          ) : (
            <AddExpenseForm
              onAddExpense={(data) => handleUpdate({ ...editTransaction, ...data })}
              categories={categories}
              initialData={editTransaction}
            />
          )}
        </Modal>

        {/* Delete Modal */}
        <Modal
          isOpen={!!deleteTransaction}
          onClose={() => setDeleteTransaction(null)}
          title="Delete Transaction"
        >
          <DeleteAlert
            content="Are you sure you want to delete this transaction?"
            onDelete={handleDelete}
          />
        </Modal>
      </div>
    </Dashboard>
  );
};

export default Filter;
