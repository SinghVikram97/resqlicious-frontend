import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { backend_url } from "../Constants";
import { MDBIcon } from "mdb-react-ui-kit";
import logo from "../images/logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect to home if user is already authenticated
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backend_url}/forgot-password?email=${email}`);
      setMessage("A reset link has been sent to your email.");
      setError("");
    } catch (error) {
      setMessage("");
      if (error.response && error.response.status === 404) {
        setError("Email not found.");
      } else {
        setError("Failed to send reset link. Please try again.");
      }
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
              Forgot Password
            </h2>
            <form onSubmit={handleSendResetLink} className="space-y-4">
              <div className="flex items-center mb-4">
                <MDBIcon
                  fas
                  icon="envelope"
                  size="lg"
                  className="me-3 text-gray-400"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex items-center mb-4 pl-3">
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                >
                  Send Reset Link
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

export default ForgotPassword;
