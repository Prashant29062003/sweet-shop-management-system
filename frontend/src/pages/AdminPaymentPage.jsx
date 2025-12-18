import React, { useEffect, useState } from "react";
import { Card, Badge } from "../components/index";
import {
  adminGetAllPayments,
  adminUpdatePaymentStatus,
} from "../api/payment.api";

const AdminPaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = () => {
    setLoading(true);
    adminGetAllPayments()
      .then((res) => setPayments(res?.data || res || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Global Payment Records
      </h2>
      <Badge variant="info">{payments.length} Total Transactions</Badge>
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Date & Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.length > 0 ? (
                payments.map((p) => (
                  <tr key={p._id}>
                    <td className="px-6 py-4 text-sm">
                      <div className="font-bold">
                        {p.user?.username || "Unknown User"}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {p.user?.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">₹{p.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="font-medium">
                        {new Date(p.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(p.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>
                    {loading
                      ? "Loading payments..."
                      : "No payments records found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminPaymentPage;
