import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const Input = ({ label, value, onChange, placeholder, type, isSelect, options }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="text-[13px] text-slate-800 block mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        {isSelect ? (
          <div className="relative">
            <select
              className="w-full appearance-none bg-white outline-none border border-gray-300 rounded-md py-2 px-3 pr-8 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              value={value}
              onChange={(e) => onChange(e)}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* custom dropdown arrow */}
            <svg
              className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        ) : (
          <input
            className="w-full bg-transparent outline-none border border-gray-300 rounded-md py-2 px-3 pr-10 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
            type={type === "password" ? (showPassword ? "text" : "password") : type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e)}
          />
        )}

        {type === "password" && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
            {showPassword ? (
              <Eye
                size={20}
                className="text-purple-600"
                onClick={toggleShowPassword}
              />
            ) : (
              <EyeOff
                size={20}
                className="text-slate-400"
                onClick={toggleShowPassword}
              />
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
