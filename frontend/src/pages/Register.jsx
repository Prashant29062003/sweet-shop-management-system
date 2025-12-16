import { useState } from "react";
import { api } from "../api/client";
import { Card, Input, Button, Alert } from "../components";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({ email: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      // POST to /auth/register (public route)
      await api.post("/auth/register", formData);
      
      setStatus({ 
        type: "success", 
        message: "Registration successful! Please check your email to verify your account." 
      });
      setFormData({ email: "", username: "", password: "" });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setStatus({ type: "error", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-amber-600">Create Account</h2>
        
        {status.message && (
          <Alert variant={status.type} className="mb-4">{status.message}</Alert>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <Input 
            label="Username" 
            value={formData.username} 
            onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase()})}
            required 
            autoComplete="username"
          />
          <Input 
            label="Email" 
            type="email" 
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required 
            autoComplete="email"
          />
          <Input 
            label="Password" 
            type="password" 
            value={formData.password} 
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required 
            autoComplete="new-password"
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-amber-600 hover:underline">Login</Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;