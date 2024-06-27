import React, { useState } from "react";
import DishCard from "./DishCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const CategoryCard = ({ category }) => {
  const { id, name } = category;
  const [expanded, setExpanded] = useState(false);
  const [dishes, setDishes] = useState([
    {
      id: 1,
      name: "Dish 1",
      price: 9.99,
      description: "Description for Dish 1",
      image: "https://dummyimage.com/300x200/ccc/000.jpg",
    },
    {
      id: 2,
      name: "Dish 2",
      price: 12.99,
      description: "Description for Dish 2",
      image: "https://dummyimage.com/300x200/ccc/000.jpg",
    },
    {
      id: 3,
      name: "Dish 3",
      price: 8.99,
      description: "Description for Dish 3",
      image: "https://dummyimage.com/300x200/ccc/000.jpg",
    },
  ]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
    console.log("toogled");
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
