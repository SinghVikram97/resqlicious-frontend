// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../src/components/AuthContext";
import ProtectedRoute from "../src/components/ProtectedRoute";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Logout from "./components/Logout";
import RestaurantDetailsPage from "./components/RestaurantDetailsPage";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<ProtectedRoute element={Home} />} />
          <Route path="/logout" element={<ProtectedRoute element={Logout} />} />
          <Route
            path="/restaurant/:id"
            element={<ProtectedRoute element={RestaurantDetailsPage} />}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
