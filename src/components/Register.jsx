import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backend_url } from "../Constants";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [about, setAbout] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const user = {
      firstName,
      lastName,
      email,
      password,
      about,
      role: "ROLE_USER",
    };
    try {
      const response = await axios.post(`${backend_url}/auth/register`, user);
      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError("User with the given email already exists.");
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <textarea
        placeholder="About"
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        required
      />
      <button type="submit">Register</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default Register;
