import React, { useState, useEffect } from 'react';
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import Modal from '../../components/layouts/Modal';
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import { toast } from "react-hot-toast";
import IncomeList from "../../components/Income/IncomeList";
import DeleteAlert from "../../components/layouts/DeleteAlert";
import { useUserAuth } from "../../hooks/useUserAuth";

const Income = () => {
  useUserAuth();
  const [incomeData, setIncomeData] = useState([]);
  const [userRole, setUserRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const [openAddIncomeModel, setOpenAddIncomeModel] = useState(false);

  const fetchIncomeDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
      if (response.data) {
        setIncomeData(response.data.income || []);
        setUserRole(response.data.userRole || "user");
      }
    } catch (error) {
      console.log("Something went wrong. Please try again later.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;
    if (!source.trim()) return toast.error("Source is required.");
    if (!amount || isNaN(amount) || Number(amount) <= 0) return toast.error("Amount must be greater than 0.");
    if (!date) return toast.error("Date is required.");

    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon,
      });
      setOpenAddIncomeModel(false);
      toast.success("Income added successfully.");
      fetchIncomeDetails();
    } catch (error) {
      console.error("Error adding income:", error.response?.data?.message || error.message);
    }
  };

  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Income details deleted successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.error("Error deleting income:", error.response?.data?.message || error.message);
    }
  };

  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading income details", error);
      toast.error("Failed to download income details. Please try again later.");
    }
  };

  useEffect(() => {
    fetchIncomeDetails();
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        {userRole === "admin" && (
          <p className="text-sm mb-4 text-green-700 font-semibold">
            You are viewing all users' income records.
          </p>
        )}
        <IncomeOverview
          transactions={incomeData}
          onAddIncome={() => setOpenAddIncomeModel(true)}
        />
        <IncomeList
          transactions={incomeData}
          userRole={userRole}
          onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
          onDownload={handleDownloadIncomeDetails}
        />

        <Modal
          isOpen={openAddIncomeModel}
          onClose={() => setOpenAddIncomeModel(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure you want to delete the income detail?"
            onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
