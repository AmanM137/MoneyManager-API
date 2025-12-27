import { Trash, Upload, User } from "lucide-react";
import { useRef } from "react";

const ProfilePhotoSelector = ({ image, setImage, previewUrl, setPreviewUrl }) => {
    const inputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            e.target.value = "";
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    const onChooseFile = () => inputRef.current?.click();

    return (
        <div className="flex justify-center mb-6">
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageChange}
                className="hidden"
            />

            {!image ? (
                <div className="w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full relative">
                    <User className="text-purple-500" size={35} />
                    <button
                        type="button"
                        onClick={onChooseFile}
                        className="w-8 h-8 flex items-center justify-center bg-purple-600 text-white rounded-full absolute -bottom-1 -right-1">
                        <Upload size={15} />
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <img src={previewUrl} alt="profile" className="w-20 h-20 rounded-full object-cover" />
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="w-8 h-8 flex items-center justify-center bg-red-800 text-white rounded-full absolute -bottom-1 -right-1">
                        <Trash size={15} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfilePhotoSelector;
