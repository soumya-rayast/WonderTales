import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa";
import PasswordInput from '../../components/PasswordInput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  //  Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!validateEmail(email)) return setError("Please enter a valid email address.");
    if (!password) return setError("Please enter your password.");

    setLoading(true); 

    try {
      const response = await axiosInstance.post("/api/users/login", {
        email,
        password,
      });

      if (response.data?.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-cyan-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        
        {/* Title */}
        <h4 className="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-white">Login</h4>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-box w-full dark:bg-gray-700 dark:text-white"
            required
          />

          {/* Password */}
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full dark:bg-gray-700 dark:text-white"
            required
          />

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm text-center bg-red-100 p-2 rounded-lg">
              {error}
            </p>
          )}

          {/* Login Button */}
          <button 
            type="submit" 
            className={`btn-primary w-full mt-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>

          {/* Divider */}
          <p className="text-xs text-center text-slate-500 dark:text-gray-400 my-4">Or</p>

          {/* Signup Button */}
          <button
            type="button"
            className="btn-primary btn-light w-full"
            onClick={() => navigate('/signup')}
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
