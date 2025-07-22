const express = require("express");
const Income = require("../models/Income");
const Expense = require("../models/Expense");
const User = require("../models/User");
const { isValidObjectId, Types } = require("mongoose");

exports.getDashboardData = async (req, res) => {
    try {
        let matchCondition = {};
        let isAdmin = req.user.role === 'admin';

        // Set match condition based on user role
        if (!isAdmin) {
            const userId = req.user.id;
            const userObjectId = new Types.ObjectId(String(userId));
            matchCondition = { userId: userObjectId };
        }
        // For admin, matchCondition remains empty to get all data

        // Get total income and expenses
        const totalIncome = await Income.aggregate([
            { $match: matchCondition },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const totalExpense = await Expense.aggregate([
            { $match: matchCondition },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        // Income transactions in the last 60 days
        const last60DaysIncomeCondition = {
            ...matchCondition,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
        };

        const last60DaysIncomeTransaction = await Income.find(
            last60DaysIncomeCondition
        ).sort({ date: -1 });

        // Total income for last 60 days
        const incomeLast60Days = last60DaysIncomeTransaction.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        // Expense transactions for the last 30 and 60 days
        const last30DaysExpenseCondition = {
            ...matchCondition,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        };

        const last60DaysExpenseCondition = {
            ...matchCondition,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
        };

        const last30DaysExpenseTransactions = await Expense.find(
            last30DaysExpenseCondition
        ).sort({ date: -1 });

        const last60DaysExpenseTransactions = await Expense.find(
            last60DaysExpenseCondition
        ).sort({ date: -1 });

        // Calculate totals
        const expensesLast60Days = last60DaysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        const expensesLast30Days = last30DaysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        // Fetch last 5 transactions
        const incomeTransactions = await Income.find(matchCondition)
            .sort({ date: -1 })
            .limit(5)
            .populate('userId', 'fullName email'); // Populate user info for admin

        const expenseTransactions = await Expense.find(matchCondition)
            .sort({ date: -1 })
            .limit(5)
            .populate('userId', 'fullName email'); // Populate user info for admin

        const lastTransactions = [
            ...incomeTransactions.map((txn) => ({
                ...txn.toObject(),
                type: "income",
            })),
            ...expenseTransactions.map((txn) => ({
                ...txn.toObject(),
                type: "expense",
            })),
        ].sort((a, b) => b.date - a.date);

        // Additional data for admin
        let adminData = {};
        if (isAdmin) {
            // Get total number of users
            const totalUsers = await User.countDocuments({ role: 'user' });
            
            // Get user-wise summary (top 5 users by total expenses)
            const userExpenseSummary = await Expense.aggregate([
                {
                    $group: {
                        _id: "$userId",
                        totalExpenses: { $sum: "$amount" },
                        transactionCount: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "_id",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                { $unwind: "$user" },
                { $match: { "user.role": "user" } },
                {
                    $project: {
                        _id: 1,
                        totalExpenses: 1,
                        transactionCount: 1,
                        userName: "$user.fullName",
                        userEmail: "$user.email"
                    }
                },
                { $sort: { totalExpenses: -1 } },
                { $limit: 5 }
            ]);

            adminData = {
                totalUsers,
                userExpenseSummary,
                viewType: 'admin'
            };
        }

        // Final response
        res.json({
            totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpenses: totalExpense[0]?.total || 0,
            last30DaysExpenses: {
                total: expensesLast30Days,
                transactions: last30DaysExpenseTransactions,
            },
            last60DaysExpenses: {
                total: expensesLast60Days,
                transactions: last60DaysExpenseTransactions,
            },
            last60DaysIncome: {
                total: incomeLast60Days,
                transactions: last60DaysIncomeTransaction,
            },
            recentTransactions: lastTransactions,
            userRole: req.user.role,
            ...adminData
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: "Server error" });
    }
};