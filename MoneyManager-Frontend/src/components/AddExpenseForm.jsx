import { useState, useEffect } from "react";
import EmojiPickerPopup from "./EmojiPickerPopup.jsx";
import Input from "./Input.jsx";
import { LoaderCircle } from "lucide-react";

const AddExpenseForm = ({ onAddExpense, categories, initialData }) => {
  const [loading, setLoading] = useState(false);

  const [expense, setExpense] = useState({
    name: "",
    categoryId: "",
    amount: "",
    date: "",
    icon: "",
  });

  // Prefill data when editing
  useEffect(() => {
    if (initialData) {
      setExpense({
        name: initialData.name || "",
        categoryId: initialData.categoryId || "",
        amount: initialData.amount || "",
        date: initialData.date || "",
        icon: initialData.icon || "",
      });
    }
  }, [initialData]);

  // Set default category if available
  useEffect(() => {
    if (categories && categories.length > 0 && !expense.categoryId) {
      setExpense((prev) => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories, expense.categoryId]);

  const handleChange = (key, value) => setExpense({ ...expense, [key]: value });

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onAddExpense(expense);
    } finally {
      setLoading(false);
    }
  };

  const isEditing = Boolean(initialData);

  return (
    <div>
      <EmojiPickerPopup
        icon={expense.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <Input
        value={expense.name}
        onChange={({ target }) => handleChange("name", target.value)}
        label="Expense Name"
        placeholder="e.g., Rent, Electricity Bill"
        type="text"
      />

      <Input
        label="Category"
        value={expense.categoryId}
        onChange={({ target }) => handleChange("categoryId", target.value)}
        isSelect
        options={categoryOptions}
      />

      <Input
        value={expense.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder="e.g., 1500.00"
        type="number"
      />

      <Input
        value={expense.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        type="date"
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-md font-medium text-white 
          ${
            loading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 cursor-pointer"
          } 
          shadow-sm hover:shadow-md transition-all duration-200`}
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? (
            <>
              <LoaderCircle className="w-4 h-4 animate-spin" />
              {isEditing ? "Updating..." : "Adding..."}
            </>
          ) : (
            <>{isEditing ? "Update Expense" : "Add Expense"}</>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;
