import React, { useState } from "react";
import { useAuth } from "../context";
import { Link, useNavigate } from "react-router-dom"; 
import { Card, Input, Alert, Button } from "../components";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); 

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard/sweets");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50 px-4">
      <Card className="p-8 w-full max-w-md shadow-xl border-t-4 border-amber-600">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce-short">🍬</div>
          <h1 className="text-3xl font-bold text-amber-900 mb-2 font-serif">
            Sweet Shop
          </h1>
          <p className="text-gray-500 text-sm tracking-wide uppercase">
            Management System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@sweetshop.com"
            autoComplete="email"
            required
            autoFocus 
          />

          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {error && (
            <div className="animate-in fade-in slide-in-from-top-1">
              <Alert variant="error">
                {error}
                
                {error.includes("verify") && (
                  <button
                    type="button"
                    onClick={() => navigate("/resend-verification")}
                    className="block mt-2 underline font-bold"
                  >
                    Resend verification link?
                  </button>
                )}
              </Alert>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Login"
            )}
          </Button>

          <p className="text-center text-sm text-gray-600 pt-2">
            Need a staff account?{" "}
            <Link
              to="/register"
              className="font-bold text-amber-700 hover:underline"
            >
              Register here
            </Link>
          </p>
        </form>

        <div className="mt-8 p-4 bg-amber-50/50 rounded-xl border border-amber-100">
          <p className="text-[10px] uppercase font-bold text-amber-800 mb-3 tracking-widest">
            System Demo Credentials
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">👑 Admin</span>
              <code className="bg-white px-1 rounded border">
                admin@sweetshop.com
              </code>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">👤 Staff</span>
              <code className="bg-white px-1 rounded border">
                staff@sweetshop.com
              </code>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
