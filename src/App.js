import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Logout from "./components/Logout";
import RestaurantDetailsPage from "./components/RestaurantDetailsPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/restaurant/:id" element={<RestaurantDetailsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
