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
      console.log(response);

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
      setSuccess("New user created successfully!");
      setForm({ email: "", username: "", password: "", role: "staff" });

      await fetchusers();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to create user."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">User Management</h2>

      <div className="max-w-xl mx-auto">
        <Card className="p-6">
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
              placeholder="user@example.com"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={loading}
            />
            <Input
              label="Username"
              placeholder="unique_user_id"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              disabled={loading}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              disabled={loading}
            />

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                disabled={loading}
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
                <option value="user">Customer/User</option>
              </select>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>
        </Card>
      </div>

      {/* All users Table */}
      <div>
        <h3 className="text-2xl font-semibold mb-4 text-gray-900">
          All Users ({users.length})
        </h3>

        {listError && <Alert variant="error">{listError}</Alert>}

        {listLoading ? (
          <div className="text-center py-8 text-gray-600">
            Loading user list...
          </div>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge
                          variant={
                            user.role === "admin"
                              ? "danger"
                              : user.role === "staff"
                              ? "primary"
                              : "secondary"
                          }
                        >
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </Badge>
                      </td>
                    </tr>
                  ))}

                  {users.length === 0 && (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-8 text-gray-500"
                      >
                        No other users found.
                      </td>
                    </tr>
                  )}
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
