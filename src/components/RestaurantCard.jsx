import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faUtensils,
  faMapMarkerAlt,
  faBox,
} from "@fortawesome/free-solid-svg-icons";

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <img
        src={`http://localhost:50515/${restaurant.imageUrl}`}
        alt={restaurant.name}
        className="h-64 w-full object-cover object-center"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{restaurant.name}</h2>
        <div className="flex items-center text-gray-600 mb-2">
          <FontAwesomeIcon icon={faStar} className="mr-1" />
          <span>{restaurant.rating}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <FontAwesomeIcon icon={faUtensils} className="mr-1" />
          <span>{restaurant.cuisine}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
          <span>{restaurant.address}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FontAwesomeIcon icon={faBox} className="mr-1" />
          <span>{restaurant.quantity}</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
