import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CategoryCard from "./CategoryCard";
import { backend_url } from "../Constants"; // Import your backend URL or define it directly
import { useAuth } from "./AuthContext"; // Import useAuth from AuthContext

const RestaurantDetailsPage = () => {
  const { id: restaurantId } = useParams();
  const { user } = useAuth(); // Get user from AuthContext
  const [restaurantDetails, setRestaurantDetails] = useState({
    name: "",
    ratings: 0,
    avgPrice: "",
    cuisine: "",
    address: "",
    image: "",
  });
  const [categories, setCategories] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [cartQuantities, setCartQuantities] = useState({});

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage or context
        if (!token) {
          throw new Error("No token found");
        }

        // Fetch restaurant details
        const restaurantResponse = await axios.get(
          `${backend_url}/restaurants/${restaurantId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { name, rating, avgPrice, cuisine, address, imageUrl } =
          restaurantResponse.data;

        // Fetch menuId from restaurant response
        const { menuId } = restaurantResponse.data;

        // Fetch menu details using menuId
        const menuResponse = await axios.get(`${backend_url}/menus/${menuId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Extract categoryIds from menu response
        const { categoryIdList } = menuResponse.data;

        // Fetch categories using categoryIdList
        const categoriesPromises = categoryIdList.map(async (categoryId) => {
          const categoryResponse = await axios.get(
            `${backend_url}/categories/${categoryId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return categoryResponse.data;
        });

        const resolvedCategories = await Promise.all(categoriesPromises);

        // Set restaurant and categories state
        setRestaurantDetails({
          name,
          ratings: rating,
          avgPrice: `$${avgPrice}`,
          cuisine,
          address,
          image: imageUrl, // Placeholder image URL
        });
        setCategories(resolvedCategories);
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
        // Handle error or redirect to error page
      }
    };

    if (user) {
      fetchRestaurantDetails();
    }
  }, [restaurantId, user]);
  console.log(restaurantDetails);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8 flex items-center">
        <div className="flex-1">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {restaurantDetails.name}
            </h1>
            <p className="text-gray-600 mb-1">
              Ratings: {restaurantDetails.ratings}
            </p>
            <p className="text-gray-600 mb-1">
              Average Price: {restaurantDetails.avgPrice}
            </p>
            <p className="text-gray-600 mb-1">
              Cuisine: {restaurantDetails.cuisine}
            </p>
            <p className="text-gray-600 mb-1">
              Address: {restaurantDetails.address}
            </p>
          </div>
        </div>
        <img
          src={`http://localhost:50515/${restaurantDetails.image}`}
          alt="Restaurant"
          className="h-64 w-auto object-cover"
        />
      </div>

      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <div className="grid gap-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            restaurantId={restaurantId}
            userId={user.userId} // Use the actual user ID from AuthContext
            cartId={cartId}
            setCartId={setCartId}
            cartQuantities={cartQuantities}
            setCartQuantities={setCartQuantities}
          />
        ))}
      </div>
    </div>
  );
};

export default RestaurantDetailsPage;
