import { useState, useEffect } from "react";
import { api } from "../api/client";
import { Card, Input, Button, Alert, Badge } from "../components";

const AdminUsersPage = () => {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    role: "staff",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [users, setUsers] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");

  const fetchusers = async () => {
    try {
      setListLoading(true);
      setListError("");

      const response = await api.get("/admin/users");
      const userList = response || [];

      if (Array.isArray(userList)) {
        setUsers(userList);
      }
    } catch (error) {
      setListError(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch the users."
      );
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchusers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!form.email || !form.username || !form.password) {
        throw new Error("All fields are required.");
      }

      await api.post("/admin/create-user", form);

      setSuccess(`Account for ${form.username} created successfully.`);

      setForm({ email: "", username: "", password: "", role: "staff" });

      await fetchusers();
    } catch (err) {
      setError(
        err?.response?.message || err.message || "Failed to create user."
      );
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Permanently delete this user")) return;
    try {
      await api.request(`/admin/users/${userId}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setSuccess("User deleted successfully.");
      fetchusers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setListError("Delete failed" + err.message);
    }
  };

  const handleToggleRole = async (user) => {
    const newRole = user.targetRole;
    try {
      await api.patch(`/admin/users/${user._id}/role`, { role: newRole });
      setSuccess(`Role updated to ${newRole} for ${user.username}`);
      fetchusers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setListError("Role update failed" + err.message);
    }
  };
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Create Form */}
      <div className="lg:col-span-1 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <Card className="p-6 sticky top-24">
          <h3 className="text-xl font-semibold mb-4">Create New Account</h3>
          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="mb-4">
              {success}
            </Alert>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={loading}
            />
            <Input
              label="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              disabled={loading}
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              disabled={loading}
            />
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                disabled={loading}
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
              </select>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>
        </Card>
      </div>

      {/* Right Column: User List Table */}
      <div className="lg:col-span-2">
        <h3 className="text-2xl font-semibold mb-6 text-gray-900">
          All Users ({users.length})
        </h3>

        {listError && (
          <Alert variant="error" className="mb-4">
            {listError}
          </Alert>
        )}

        {listLoading ? (
          <div className="text-center py-20 bg-white rounded-xl border animate-pulse">
            Loading user database...
          </div>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                      User Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {user.username}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          className={`text-xs font-semibold px-2 py-1 rounded-md border focus:ring-1 focus:ring-amber-500 bg-white${
                            user.role === "admin"
                              ? "text-red-600 border-red-200"
                              : user.role === "staff"
                              ? "text-blue-600 border-blue-200"
                              : "text-gray-600 border-gray-200"
                          }`}
                          value={user.role}
                          onChange={(e) =>
                            handleToggleRole({
                              ...user,
                              targetRole: e.target.value,
                            })
                          }
                        >
                          <option value="customer">Customer</option>
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-xs font-semibold text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
