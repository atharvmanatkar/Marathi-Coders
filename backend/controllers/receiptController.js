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
// Get full transaction history
exports.getAllHistory = async (req, res) => {
    try {
        const history = await Receipt.find({ userId: "shubham_01" })
            .sort({ date: -1 }); // Newest first
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// Get single receipt details by ID
// Get single receipt details by ID
exports.getReceiptById = async (req, res) => {
    try {
        const receipt = await Receipt.findById(req.params.id); //
        if (!receipt) {
            return res.status(404).json({ message: "Receipt not found" }); //
        }
        res.json(receipt); //
    } catch (err) {
        res.status(500).json({ error: err.message }); //
    }
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