
import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  increase?: boolean;
}

const StatCard = ({ title, value, icon, change, increase }: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
      <div className="flex justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="mt-1 text-3xl font-semibold text-gray-900">{value}</div>
        </div>
        <div className="p-2 bg-gray-100 rounded-lg">
          {icon}
        </div>
      </div>
      {change && (
        <div className="mt-3">
          <span
            className={`text-sm ${
              increase ? "text-green-600" : "text-red-600"
            }`}
          >
            {increase ? "+" : "-"} {change}
          </span>
          <span className="text-sm text-gray-500"> vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
