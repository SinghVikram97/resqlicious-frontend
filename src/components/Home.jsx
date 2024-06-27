import React, { useState, useEffect } from "react";
import { backend_url } from "../Constants";
import RestaurantCard from "./RestaurantCard";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
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

    // Set the restaurants
    setRestaurants(dummyRestaurants);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <div className="min-h-screen bg-gray-100">
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
