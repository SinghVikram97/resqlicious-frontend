import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

const DishCard = ({ dish }) => {
  const [quantity, setQuantity] = useState(0);

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
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
