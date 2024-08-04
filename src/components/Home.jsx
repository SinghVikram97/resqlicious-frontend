import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { backend_url } from "../Constants";
import axios from "axios";
import { Link } from "react-router-dom";
import RestaurantCard from "./RestaurantCard";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("cuisine"); // 'cuisine' or 'name'
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

  const handleSearchTypeToggle = () => {
    setSearchType((prevType) => (prevType === "cuisine" ? "name" : "cuisine"));
  };

  const filteredRestaurants = restaurants.filter((restaurant) =>
    searchType === "cuisine"
      ? restaurant.cuisine.toLowerCase().includes(search.toLowerCase())
      : restaurant.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        {/* Search bar and toggle button */}
        <div className="mb-6 flex items-center">
          <input
            type="text"
            placeholder={`Search by ${searchType}...`}
            value={search}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
          <button
            onClick={handleSearchTypeToggle}
            className="ml-4 px-2 py-1 text-sm text-green-600 border border-green-600 rounded-md shadow-sm hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Toggle to {searchType === "cuisine" ? "Name" : "Cuisine"}
          </button>
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
