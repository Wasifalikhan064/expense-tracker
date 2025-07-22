import React from 'react';
import CARD_2 from '../../assets/images/bg-img.png'; // Replace with a blue-toned image if needed
import { LuTrendingUpDown } from "react-icons/lu";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* LEFT SIDE: Form */}
            <div className="w-screen h-screen bg-blue-50 md:w-[60vw] px-2 md:px-12 pt-8 pb-12">
        <h2 className="text-3xl font-serif font-bold text-black">Expense Tracker</h2>
        {children}
      </div>

      {/* RIGHT SIDE: Image + Shapes */}
      <div className="hidden md:block w-[40vw] h-screen bg-blue-100 bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative">

        {/* Decorative Shapes */}
        <div className="w-48 h-48 rounded-[40px] bg-blue-500 absolute -top-7 -left-5" />
        <div className="w-48 h-56 rounded-[40px] border-[20px] border-blue-500 absolute top-[30%] -right-10" />
        <div className="w-48 h-48 rounded-[40px] bg-blue-500 absolute -bottom-7 -left-5" />

        {/* Stats Card */}
        <div className="grid grid-cols-1 z-20">
          <StatsInfoCard
            icon={<LuTrendingUpDown />}
            label="A Comprehensive Expense management application"
            value="4,50,000"
            color="bg-white"
          />
        </div>

        {/* Illustration Image */}
        <img
          src={CARD_2}
          className="w-64 lg:w-[98%] absolute bottom-10 shadow-lg shadow-blue-400/18"
          alt="Auth Visual"
        />
      </div>
    </div>
  );
};

export default AuthLayout;

const StatsInfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex gap-6 bg-blue-500 p-4 rounded-xl shadow-md shadow-blue-400/10 border border-gray-200/50 z-10">
      <div className={`w-12 h-12 flex items-center justify-center text-[26px] text-blue-500 ${color} rounded-full drop-shadow-xl`}>
        {icon}
      </div>
      <div>
        <h6 className="text-xs text-gray-100 mb-1">{label}</h6>
        <span className="text-[20px] text-white">₹{value}</span>
      </div>
    </div>
  );
};

