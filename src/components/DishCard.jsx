import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { backend_url } from "../Constants"; // Assuming you have a constants file for your backend URL

const DishCard = ({
  dish,
  restaurantId,
  userId,
  cartId,
  setCartId,
  cartQuantities,
  setCartQuantities,
}) => {
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(
          `${backend_url}/users/${userId}/carts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const cartData = response.data;
        if (cartData) {
          if (cartData.restaurantId != restaurantId) {
            console.log("I am deleting", cartData.restaurantId, restaurantId);
            await axios.delete(`${backend_url}/carts/${cartData.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setCartId(null);
            setCartQuantities({});
            setQuantity(0);
          } else {
            setCartId(cartData.id);
            setCartQuantities(cartData.dishQuantities);
            setQuantity(cartData.dishQuantities[dish.id] || 0);
          }
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [userId, dish.id, restaurantId, setCartId, setCartQuantities]);

  const updateCart = async (newQuantities) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const body = {
        restaurantId,
        userId,
        dishQuantities: newQuantities,
      };

      if (cartId) {
        // Update existing cart
        await axios.put(`${backend_url}/carts/${cartId}`, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Create new cart
        const response = await axios.post(`${backend_url}/carts`, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartId(response.data.id);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    const newQuantities = { ...cartQuantities, [dish.id]: newQuantity };
    setCartQuantities(newQuantities);
    updateCart(newQuantities);
  };

  const decrementQuantity = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      const newQuantities = { ...cartQuantities, [dish.id]: newQuantity };
      if (newQuantity === 0) {
        delete newQuantities[dish.id];
      }
      setCartQuantities(newQuantities);
      updateCart(newQuantities);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
      <div className="flex p-4 items-center justify-between">
        <div className="flex-grow">
          <h3 className="text-lg font-bold">{dish.name}</h3>
          <p className="text-gray-600 mb-2">${dish.price}</p>
          <p className="text-gray-600 mb-2">{dish.description}</p>
        </div>
        <div className="flex items-center">
          <img
            src={dish.image}
            alt={dish.name}
            className="h-16 w-16 object-cover object-center rounded-md"
          />
          <div className="flex ml-4">
            {quantity > 0 && (
              <button
                className="bg-gray-200 px-2 py-1 rounded-l-md"
                onClick={decrementQuantity}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
            )}
            <div className="px-4 py-1 bg-gray-200">{quantity}</div>
            <button
              className="bg-gray-200 px-2 py-1 rounded-r-md"
              onClick={incrementQuantity}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishCard;
