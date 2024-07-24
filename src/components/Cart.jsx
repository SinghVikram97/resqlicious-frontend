import React, { useState, useEffect } from "react";
import axios from "axios";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Cart from './Cart';  // Adjust the path to where your Cart component is located

import { useAuth } from "./AuthContext";
import { backend_url } from "../Constants";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51Pg7gFJ9lFQOibigw8NH6aAWqkWnLgTV5kZt0BUTnhpjA4Dly6gRjwqVvxfDPNwfsTcTfMjrvS9u2hBtVWSGtcgZ000D7leFS7");

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [cartItems, setCartItems] = useState([]);
  const [restaurant, setRestaurant] = useState({
    id: null,
    name: "",
    address: "",
    pickupTime: "7:30 PM",
    image: "https://placehold.co/400",
  });
  const [cartId, setCartId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [cartEmpty, setCartEmpty] = useState(false);

  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const cartResponse = await axios.get(
          `${backend_url}/users/${user.userId}/carts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const cartData = cartResponse.data;
        const { restaurantId, dishQuantities, id } = cartData;
        setCartId(id);

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
          ...restaurantData,
          id: restaurantId,
          pickupTime: "7:30 PM",
        });

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
        if (error.response && error.response.status === 404) {
          setCartEmpty(true);
        } else {
          console.error("Error fetching cart details:", error);
        }
      }
    };

    if (user) {
      fetchCartDetails();
    }
  }, [user]);

  const handleCheckout = () => {
    setShowPopup(true);
  };

  const handleOrder = async () => {
    try {
      if (!stripe || !elements) {
        return;
      }

      const cardElement = elements.getElement(CardElement);
      const { token, error } = await stripe.createToken(cardElement);

      if (error) {
        console.error("Error creating payment token:", error);
        return;
      }

      const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      const authToken = localStorage.getItem("token");
      if (!authToken) {
        throw new Error("No token found");
      }

      const orderResponse = await axios.post(
        `${backend_url}/orders`,
        {
          userId: user.userId,
          restaurantId: restaurant.id,
          dishQuantities: cartItems.reduce((acc, item) => {
            acc[item.id] = item.quantity;
            return acc;
          }, {}),
          paymentToken: token.id,
          totalPrice: totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("Order placed successfully:", orderResponse.data);

      if (cartId) {
        await axios.delete(`${backend_url}/carts/${cartId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log("Cart deleted successfully");
      }

      navigate("/order");
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-10">
        <div className="max-w-4xl w-full bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
            {cartEmpty ? (
              <p>No items in cart. Please add items to cart.</p>
            ) : (
              <>
                <div className="flex items-start justify-between mb-6">
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
                              <p className="text-gray-600 mb-2">
                                {item.description}
                              </p>
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
              </>
            )}
          </div>
        </div>

        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">
                Enter Credit Card Information
              </h2>
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    handleOrder();
                    setShowPopup(false);
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Elements>
  );
};

export default Cart;
