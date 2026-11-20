import React, { useState } from "react";
import { useAuth } from "../context";
import { data, Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "./Navbar";
import { Card, Input, Alert, Button } from "../components";
import { api } from "../api/client";

// Google
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, fetchCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard/sweets";

  const handleGoogleSuccess = async (CredentialResponse) => {
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/google", {
        idToken: CredentialResponse.credential,
      });

      // Normalize auth state to the same flat shape as password login
      // (/auth/me returns { _id, email, username, role, permissions }).
      await fetchCurrentUser();
      navigate(redirectTo);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Google Login Failed");
    } finally {
      setLoading(false);
    }
  };

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
      navigate(redirectTo);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50 px-4 py-8">
      <Card className="p-6 w-full max-w-md shadow-xl border-t-4 border-amber-600">
        <div className="text-center mb-5">
          <div className="text-4xl mb-2 animate-bounce-short">🍬</div>
          <h1 className="text-2xl font-bold text-amber-900 font-serif">
            Sweet Shop
          </h1>
          <p className="text-gray-500 text-xs tracking-wide uppercase">
            Sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                title="Forgot password link"
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

          {/* 3. Divider and Google Button */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Login Failed")}
              theme="filled_blue"
              shape="pill"
              text="signin_with"
              width="350"
              use_fedcm_for_prompt={true}
            />
          </div>

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

        <p className="text-center text-xs text-gray-400 mt-2">
          Demo: admin@sweetshop.com / admin123
        </p>
      </Card>
    </div>
    </div>
  );
};

export default Login;
