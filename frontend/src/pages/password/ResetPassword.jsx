import React, { useState } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { Card, Input, Button } from "../../components";

const ResetPassword = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${resetToken}`, { newPassword });
      alert("Password reset successful!");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Set New Password</h2>
        <form onSubmit={handleReset} className="space-y-4">
          <Input
            type="password"
            label="New Password"
            placeholder="Min 6 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;
