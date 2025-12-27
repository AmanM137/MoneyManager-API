import { useEffect, useState } from "react"
import EmojiPickerPopup from "./EmojiPickerPopup";
import Input from "./Input";
import { LoaderCircle } from "lucide-react";


const AddIncomeForm = ({ onAddIncome, categories }) => {

    const [income, setIncome] = useState({
        name: '',
        amount: '',
        date: '',
        icon: '',
        categoryId: '',
    });

    const [loading, setLoading] = useState(false);

    const categoryOptions = categories.map(category => ({
        value: category.id,
        label: category.name
    }));

    const handleChange = (key, value) => {
        setIncome({ ...income, [key]: value });
    }

    const handleAddIncome = async () => {
        setLoading(true);
        try {
            await onAddIncome(income)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (categories.length > 0 && !income.categoryId) {
            setIncome((prev) => ({ ...prev, categoryId: categories[0].id }))
        }
    }, [categories, income.categoryId])

    return (
        <div>
            <EmojiPickerPopup
                icon={income.icon}
                onSelect={(selectedIcon) => handleChange('icon', selectedIcon)}
            />

            <Input
                value={income.name}
                onChange={({ target }) => handleChange("name", target.value)}
                label={"Income Source"}
                placeholder={"e.g., Salary, Freelance, Bonus"}
                type={"text"}
            />

            <Input
                label={"Category"}
                value={income.categoryId}
                onChange={({ target }) => handleChange("categoryId", target.value)}
                isSelect={true}
                options={categoryOptions}
            />

            <Input
                value={income.amount}
                onChange={({ target }) => handleChange("amount", target.value)}
                label={"Amount"}
                placeholder={"e.g., 500.00"}
                type={"number"}
            />

            <Input
                value={income.data}
                onChange={({ target }) => handleChange("date", target.value)}
                label={"Date"}
                placeholder={""}
                type={"date"}
            />

            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-md font-medium text-white 
      ${loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 cursor-pointer"} 
      shadow-sm hover:shadow-md transition-all duration-200`}
                    disabled={loading}
                    onClick={handleAddIncome}
                >
                    {loading ? (
                        <>
                            <LoaderCircle className="w-4 h-4 animate-spin" />
                            Adding...
                        </>
                    ) : (
                        <>
                            Add Income
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

export default AddIncomeForm
