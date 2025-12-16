import React, {useState} from "react";
import { api } from "../../api/client";
import {Card, Input, Button} from "../../components"

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/forgot-password", { email });
      setMsg("Reset link sent! Check your email.");
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-20 p-6">
      <h3>Reset Password</h3>
      <form onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button className="w-full mt-4">Send Reset Link</Button>
      </form>
      {msg && <p className="mt-2 text-sm text-amber-600">{msg}</p>}
    </Card>
  );
};

export default ForgotPassword;
