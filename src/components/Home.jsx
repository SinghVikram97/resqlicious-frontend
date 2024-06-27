import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { backend_url } from "../Constants";
import { useNavigate } from "react-router-dom";
import navbarlogo from "../images/navbarlogo.jpeg";

const Home = () => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const decodedToken = jwtDecode(token);
        const { userId } = decodedToken; // Assuming 'sub' contains the userId

        setUserId(userId);

        const response = await axios.get(`${backend_url}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsername(`${response.data.firstName} ${response.data.lastName}`);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo and Company Name */}
          <div className="flex items-center">
            <img src={navbarlogo} alt="Logo" className="h-14 mr-2" />{" "}
            {/* Increased logo size */}
            <span className="text-xl font-bold">Resquilicious</span>{" "}
            {/* Adjusted text size */}
          </div>

          {/* Navigation Links and Logout */}
          <div className="flex items-center space-x-4">
            {/* Nav items */}
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Hello, {username}
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Profile
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Orders
            </a>
            {/* Logout button */}
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome, {username}</h1>
            <p className="mb-6">Your User ID: {userId}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
