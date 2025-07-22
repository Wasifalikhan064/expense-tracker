import React, { useState, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import { LuImage, LuX } from "react-icons/lu";

const EmojiPickerPopup = ({ icon, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative mb-6">
      {/* Icon Picker Trigger */}
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="w-12 h-12 flex items-center justify-center text-2xl bg-purple-50 text-primary rounded-lg overflow-hidden">
          {icon ? (
            <img src={icon} alt="Icon" className="w-12 h-12 object-cover" />
          ) : (
            <LuImage />
          )}
        </div>
        <p>{icon ? "Change Icon" : "Pick Icon"}</p>
      </div>

      {/* Picker Popup */}
      {isOpen && (
        <div className="absolute top-14 left-0 z-50 w-fit max-w-[320px]">
          {/* Close Button */}
          <button
            className="absolute -top-3 -right-3 bg-white border border-gray-300 rounded-full w-7 h-7 flex items-center justify-center shadow-md z-50 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <LuX className="w-4 h-4" />
          </button>

          {/* Picker */}
          <div className="overflow-visible rounded-lg shadow-lg border border-gray-200">
            <EmojiPicker
              onEmojiClick={(emoji) => {
                onSelect(emoji?.imageUrl || "");
                setIsOpen(false);
              }}
              skinTonesDisabled
              lazyLoadEmojis
              height={350}
              width={300} // Constrain width
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPickerPopup;
