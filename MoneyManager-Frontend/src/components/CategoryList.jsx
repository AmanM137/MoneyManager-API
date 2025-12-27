import { Layers2, Pencil, Trash2 } from "lucide-react";

const CategoryList = ({ categories, onEditCategory, onDeleteCategory }) => {
    return (
        <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100/60">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold">Category Sources</h4>
            </div>

            {/* No Categories */}
            {categories.length === 0 ? (
                <div className="h-[150px] flex flex-col items-center justify-center text-center text-gray-500 border border-dashed border-gray-200 rounded-lg mt-4">
                    <Layers2 size={36} className="text-purple-400 mb-2" />
                    <p className="font-medium text-gray-700">No categories added yet</p>
                    <p className="text-xs text-gray-400 mt-1">
                        Add some categories to get started!
                    </p>
                </div>
            ) : (
                /* Categories Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="group flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all duration-200"
                        >
                            {/* Icon */}
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-50">
                                {category.icon ? (
                                    <img
                                        src={category.icon}
                                        alt={category.name}
                                        className="h-6 w-6 object-contain"
                                    />
                                ) : (
                                    <Layers2 className="text-purple-700" size={22} />
                                )}
                            </div>

                            {/* Details & Actions */}
                            <div className="flex-1 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {category.name}
                                    </p>
                                    <p className="text-xs text-gray-500 capitalize">
                                        {category.type}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onEditCategory(category)}
                                        className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => onDeleteCategory(category.id)}
                                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryList;
