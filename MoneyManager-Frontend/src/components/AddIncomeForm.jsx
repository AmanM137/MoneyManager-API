import { useEffect, useState } from "react";
import EmojiPickerPopup from "./EmojiPickerPopup";
import Input from "./Input";
import { LoaderCircle } from "lucide-react";

const AddIncomeForm = ({ onAddIncome, categories, initialData }) => {
  const [loading, setLoading] = useState(false);

  const [income, setIncome] = useState({
    name: "",
    amount: "",
    date: "",
    icon: "",
    categoryId: "",
  });

  // Prefill when editing
  useEffect(() => {
    if (initialData) {
      setIncome({
        name: initialData.name || "",
        amount: initialData.amount || "",
        date: initialData.date || "",
        icon: initialData.icon || "",
        categoryId: initialData.categoryId || "",
      });
    }
  }, [initialData]);

  // Default category if none selected
  useEffect(() => {
    if (categories.length > 0 && !income.categoryId) {
      setIncome((prev) => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories, income.categoryId]);

  const handleChange = (key, value) => setIncome({ ...income, [key]: value });

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onAddIncome(income);
    } finally {
      setLoading(false);
    }
  };

  const isEditing = Boolean(initialData);

  return (
    <div>
      <EmojiPickerPopup
        icon={income.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <Input
        value={income.name}
        onChange={({ target }) => handleChange("name", target.value)}
        label="Income Source"
        placeholder="e.g., Salary, Freelance"
        type="text"
      />

      <Input
        label="Category"
        value={income.categoryId}
        onChange={({ target }) => handleChange("categoryId", target.value)}
        isSelect
        options={categoryOptions}
      />

      <Input
        value={income.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder="e.g., 10000.00"
        type="number"
      />

      <Input
        value={income.date}
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
            <>{isEditing ? "Update Income" : "Add Income"}</>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddIncomeForm;
