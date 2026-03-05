const Receipt = require('../models/Reciept');

exports.getDashboardSummary = async (req, res) => {
    try {
        const stats = await Receipt.aggregate([
            { $match: { userId: "shubham_01" } },
            {
                $group: {
                    _id: null,
                    totalExpenses: { $sum: "$totalAmount" },
                    avgValue: { $avg: "$totalAmount" },
                    totalScanned: { $sum: 1 }
                }
            }
        ]);
        const data = stats[0] || { totalExpenses: 0, avgValue: 0, totalScanned: 0 };
        res.json({
            expenses: data.totalExpenses,
            avgValue: Math.round(data.avgValue),
            totalScanned: data.totalScanned,
            savings: 60000 - data.totalExpenses 
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getTopMerchants = async (req, res) => {
    try {
        const merchants = await Receipt.aggregate([
            { $match: { userId: "shubham_01" } },
            {
                $group: {
                    _id: "$merchantName",
                    totalSpent: { $sum: "$totalAmount" },
                    visitCount: { $sum: 1 }
                }
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 3 }
        ]);
        res.json(merchants);
    } catch (err) { res.status(500).json({ error: err.message }); }
};