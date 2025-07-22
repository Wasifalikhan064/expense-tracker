import React from "react";
import { getInitials } from "../../utils/helper";

const CharAvatar = ({ fullName, width, height, style }) => {
  return (
    <div
      className={`
        flex items-center justify-center 
        rounded-full text-gray-900 font-bold bg-gray-100
        ${width || 'w-12'} 
        ${height || 'h-12'} 
        ${style || ''}
      `}
    >
      {getInitials(fullName || "")}
    </div>
  );
};

export default CharAvatar;
