import { Plus } from "lucide-react";
import Dashboard from "../components/Dashboard";
import { useUser } from "../hooks/useUser";
import CategoryList from "../components/CategoryList";
import { useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import AddCategoryForm from "../components/AddCategoryForm";
import DeleteAlert from "../components/DeleteAlert"; // ✅ added import

const Category = () => {
    useUser();

    const [loading, setLoading] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
    const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    }); // ✅ added state

    // Fetch categories
    const fetchCategoryDetails = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
            if (response.status === 200) {
                setCategoryData(response.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoryDetails();
    }, []);

    // Add category
    const handleAddCategory = async (category) => {
        const { name, type, icon } = category;

        if (!name.trim()) {
            toast.error("Category name is required");
            return;
        }

        const isDuplicate = categoryData.some(
            (cat) => cat.name.toLowerCase() === name.trim().toLowerCase()
        );

        if (isDuplicate) {
            toast.error("Category name already exists");
            return;
        }

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, {
                name,
                type,
                icon,
            });
            if (response.status === 201) {
                toast.success("Category added successfully");
                setOpenAddCategoryModal(false);
                fetchCategoryDetails();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add category");
        }
    };

    // Edit category
    const handleEditCategory = (categoryToEdit) => {
        setSelectedCategory(categoryToEdit);
        setOpenEditCategoryModal(true);
    };

    // Update category
    const handleUpdateCategory = async (updatedCategory) => {
        const { id, name, type, icon } = updatedCategory;
        if (!name.trim()) {
            toast.error("Category name is required");
            return;
        }

        if (!id) {
            toast.error("Category ID is missing for update");
            return;
        }

        try {
            await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(id), {
                name,
                type,
                icon,
            });
            setOpenEditCategoryModal(false);
            setSelectedCategory(null);
            toast.success("Category updated successfully");
            fetchCategoryDetails();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update category");
        }
    };

    // ✅ Delete category
    const deleteCategory = async (id) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_CATEGORY(id));
            setOpenDeleteAlert({ show: false, data: null });
            toast.success("Category deleted successfully");
            fetchCategoryDetails();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete category");
        }
    };

    return (
        <Dashboard activeMenu="Category">
            <div className="my-5 mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl font-semibold">All Categories</h2>
                    <button
                        onClick={() => setOpenAddCategoryModal(true)}
                        className="flex items-center gap-1 px-3 py-2 rounded-md font-medium bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 hover:text-purple-900 shadow-sm transition-all duration-200 cursor-pointer"
                    >
                        <Plus size={15} />
                        Add Category
                    </button>
                </div>

                {/* Category List */}
                <CategoryList
                    categories={categoryData}
                    onEditCategory={handleEditCategory}
                    onDeleteCategory={(id) => setOpenDeleteAlert({ show: true, data: id })}
                />

                {/* Add Category Modal */}
                <Modal
                    isOpen={openAddCategoryModal}
                    onClose={() => setOpenAddCategoryModal(false)}
                    title="Add Category"
                >
                    <AddCategoryForm onAddCategory={handleAddCategory} />
                </Modal>

                {/* Edit Category Modal */}
                <Modal
                    isOpen={openEditCategoryModal}
                    onClose={() => {
                        setOpenEditCategoryModal(false);
                        setSelectedCategory(null);
                    }}
                    title="Update Category"
                >
                    <AddCategoryForm
                        initialCategoryData={selectedCategory}
                        onAddCategory={handleUpdateCategory}
                        isEditing={true}
                    />
                </Modal>

                {/* ✅ Delete Category Modal */}
                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                    title="Delete Category"
                >
                    <DeleteAlert
                        content="Are you sure you want to delete this category?"
                        onDelete={() => deleteCategory(openDeleteAlert.data)}
                    />
                </Modal>
            </div>
        </Dashboard>
    );
};

export default Category;
