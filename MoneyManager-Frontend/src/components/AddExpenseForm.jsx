import { useState, useEffect } from "react";
import EmojiPickerPopup from "./EmojiPickerPopup.jsx";
import Input from "./Input.jsx";
import { LoaderCircle } from "lucide-react";

// Add 'categories' prop
const AddExpenseForm = ({ onAddExpense, categories }) => {

    const [loading, setLoading] = useState(false);

    const [expense, setExpense] = useState({
        name: "",
        categoryId: "",
        amount: "",
        date: "",
        icon: "",
    });

    // Effect to set a default category if categories are loaded and none is selected
    useEffect(() => {
        if (categories && categories.length > 0 && !expense.categoryId) {
            // Automatically select the first category as default if none is chosen
            setExpense((prev) => ({ ...prev, categoryId: categories[0].id })); // Use categories[0].id for MySQL
        }
    }, [categories, expense.categoryId]);

    const handleChange = (key, value) => setExpense({ ...expense, [key]: value }); // Changed setIncome to setExpense

    // Map categories to the format expected by the reusable Input dropdown
    const categoryOptions = categories.map((cat) => ({
        value: cat.id, // Correct for MySQL 'id'
        label: `${cat.name}`, // Display icon and name in dropdown
    }));

    const handleAddExpense = async () => {
        setLoading(true);
        try {
            await onAddExpense(expense)
        } finally {
            setLoading(false);
        }
    }


    return (
        <div>
            <EmojiPickerPopup
                icon={expense.icon} // Uses expense.icon now
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={expense.name}
                onChange={({ target }) => handleChange("name", target.value)}
                label="Expense Source"
                placeholder="e.g., Electricity, Wifi"
                type="text"
            />

            {/* Replaced Input for 'Category' text with a dropdown for 'Category' */}
            <Input
                label="Category"
                value={expense.categoryId}
                onChange={({ target }) => handleChange("categoryId", target.value)}
                isSelect={true}
                options={categoryOptions}
            />

            <Input
                value={expense.amount}
                onChange={({ target }) => handleChange("amount", target.value)}
                label="Amount"
                placeholder="e.g., 150.00"
                type="number"
            />

            <Input
                value={expense.date}
                onChange={({ target }) => handleChange("date", target.value)}
                label="Date"
                placeholder=""
                type="date"
            />

            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-md font-medium text-white 
      ${loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 cursor-pointer"} 
      shadow-sm hover:shadow-md transition-all duration-200`}
                    disabled={loading}
                    onClick={handleAddExpense} // Changed income to expense
                >
                    {loading ? (
                        <>
                            <LoaderCircle className="w-4 h-4 animate-spin" />
                            Adding...
                        </>
                    ) : (
                        <>
                            Add Expense
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AddExpenseForm;