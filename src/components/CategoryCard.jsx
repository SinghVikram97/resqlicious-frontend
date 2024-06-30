import React, { useState, useEffect } from "react";
import axios from "axios";
import DishCard from "./DishCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { backend_url } from "../Constants"; // Assuming you have a constants file for your backend URL

const CategoryCard = ({ category }) => {
  const { id, name } = category;
  const [expanded, setExpanded] = useState(false);
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        // Fetch category details to get dish IDs
        const categoryResponse = await axios.get(
          `${backend_url}/categories/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { dishIdList } = categoryResponse.data;

        // Fetch details for each dish
        const dishPromises = dishIdList.map(async (dishId) => {
          const dishResponse = await axios.get(
            `${backend_url}/dishes/${dishId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return dishResponse.data;
        });

        const resolvedDishes = await Promise.all(dishPromises);
        setDishes(resolvedDishes);
      } catch (error) {
        console.error("Error fetching dishes:", error);
      }
    };

    if (expanded) {
      fetchDishes();
    }
  }, [expanded, id]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
      <div
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={toggleExpanded}
      >
        <h2 className="text-xl font-bold">{name}</h2>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-gray-600 ${expanded ? "transform rotate-180" : ""}`}
        />
      </div>
      {expanded && (
        <div className="p-4">
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryCard;
