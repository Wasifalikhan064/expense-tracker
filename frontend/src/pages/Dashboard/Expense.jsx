import React, { useState, useEffect } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import Modal from "../../components/layouts/Modal";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import ExpenseList from "../../components/Expense/ExpenseList";
import DeleteAlert from "../../components/layouts/DeleteAlert";

const Expense = () => {
  useUserAuth();
  const [expenseData, setExpenseData] = useState([]);
  const [userRole, setUserRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddExpenseModel, setOpenAddExpenseModel] = useState(false);

  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      if (response.data) {
        setExpenseData(response.data.expenses || []);
        setUserRole(response.data.userRole || "user");
      }
    } catch (error) {
      console.log("Something went wrong. Please try again later.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;
    if (!category.trim()) return toast.error("Category is required.");
    if (!amount || isNaN(amount) || Number(amount) <= 0) return toast.error("Amount should be a valid number greater than 0.");
    if (!date) return toast.error("Date is required.");

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });
      setOpenAddExpenseModel(false);
      toast.success("Expense added successfully.");
      fetchExpenseDetails();
    } catch (error) {
      console.error("Error adding expense:", error.response?.data?.message || error.message);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense deleted successfully.");
      fetchExpenseDetails();
    } catch (error) {
      console.error("Error deleting expense:", error.response?.data?.message || error.message);
    }
  };

  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expense details", error);
      toast.error("Failed to download expense details. Please try again later.");
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        {userRole === "admin" && (
          <p className="text-sm mb-4 text-green-700 font-semibold">
            You are viewing all users' expense records.
          </p>
        )}
        <ExpenseOverview
          transactions={expenseData}
          onExpenseIncome={() => setOpenAddExpenseModel(true)}
        />
        <ExpenseList
          transactions={expenseData}
          userRole={userRole}
          onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
          onDownload={handleDownloadExpenseDetails}
        />

        <Modal
          isOpen={openAddExpenseModel}
          onClose={() => setOpenAddExpenseModel(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete the expense detail?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
