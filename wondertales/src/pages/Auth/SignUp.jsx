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

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter your name.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password.");
      return;
    }

    setError(null);
    
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
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-cyan-50">
      <div className="w-96 bg-white p-8 rounded-lg shadow-lg">
        <h4 className="text-2xl font-semibold text-center mb-6">Sign Up</h4>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-box mb-4 w-full"
          />

          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-box mb-4 w-full"
          />

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full"
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button type="submit" className="btn-primary w-full mt-4">CREATE ACCOUNT</button>

          <p className="text-xs text-center text-slate-500 my-4">Or</p>

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
