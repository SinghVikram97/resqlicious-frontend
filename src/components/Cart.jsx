import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext"; // Assuming you have an AuthContext to provide user information
import { backend_url } from "../Constants"; // Import your backend URL or define it directly

const Cart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [restaurant, setRestaurant] = useState({
    name: "",
    address: "",
    pickupTime: "7:30 PM",
    image: "https://placehold.co/400", // Placeholder image URL
  });

  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        // Fetch cart
        const cartResponse = await axios.get(
          `${backend_url}/users/${user.userId}/carts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const cartData = cartResponse.data;
        const { restaurantId, dishQuantities } = cartData;

        // Fetch restaurant details
        const restaurantResponse = await axios.get(
          `${backend_url}/restaurants/${restaurantId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const restaurantData = restaurantResponse.data;
        setRestaurant({
          ...restaurant,
          name: restaurantData.name,
          address: restaurantData.address,
        });

        // Fetch dish details and quantities
        const dishPromises = Object.keys(dishQuantities).map(async (dishId) => {
          const dishResponse = await axios.get(
            `${backend_url}/dishes/${dishId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const dishData = dishResponse.data;
          return {
            id: dishId,
            name: dishData.name,
            price: dishData.price,
            quantity: dishQuantities[dishId],
          };
        });

        const dishes = await Promise.all(dishPromises);
        setCartItems(dishes);
      } catch (error) {
        console.error("Error fetching cart details:", error);
      }
    };

    if (user) {
      fetchCartDetails();
    }
  }, [user]);

  const handleCheckout = () => {
    // Example: Handle checkout logic (navigate to checkout page or submit order)
    console.log("Proceed to checkout");
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-10">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
          <div className="flex items-start justify-between mb-6">
            {/* Cart Items */}
            <div className="w-2/3">
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-2">
                  Restaurant Information
                </h3>
                <p>{restaurant.name}</p>
                <p>{restaurant.address}</p>
                <p>Pickup Time: {restaurant.pickupTime}</p>
              </div>
              <div>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden mb-4"
                  >
                    <div className="flex p-4 items-center justify-between">
                      <div className="flex-grow">
                        <h3 className="text-lg font-bold">{item.name}</h3>
                        <p className="text-gray-600 mb-2">
                          ${item.price.toFixed(2)}
                        </p>
                        <p className="text-gray-600 mb-2">{item.description}</p>
                      </div>
                      <div className="flex items-center">
                        <div className="flex ml-4">
                          <div className="px-4 py-1 bg-gray-200">
                            {item.quantity}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Restaurant Image */}
            <div className="w-1/3 flex justify-end">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="h-32 w-32 object-cover object-center rounded-md"
              />
            </div>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-bold">
              Total: ${totalPrice.toFixed(2)}
            </h3>
          </div>
          <button
            onClick={handleCheckout}
            className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
