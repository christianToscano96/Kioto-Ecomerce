import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore, useAuthError, useAuthLoading } from '@/store/auth';

export function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const error = useAuthError();
  const isLoading = useAuthLoading();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register({ email, password, name });
    const user = useAuthStore.getState().user;
    if (user) {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-crema-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-serif font-bold text-chocolate-900 mb-6 text-center">
            Register
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name (optional)"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

<Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            {error && <p className="text-sm text-terracota-600">{error}</p>}

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Register'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-verde-bosque-600 hover:underline">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}