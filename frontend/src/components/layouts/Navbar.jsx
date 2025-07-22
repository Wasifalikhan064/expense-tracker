import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className="flex items-center justify-between lg:justify-start gap-5 bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-6 sticky top-0 z-30">
      {/* Menu toggle button for mobile */}
      <button
        className="block lg:hidden text-black"
        onClick={() => setOpenSideMenu(!openSideMenu)}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      {/* App Title */}
      <h2 className="text-lg font-bold text-black">Expense Tracker</h2>

      {/* Slide-out Side Menu for mobile */}
      {openSideMenu && (
        <div className="fixed top-[60px] left-0 w-[250px] h-full bg-white border-r border-gray-200 shadow-lg z-40 lg:hidden">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
