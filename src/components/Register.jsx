import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const { saveToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('https://finance-back-2.onrender.com/api/auth/register', form);
      saveToken(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-20 p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200
                    sm:max-w-lg sm:px-10">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900 tracking-wide font-serif">
        Register
      </h2>
      {error && <p className="text-red-600 mb-4 text-center font-semibold">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-sm text-lg w-full"
          required
          autoComplete="username"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-sm text-lg w-full"
          required
          autoComplete="new-password"
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white py-3 rounded-lg font-semibold text-lg hover:from-blue-800 hover:to-blue-600 transition shadow-lg"
        >
          Register
        </button>
      </form>
      <p className="mt-8 text-center text-gray-600 text-lg">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
