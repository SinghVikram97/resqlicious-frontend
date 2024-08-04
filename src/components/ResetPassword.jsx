// ResetPassword.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { backend_url } from "../Constants";
import logo from "../images/logo.png";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing token.");
    }
  }, [token]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backend_url}/reset-password`, {
        token,
        newPassword,
      });
      setMessage("Password reset successfully.");
      setError("");
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Redirect to login after 2 seconds
    } catch (error) {
      setMessage("");
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg overflow-hidden">
        <div className="md:flex items-center">
          <div className="md:flex-shrink-0 md:w-1/2">
            <img
              className="h-full w-full object-contain"
              src={logo}
              alt="Logo"
            />
          </div>
          <div className="p-8 md:w-1/2 md:ml-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Reset Password
            </h2>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="flex items-center mb-4">
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex items-center mb-4 pl-3">
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                >
                  Reset Password
                </button>
              </div>
              {message && <p className="mt-2 text-green-600">{message}</p>}
              {error && <p className="mt-2 text-red-600">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
