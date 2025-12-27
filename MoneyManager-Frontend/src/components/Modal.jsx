import { useEffect } from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, children, title }) => {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        // Cleanup when modal closes or component unmounts
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex justify-center items-center bg-black/40 backdrop-blur-sm overflow-y-auto py-10 px-4">
            <div className="relative w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-100">
                {/* Header */}
                <div className="flex items-center justify-between p-5 md:p-6 border-b border-gray-100 rounded-t-xl sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button
                        onClick={onClose}
                        type="button"
                        className="text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-gray-700 rounded-lg text-sm w-9 h-9 flex justify-center items-center transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 md:p-6 text-gray-700 max-h-[75vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
