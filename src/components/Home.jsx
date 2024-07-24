import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { backend_url } from "../Constants";
import axios from "axios";
import { Link } from "react-router-dom";
import RestaurantCard from "./RestaurantCard";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (isAuthenticated) {
        try {
          const response = await axios.get(`${backend_url}/restaurants`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setRestaurants(response.data);
        } catch (error) {
          console.error("Error fetching restaurants:", error);
        }
      }
    };

    fetchRestaurants();
  }, [isAuthenticated]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.cuisine.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        {/* Search bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by cuisine..."
            value={search}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        {/* Restaurant cards */}
        <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRestaurants.map((restaurant) => (
            <Link key={restaurant.id} to={`/restaurant/${restaurant.id}`}>
              <RestaurantCard restaurant={restaurant} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
