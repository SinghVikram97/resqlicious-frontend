import React from "react";
import { Link } from "react-router-dom";

const Order = () => {
  // You can fetch order details here if needed
  // For simplicity, assuming order details are passed as props or fetched from a context

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-10">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6">Order Successful</h2>
          <p className="text-lg mb-4">Thank you for your order!</p>
          {/* Display order details */}
          {/* Example: */}
          <div className="mb-4">
            <p className="text-gray-600 mb-2">Order Number: #12345</p>
            <p className="text-gray-600 mb-2">Date: July 1, 2024</p>
            <p className="text-gray-600 mb-2">Total Amount: $56.00</p>
            {/* Add more details as needed */}
          </div>
          <Link
            to="/"
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
