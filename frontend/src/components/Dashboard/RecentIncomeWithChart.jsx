import React, { useEffect, useState } from 'react';
import CustomPieChart from '../Charts/CustomPieChart';

const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4f39f6"];

const RecentIncomeWithChart = ({ data, totalIncome }) => {
  const [chartData, setChartData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (!Array.isArray(data)) return;

    const today = new Date();
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(today.getDate() - 60);

    const filteredIncome = data
      .filter(item =>
        (item?.type === "income") &&
        new Date(item.date) >= sixtyDaysAgo &&
        item.amount > 0
      )
      .map(item => ({
        name: item.source || "Other",
        amount: item.amount,
      }));

    setChartData(filteredIncome);
    setTotalAmount(filteredIncome.reduce((sum, item) => sum + item.amount, 0));
  }, [data]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 60 Days Income</h5>
      </div>
      {chartData.length === 0 ? (
        <p className="text-sm text-gray-500">No income data to show.</p>
      ) : (
        <CustomPieChart
          data={chartData}
          label="Total Income"
          totalAmount={`${totalAmount}`}
          showTextAnchor
          colors={COLORS}
        />
      )}
    </div>
  );
};

export default RecentIncomeWithChart;
