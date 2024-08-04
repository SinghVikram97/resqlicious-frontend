import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { backend_url } from "../Constants";
import { useNavigate } from "react-router-dom";
import Stripe from "react-stripe-checkout";
import StripeCheckout from "react-stripe-checkout";

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [restaurant, setRestaurant] = useState({
    id: null, // Add restaurantId in the restaurant state
    name: "",
    address: "",
    pickupTime: "7:30 PM",
    image: "https://placehold.co/400", // Placeholder image URL
  });
  const [cartId, setCartId] = useState(null); // Add cartId state
  const [showPopup, setShowPopup] = useState(false);
  const [paymentSuccessFul, setPaymentSuccessFul] = useState(false);
  const [creditCardInfo, setCreditCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
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
        setCartId(id); // Set cartId in state

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
          ...restaurantData, // Include all restaurant data
          id: restaurantId, // Set restaurantId in state
          pickupTime: "7:30 PM",
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

  const handleToken = (token) => {
    console.log(token);
    const auth_token = localStorage.getItem("token");
    if (!auth_token) {
      throw new Error("No token found");
    }
    axios.post(`${backend_url}/payment/charge`, {
      token: token.id,
      amount: totalPrice,
      userId: user.userId,
      restaurantId: restaurant.id,
      cartId: cartId
    },
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
        },
      }
    ).then(() => {
      alert("Payment Success");
      setPaymentSuccessFul(true);
      setShowPopup(false);
      console.log("calling order creation")
      handleOrder();
      console.log("order successfully created")
    }).catch((error) => {
      alert(error);
      setPaymentSuccessFul(false);
      setShowPopup(false);
      console.log("Cannot place order as payment is unsuccessful!!!")
    });
  }


  const handleOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      // Place the order
      const orderResponse = await axios.post(
        `${backend_url}/orders`,
        {
          userId: user.userId,
          restaurantId: restaurant.id, // Use restaurant.id for restaurantId
          dishQuantities: cartItems.reduce((acc, item) => {
            acc[item.id] = item.quantity;
            return acc;
          }, {}),
          creditCardInfo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Order placed successfully:", orderResponse.data);

      // Delete the cart after placing the order
      if (cartId) {
        await axios.delete(`${backend_url}/carts/${cartId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Cart deleted successfully");
      }

      navigate("/order"); // Redirect to order success page
    } catch (error) {
      console.error("Error placing order:", error);
      // Handle error
    }
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
          {cartEmpty ? (
            <p>No items in cart. Please add items to cart.</p>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Credit Card Popup */}
      {/* {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">
              Enter Credit Card Information
            </h2>
            <input
              type="text"
              placeholder="Card Number"
              className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full"
              value={creditCardInfo.cardNumber}
              onChange={(e) =>
                setCreditCardInfo({
                  ...creditCardInfo,
                  cardNumber: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Expiry Date"
              className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full"
              value={creditCardInfo.expiryDate}
              onChange={(e) =>
                setCreditCardInfo({
                  ...creditCardInfo,
                  expiryDate: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="CVV"
              className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full"
              value={creditCardInfo.cvv}
              onChange={(e) =>
                setCreditCardInfo({ ...creditCardInfo, cvv: e.target.value })
              }
            />
            <div className="flex justify-end">
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
      )} */}
      {showPopup &&
        (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <StripeCheckout
              stripeKey="pk_test_51PjxlURoDih2UVCymfoXTAP6hX9TvV0XrlWRSBddBPDLBqA68EgjUJxTGKMJyY6tRL4EpbglQTH5sKAP9pycszXz002HcUpHpr"
              token={handleToken}
            />
          </div>
        )
      }
    </div>
  );
};

export default Cart;
