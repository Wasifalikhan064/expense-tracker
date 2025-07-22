const User = require("../models/User");
const Expense = require("../models/Expense");
const XLSX = require("xlsx");

// Add Expense
exports.addExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const { icon, category, amount, date } = req.body;
        
        // Validation: checking for missing fields
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "All fields are required." });
        }
        
        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });
        
        await newExpense.save();
        res.status(200).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Get all Expenses (role-based)
exports.getAllExpense = async (req, res) => {
    try {
        let query = {};
        
        // If user is admin, get all expenses; otherwise get only user's expenses
        if (req.user.role !== 'admin') {
            query.userId = req.user.id;
        }
        
        const expenses = await Expense.find(query)
            .populate('userId', 'fullName email') // Populate user info for admin view
            .sort({ date: -1 });
        
        res.json({
            expenses,
            userRole: req.user.role,
            totalCount: expenses.length
        });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

// Delete Expense
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        
        // Regular users can only delete their own records
        // Admin can delete any record
        if (req.user.role !== 'admin' && expense.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this expense" });
        }
        
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Download Expense Excel (role-based)
exports.downloadExpenseExcel = async (req, res) => {
    try {
        let query = {};
        let filename = "expense_data.xlsx";
        
        // If user is admin, get all expenses; otherwise get only user's expenses
        if (req.user.role === 'admin') {
            filename = "all_users_expense_data.xlsx";
        } else {
            query.userId = req.user.id;
        }
        
        const expenses = await Expense.find(query)
            .populate('userId', 'fullName email')
            .sort({ date: -1 });
        
        // Format data based on user role
        const data = expenses.map((item) => {
            const baseData = {
                Category: item.category,
                Amount: item.amount,
                Date: item.date.toISOString().split("T")[0],
            };
            
            // Add user info for admin
            if (req.user.role === 'admin') {
                return {
                    ...baseData,
                    UserName: item.userId?.fullName || 'Unknown',
                    UserEmail: item.userId?.email || 'Unknown',
                };
            }
            
            return baseData;
        });
        
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Expenses");
        
        const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
        
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        
        return res.send(buffer);
    } catch (error) {
        console.error("Download error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};