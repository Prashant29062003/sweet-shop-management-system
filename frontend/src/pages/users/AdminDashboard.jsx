import { useState, useEffect, useRef } from "react";
import { Card, Button, Badge } from "../../components";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { InventoryReport } from "../../components";
import { useReactToPrint } from "react-to-print";

const AdminDashboard = () => {
  const contentRef = useRef();

  const navigate = useNavigate();
  const [liveStats, setLiveStats] = useState({
    totalUsers: 0,
    lowStockItems: 0,
    totalSweets: 0,
  });
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [sweets, setSweets] = useState([]);

  const [printOptions, setPrintOptions] = useState({
    includeSweets: true,
    includeUsers: true,
  });

  const handlePrint = useReactToPrint({
    contentRef,
    // documentTitle: "Sweet_Shop_Inventory_Report",
    documentTitle: `Sweet_Shop_Report_${new Date().toLocaleDateString().replace(/\//g, "-")}_(${new Date().getHours()}.${new Date().getMinutes()})`,
  });

  const triggerPrint = () => {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    // Format Time: HH.MM_AM/PM
    const time = `${hours}.${minutes}_${ampm}`;

    // Format Date: DD-MM-YYYY
    const date = now.toLocaleDateString().replace(/\//g, "-");
  
    const newTitle = `Sweet_Shop_Report_${date}(${time})`;
    document.title = newTitle;

    // Trigger the actual print logic
    setTimeout(() => {
      handlePrint();
    }, 100);

    // Optional: Reset it after a short delay so the tab name looks normal again
    setTimeout(() => {
      document.title = "Sweet Shop Admin";
    }, 1000);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, usersRes, sweetsRes] = await Promise.all([
          api.get("/admin/dashboard-stats"),
          api.get("/admin/users"),
          api.get("/admin/sweets"),
        ]);

        setLiveStats(statsRes?.data || statsRes);
        setUsers(usersRes?.data || usersRes);
        setSweets(sweetsRes?.data || sweetsRes);
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
      path: "/dashboard/users",
    },
    {
      label: "Low Stock Items",
      value: liveStats?.lowStockItems || "0",
      icon: "⚠️",
      path: "/dashboard/sweets",
    },
    {
      label: "Total Sweets",
      value: liveStats?.totalSweets || "0",
      icon: "🍬",
      path: "/dashboard/sweets",
    },
  ];

  const displayedUsers = Array.isArray(users)
    ? showAllUsers
      ? users
      : users.slice(0, 5)
    : [];

  if (loading)
    return <div className="p-8 text-center">Loding Dashboard...</div>;
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

      <div className="grid grid-cols-1 gap-6 mt-8">
        <Card className="overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">
              {showAllUsers
                ? "Complete User Directory"
                : "Recent User Activity"}
            </h3>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowAllUsers(!showAllUsers)}
            >
              {showAllUsers ? "Collapse List" : `View All (${users.length})`}
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase bg-gray-100 text-gray-600">
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Total Orders</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {displayedUsers.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium text-gray-900">
                        {u.username}
                      </div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={u.role === "admin" ? "info" : "secondary"}
                      >
                        {u.role?.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold">
                        {u.payments?.length || 0}
                      </span>{" "}
                      orders
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/dashboard/all-payments`)}
                      >
                        View Payments
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Print Report Settings</h3>
        <div className="flex flex-col gap-3 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={printOptions.includeSweets}
              onChange={(e) =>
                setPrintOptions({
                  ...printOptions,
                  includeSweets: e.target.checked,
                })
              }
            />
            Include Sweets Inventory
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={printOptions.includeUsers}
              onChange={(e) =>
                setPrintOptions({
                  ...printOptions,
                  includeUsers: e.target.checked,
                })
              }
            />
            Include User Directory
          </label>
        </div>

        <Button
          variant="outline"
          onClick={triggerPrint}
          disabled={!printOptions.includeSweets && !printOptions.includeUsers}
          className="border-2 hover:bg-black hover:text-white cursor-pointer"
        >
          Generate Selected PDF
        </Button>
      </Card>

      <div className="hidden">
        <div ref={contentRef}>
          <InventoryReport
            users={users}
            sweets={sweets}
            options={printOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
