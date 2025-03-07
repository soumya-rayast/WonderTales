import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/PasswordInput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name) return setError("Please enter your name.");
    if (!validateEmail(email)) return setError("Please enter a valid email address.");
    if (!password || password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true); 

    try {
      const response = await axiosInstance.post("/api/users/signup", {
        email,
        password,
        fullName: name,
      });

      if (response.data?.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); 
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-cyan-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        
        {/* Title */}
        <h4 className="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-white">Sign Up</h4>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          
          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-box w-full dark:bg-gray-700 dark:text-white"
            required
            autoFocus
          />

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

          {/* Signup Button */}
          <button 
            type="submit" 
            className={`btn-primary w-full mt-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading} 
          >
            {loading ? "Signing Up..." : "CREATE ACCOUNT"}
          </button>

          {/* Divider */}
          <p className="text-xs text-center text-slate-500 dark:text-gray-400 my-4">Or</p>

          {/* Login Button */}
          <button
            type="button"
            className="btn-primary btn-light w-full"
            onClick={() => navigate('/login')}
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
