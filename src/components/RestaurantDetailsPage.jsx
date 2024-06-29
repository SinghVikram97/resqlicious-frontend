import React from "react";
import CategoryCard from "./CategoryCard";
import { useParams } from "react-router-dom";

const RestaurantDetailsPage = () => {
  const { id: restaurantId } = useParams();

  console.log(restaurantId);
  // Dummy data for restaurant details (replace with actual data)
  const restaurantDetails = {
    name: "Delicious Bites",
    ratings: 4.2,
    avgPrice: "$$",
    cuisine: "Asian Fusion",
    address: "456 Oak Street, Cityville, ABC",
    image: "https://dummyimage.com/300x200/ccc/000.jpg", // Placeholder image URL
  };

  // Dummy data for categories and dishes (replace with actual data)
  const categories = [
    {
      id: 1,
      name: "Appetizers",
      dishes: [
        {
          id: 1,
          name: "Spring Rolls",
          price: 8.99,
          description: "Crispy rolls with vegetables.",
        },
        {
          id: 2,
          name: "Chicken Wings",
          price: 12.99,
          description: "Spicy chicken wings served with dip.",
        },
      ],
    },
    {
      id: 2,
      name: "Main Course",
      dishes: [
        {
          id: 3,
          name: "Pasta Carbonara",
          price: 15.99,
          description: "Creamy pasta with bacon and cheese.",
        },
        {
          id: 4,
          name: "Grilled Salmon",
          price: 18.99,
          description: "Fresh salmon grilled to perfection.",
        },
      ],
    },
    {
      id: 3,
      name: "Desserts",
      dishes: [
        {
          id: 5,
          name: "Tiramisu",
          price: 7.99,
          description: "Classic Italian dessert with coffee flavor.",
        },
        {
          id: 6,
          name: "Cheesecake",
          price: 9.99,
          description: "Creamy cheesecake topped with berries.",
        },
      ],
    },
    {
      id: 4,
      name: "Beverages",
      dishes: [
        {
          id: 7,
          name: "Iced Tea",
          price: 2.99,
          description: "Refreshing iced tea with lemon.",
        },
        {
          id: 8,
          name: "Espresso",
          price: 3.99,
          description: "Strong Italian coffee served in a shot.",
        },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8 flex items-center">
        <div className="flex-1">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {restaurantDetails.name}
            </h1>
            <p className="text-gray-600 mb-1">
              Ratings: {restaurantDetails.ratings}
            </p>
            <p className="text-gray-600 mb-1">
              Average Price: {restaurantDetails.avgPrice}
            </p>
            <p className="text-gray-600 mb-1">
              Cuisine: {restaurantDetails.cuisine}
            </p>
            <p className="text-gray-600 mb-1">
              Address: {restaurantDetails.address}
            </p>
          </div>
        </div>
        <img
          src={restaurantDetails.image}
          alt="Restaurant"
          className="h-64 w-auto object-cover"
        />
      </div>

      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <div className="grid gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default RestaurantDetailsPage;
