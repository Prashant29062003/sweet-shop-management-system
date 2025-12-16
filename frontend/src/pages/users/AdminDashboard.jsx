import React, { useState, useEffect } from "react";
import { Card, Button } from "../../components";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [liveStats, setLiveStats] = useState({ totalUsers: 0, lowStockItems: 0, totalSweets: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/dashboard-stats");
        // Adjust based on your ApiResponse structure
        setLiveStats(response || response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { 
      label: "Total Users", 
      value: liveStats?.totalUsers || "0", 
      icon: "👥", 
      path: "/dashboard/users" 
    },
    {
      label: "Low Stock Items",
      value: liveStats?.lowStockItems || "0",
      icon: "⚠️",
      path: "/dashboard/inventory",
    },
    {
      label: "Total Sweets",
      value: liveStats?.totalSweets || "0",
      icon: "🍬",
      path: "/dashboard/sweets",
    },
  ];

  if (loading) return <div>Loding Dashboard...</div>
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Admin Control Panel
        </h2>
        <p className="text-gray-600">
          Welcome back! Here is a quick overview of your shop.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <span className="text-4xl">{stat.icon}</span>
            </div>
            <Button
              variant="secondary"
              className="w-full mt-4 text-sm"
              onClick={() => navigate(stat.path)}
            >
              Manage {stat.label.split(" ")[1]}
            </Button>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex gap-4">
          <Button onClick={() => navigate("/dashboard/sweets")}>
            Add New Sweet
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            Print Inventory Report
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
