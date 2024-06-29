import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

const Cart = () => {
  // Hardcoded cart items
  const initialCartItems = [
    {
      id: 1,
      name: "Margherita Pizza",
      description: "Classic pizza with tomato sauce and cheese",
      quantity: 2,
      price: 8.99,
    },
    {
      id: 2,
      name: "Caesar Salad",
      description: "Fresh salad with Caesar dressing and croutons",
      quantity: 1,
      price: 6.49,
    },
    {
      id: 3,
      name: "Spaghetti Carbonara",
      description: "Pasta with creamy sauce, pancetta, and cheese",
      quantity: 3,
      price: 10.99,
    },
  ];

  const [cartItems, setCartItems] = useState(initialCartItems);

  // Hardcoded restaurant information and pickup time
  const restaurant = {
    name: "Italian Bistro",
    address: "123 Main St, Cityville",
    pickupTime: "5:30 PM",
    image: "https://placehold.co/400", // Placeholder image URL
  };

  const increaseQuantity = (itemId) => {
    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
  };

  const decreaseQuantity = (itemId) => {
    const updatedCart = cartItems.map((item) =>
      item.id === itemId && item.quantity > 0
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedCart);
  };

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
                          {item.quantity > 0 && (
                            <button
                              className="bg-gray-200 px-2 py-1 rounded-l-md"
                              onClick={() => decreaseQuantity(item.id)}
                            >
                              <FontAwesomeIcon icon={faMinus} />
                            </button>
                          )}
                          <div className="px-4 py-1 bg-gray-200">
                            {item.quantity}
                          </div>
                          <button
                            className="bg-gray-200 px-2 py-1 rounded-r-md"
                            onClick={() => increaseQuantity(item.id)}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
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
