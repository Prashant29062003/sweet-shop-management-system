import React, {useState} from 'react'
import { useAuth } from '../context';
import { Card, Input, Alert, Button } from '../components';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async () => {
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Card className="p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🍬</div>
          <h1 className="text-3xl font-bold text-amber-800 mb-2">Sweet Shop</h1>
          <p className="text-gray-600">Management System</p>
        </div>

        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="admin@sweetshop.com"
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="••••••••"
            autoComplete="current-password"
          />

          {error && <Alert variant="error">{error}</Alert>}

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs font-semibold text-gray-700 mb-2">Demo Accounts:</p>
          <div className="space-y-1">
            <p className="text-xs text-gray-600">👑 Admin: admin@sweetshop.com / admin123</p>
            <p className="text-xs text-gray-600">👤 Staff: staff@sweetshop.com / staff123</p>
            <p className="text-xs text-gray-600">👥 User: user@sweetshop.com / user123</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login
