import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { saveToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      saveToken(res.data.token);
      setSuccess(true);

      // Wait for 3 seconds before navigating
      setTimeout(() => {
        setLoading(false);
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-16 px-6 py-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 sm:max-w-lg sm:px-10 md:max-w-md md:px-8">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-gray-900 tracking-wide font-serif">
        Welcome Back
      </h2>

      {error && (
        <p className="mb-4 text-center text-red-600 font-semibold bg-red-100 py-2 rounded">{error}</p>
      )}

      {loading && success && (
        <p className="mb-4 text-center text-green-700 font-semibold bg-green-100 py-2 rounded">
          Login successful! Redirecting...
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="p-3 sm:p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-300 transition shadow-sm text-base sm:text-lg w-full"
          required
          autoComplete="username"
          disabled={loading}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="p-3 sm:p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-300 transition shadow-sm text-base sm:text-lg w-full"
          required
          autoComplete="current-password"
          disabled={loading}
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white py-3 rounded-lg font-semibold text-base sm:text-lg hover:from-blue-800 hover:to-blue-600 transition shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Login'}
        </button>
      </form>

      <p className="mt-8 text-center text-gray-600 text-base sm:text-lg">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:underline font-medium">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
