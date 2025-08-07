import { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Login successful!');
        localStorage.setItem('token', data.token);
        // Example: redirect after login
        // window.location.href = '/dashboard';
      } else {
        setMessage(data.message || 'Login failed');
      }

    } catch {
      setMessage('Error connecting to server');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-4">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-1/3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
      <p className="mt-2">
        Don't have an account? <a href="/signup" className="text-blue-500">Sign up here</a>
      </p>
    </div>
  );
}

export default Login;
