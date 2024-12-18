const mongoose = require("mongoose");

const dashboardStatsSchema = new mongoose.Schema({
  totalPapers: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  recentActivity: [{ courseName: String, examDate: String }],
});

const DashboardStats = mongoose.model("DashboardStats", dashboardStatsSchema);

module.exports = DashboardStats;
