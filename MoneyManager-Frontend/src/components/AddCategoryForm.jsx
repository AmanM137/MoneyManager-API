import { useEffect, useState } from "react"
import Input from "./Input"
import EmojiPickerPopup from "./EmojiPickerPopup";
import { LoaderCircle } from "lucide-react";


const AddCategoryForm = ({ onAddCategory, initialCategoryData, isEditing }) => {

    const [category, setCategory] = useState({
        name: "",
        type: "income",
        icon: ""
    })

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditing && initialCategoryData) {
            setCategory(initialCategoryData);
        } else {
            setCategory({ name: "", type: "income", icon: "" })
        }
    }, [isEditing, initialCategoryData]);

    const categoryTypeOptions = [
        { value: "income", label: "Income" },
        { value: "expense", label: "Expense" }
    ];

    const handleChange = (key, value) => {
        setCategory({ ...category, [key]: value });
    }

    const handleAddCategory = async () => {
        setLoading(true);

        try {
            await onAddCategory(category);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-4">
            <EmojiPickerPopup
                icon={category.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={category.name}
                onChange={({ target }) => handleChange("name", target.value)}
                label={"Category Name"}
                placeholder={"e.g., Freelance, Salary, Groceries"}
                type={"text"}
            />

            <Input
                value={category.type}
                onChange={({ target }) => handleChange("type", target.value)}
                label={"Category Type"}
                isSelect={true}
                options={categoryTypeOptions}
            />

            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-md font-medium text-white 
      ${loading ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 cursor-pointer"} 
      shadow-sm hover:shadow-md transition-all duration-200`}
                    disabled={loading}
                    onClick={handleAddCategory}
                >
                    {loading ? (
                        <>
                            <LoaderCircle className="w-4 h-4 animate-spin" />
                            {isEditing ? "Updating..." : "Adding..."}
                        </>
                    ) : (
                        <>
                            {isEditing ? "Update Category" : "Add Category"}
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

export default AddCategoryForm
