import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { backend_url } from "../Constants";
import { useNavigate } from "react-router-dom";
import navbarlogo from "../images/navbarlogo.jpeg";
import RestaurantCard from "./RestaurantCard";

const Home = () => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [restaurants, setRestaurants] = useState([]);

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

    // Dummy restaurant data for demonstration
    const dummyRestaurants = [
      {
        id: 1,
        name: "Cafe Sunshine",
        image: "https://via.placeholder.com/400x300",
        rating: 4.5,
        cuisine: "Italian",
        address: "123 Main St, Cityville",
      },
      {
        id: 2,
        name: "Sushi Delight",
        image: "https://via.placeholder.com/400x300",
        rating: 4.2,
        cuisine: "Japanese",
        address: "456 Broad Ave, Townsville",
      },
      {
        id: 3,
        name: "Burger Joint",
        image: "https://via.placeholder.com/400x300",
        rating: 4.8,
        cuisine: "American",
        address: "789 Elm Rd, Villagetown",
      },
      {
        id: 4,
        name: "Spice World",
        image: "https://via.placeholder.com/400x300",
        rating: 4.0,
        cuisine: "Indian",
        address: "101 Oak Lane, Hamletville",
      },
      {
        id: 5,
        name: "Taco Terrace",
        image: "https://via.placeholder.com/400x300",
        rating: 4.3,
        cuisine: "Mexican",
        address: "567 Pine Blvd, Suburbia",
      },
      {
        id: 6,
        name: "Pizza Palace",
        image: "https://via.placeholder.com/400x300",
        rating: 4.7,
        cuisine: "Italian",
        address: "890 Maple Ave, Metropolis",
      },
      {
        id: 7,
        name: "Noodle Nest",
        image: "https://via.placeholder.com/400x300",
        rating: 4.1,
        cuisine: "Chinese",
        address: "234 Elm St, Downtown",
      },
      {
        id: 8,
        name: "BBQ Barn",
        image: "https://via.placeholder.com/400x300",
        rating: 4.6,
        cuisine: "Barbecue",
        address: "345 Oak Rd, Riverside",
      },
    ];

    setRestaurants(dummyRestaurants);

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
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
