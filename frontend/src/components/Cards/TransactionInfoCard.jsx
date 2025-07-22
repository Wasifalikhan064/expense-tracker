import React from 'react';
import {
  LuUtensils,
  LuTrendingUp,
  LuTrendingDown,
  LuTrash2,
} from 'react-icons/lu';

const TransactionInfoCard = ({
  title,
  icon,
  date,
  amount,
  type,
  hideDeleteBtn,
  onDelete,
}) => {
  const getAmountStyles = () =>
    type === 'income'
      ? 'bg-green-50 text-green-500'
      : 'bg-red-50 text-red-500';

  // Detect image URL
  const isImageUrl =
    typeof icon === 'string' &&
    (icon.startsWith('http') || icon.match(/\.(png|jpg|jpeg|gif|svg)$/i));

  // Helper to check if icon is a valid emoji character (basic check)
  // You can extend this with a more robust emoji detection if needed
  const isEmoji = (str) =>
    typeof str === 'string' &&
    str.length > 0 &&
    [...str].some((char) => /\p{Emoji}/u.test(char));

  return (
    <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100/60">
      <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full">
        {icon && (isImageUrl || isEmoji(icon)) ? (
          isImageUrl ? (
            <img src={icon} alt={title} className="w-6 h-6" />
          ) : (
            <span>{icon}</span>
          )
        ) : (
          <LuUtensils />
        )}
      </div>

      <div className="flex-1 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-700 font-medium">{title}</p>
          <p className="text-xs text-gray-400 mt-1">{date}</p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyles()}`}
          >
            <h6 className="text-xs font-medium">
              {type === 'income' ? '+' : '-'} ₹{amount}
            </h6>
            {type === 'income' ? <LuTrendingUp /> : <LuTrendingDown />}
          </div>

          {!hideDeleteBtn && (
            <button
              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={onDelete}
            >
              <LuTrash2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionInfoCard;
