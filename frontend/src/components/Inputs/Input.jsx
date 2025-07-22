import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, placeholder, label, type }) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm text-slate-800 mb-1">{label}</label>
      )}
      <div className="relative">
        <input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={value}
          onChange={onChange}
        />
        {type === "password" && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={toggleShowPassword}
          >
            {showPassword ? (
              <FaRegEye size={20} className="text-purple-600" />
            ) : (
              <FaRegEyeSlash size={20} className="text-gray-400" />
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
