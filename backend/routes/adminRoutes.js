const express = require("express");
const { protect, requireAdmin } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Income = require("../models/Income");
const Expense = require("../models/Expense");

const router = express.Router();


router.get("/users", protect, requireAdmin, async (req, res) => {
    try {
        const users = await User.find({ role: 'user' })
            .select("-password")
            .sort({ createdAt: -1 });
        
        res.json({
            users,
            totalCount: users.length
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});


router.get("/stats", protect, requireAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalIncome = await Income.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalExpenses = await Expense.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        
        // Monthly statistics
        const currentMonth = new Date();
        currentMonth.setDate(1);
        currentMonth.setHours(0, 0, 0, 0);
        
        const monthlyIncome = await Income.aggregate([
            { $match: { date: { $gte: currentMonth } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        
        const monthlyExpenses = await Expense.aggregate([
            { $match: { date: { $gte: currentMonth } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        
        res.json({
            totalUsers,
            totalIncome: totalIncome[0]?.total || 0,
            totalExpenses: totalExpenses[0]?.total || 0,
            totalBalance: (totalIncome[0]?.total || 0) - (totalExpenses[0]?.total || 0),
            monthlyIncome: monthlyIncome[0]?.total || 0,
            monthlyExpenses: monthlyExpenses[0]?.total || 0
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});


router.delete("/users/:id", protect, requireAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Don't allow admin to delete themselves
        if (userId === req.user.id) {
            return res.status(400).json({ message: "Cannot delete your own account" });
        }
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        if (user.role === 'admin') {
            return res.status(400).json({ message: "Cannot delete admin users" });
        }
        
        // Delete user and their data
        await Promise.all([
            User.findByIdAndDelete(userId),
            Income.deleteMany({ userId }),
            Expense.deleteMany({ userId })
        ]);
        
        res.json({ message: "User and associated data deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;