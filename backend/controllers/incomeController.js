const User = require("../models/User");
const Income = require("../models/Income");
const XLSX = require("xlsx");

// Add Income Source
exports.addIncome = async (req, res) => {
    const userId = req.user.id;
    try {
        const { icon, source, amount, date } = req.body;
        
        // Validation: checking for missing fields
        if (!source || !amount || !date) {
            return res.status(400).json({ message: "All fields are required." });
        }
        
        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        });
        
        await newIncome.save();
        res.status(200).json(newIncome);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Get all Income Sources (role-based)
exports.getAllIncome = async (req, res) => {
    try {
        let query = {};
        
        // If user is admin, get all incomes; otherwise get only user's income
        if (req.user.role !== 'admin') {
            query.userId = req.user.id;
        }
        
        const income = await Income.find(query)
            .populate('userId', 'fullName email') // Populate user info for admin view
            .sort({ date: -1 });
        
        res.json({
            income,
            userRole: req.user.role,
            totalCount: income.length
        });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

// Delete Income Source
exports.deleteIncome = async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);
        
        if (!income) {
            return res.status(404).json({ message: "Income not found" });
        }
        
        // Regular users can only delete their own records
        // Admin can delete any record
        if (req.user.role !== 'admin' && income.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this income" });
        }
        
        await Income.findByIdAndDelete(req.params.id);
        res.json({ message: "Income deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Download Income Excel (role-based)
exports.downloadIncomeExcel = async (req, res) => {
    try {
        let query = {};
        let filename = "income_data.xlsx";
        
        // If user is admin, get all incomes; otherwise get only user's income
        if (req.user.role === 'admin') {
            filename = "all_users_income_data.xlsx";
        } else {
            query.userId = req.user.id;
        }
        
        const income = await Income.find(query)
            .populate('userId', 'fullName email')
            .sort({ date: -1 });
        
        // Format data based on user role
        const data = income.map((item) => {
            const baseData = {
                Source: item.source,
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
        XLSX.utils.book_append_sheet(wb, ws, "Income");
        
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