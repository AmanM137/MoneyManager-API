import { LoaderCircle } from "lucide-react";
import { useState } from "react";

const DeleteAlert = ({ content, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2">
      <p className="text-sm text-slate-700">{content}</p>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleDelete}
          disabled={loading}
          type="button"
          className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-md font-medium text-white
            ${loading
              ? "bg-red-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-300"
            } 
            shadow-sm hover:shadow-md transition-all duration-200`}
        >
          {loading ? (
            <>
              <LoaderCircle className="w-4 h-4 animate-spin" />
              Deleting...
            </>
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;
