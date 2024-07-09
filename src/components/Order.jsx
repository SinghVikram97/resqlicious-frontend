import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { backend_url } from "../Constants";

const Order = () => {
  const { user } = useAuth();
  const [orderDetails, setOrderDetails] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [hasOrder, setHasOrder] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        // Fetch order details
        const orderResponse = await axios.get(
          `${backend_url}/users/${user.userId}/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const orderData = orderResponse.data;
        setOrderDetails(orderData);

        // Fetch restaurant details
        const restaurantResponse = await axios.get(
          `${backend_url}/restaurants/${orderData.restaurantId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const restaurantData = restaurantResponse.data;
        setRestaurant(restaurantData);

        // Fetch dish details and quantities
        const dishPromises = Object.keys(orderData.dishQuantities).map(
          async (dishId) => {
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
              quantity: orderData.dishQuantities[dishId],
            };
          }
        );

        const dishes = await Promise.all(dishPromises);
        setDishes(dishes);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setHasOrder(false);
        } else {
          console.error("Error fetching order details:", error);
        }
      }
    };

    if (user) {
      fetchOrderDetails();
    }
  }, [user]);

  const totalPrice = dishes.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-10">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6">Order Status</h2>
          {hasOrder ? (
            orderDetails && restaurant ? (
              <>
                <p className="text-lg mb-4">Thank you for your order!</p>
                <div className="mb-4">
                  <p className="text-gray-600 mb-2">
                    Order Number: #{orderDetails.id}
                  </p>
                  <p className="text-gray-600 mb-2">
                    Pickup Time: {orderDetails.pickuptime}
                  </p>
                  <p className="text-gray-600 mb-2">
                    Restaurant: {restaurant.name}
                  </p>
                  <p className="text-gray-600 mb-2">
                    Address: {restaurant.address}
                  </p>
                  <p className="text-gray-600 mb-2">
                    Total Amount: ${totalPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Dishes</h3>
                  {dishes.map((item) => (
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
                          <p className="text-gray-600 mb-2">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>Loading order details...</p>
            )
          ) : (
            <p>No order has been placed.</p>
          )}
          <Link
            to="/home"
            className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 block text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Order;
