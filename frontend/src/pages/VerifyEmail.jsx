import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";

const VerifyEmail = () => {
  const { verificationToken } = useParams();
  const [status, setStatus] = useState("loading"); 
  const navigate = useNavigate();

  useEffect(() => {
    const triggerVerification = async () => {
      try {
        await api.get(`/auth/verify-email/${verificationToken}`);
        setStatus("success");
      } catch (err) {
        setStatus("error");
      }
    };
    triggerVerification();
  }, [verificationToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-xl shadow-lg">
        {status === "loading" && (
          <div className="animate-pulse">Verifying your email...</div>
        )}

        {status === "success" && (
          <>
            <div className="text-green-500 text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-6">Your account is now active. You can now login.</p>
            <Link to="/login" className="bg-amber-500 text-white px-6 py-2 rounded-lg">
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-red-500 text-5xl mb-4">X</div>
            <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-6">The link is invalid or has expired.</p>
            <Link to="/resend-verification" className="text-amber-600 font-medium">
              Resend verification link?
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;