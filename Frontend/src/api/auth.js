// src/api/auth.js
import axiosInstance from "./axiosInstance";

export const registerUser = async (userData) => {
  try {
    const res = await axiosInstance.post("/users/register", userData);
    return res.data; // { user, token } expected
  } catch (err) {
    if (err.response?.status === 409) {
      throw new Error("User with this email already exists");
    } else {
      throw new Error(err.response?.data?.message || "Registration failed");
    }
  }
};

export const loginUser = async ({ email, username, password }) => {
  try {
    const res = await axiosInstance.post("/users/login", { email, username, password });

    const accessToken = res.data?.data?.accessToken;
    const user = res.data?.data?.user;

    if (!accessToken) throw new Error("No token returned from backend");

    return { token: accessToken, user };
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    if (err.response?.status === 401) throw new Error("Invalid email/username or password");
    throw new Error(err.response?.data?.message || "Login failed. Please try again.");
  }
};

export const getCurrentUser = async () => {
  try {
    const res = await axiosInstance.get("/users/me");
    console.log("Current user response:", res.data);

    // Try different possible response structures
    if (res.data?.data?.user) {
      return res.data.data.user;
    } else if (res.data?.user) {
      return res.data.user;
    } else if (res.data?.data) {
      return res.data.data;
    } else if (res.data) {
      return res.data;
    } else {
      throw new Error("Invalid user data structure");
    }

  } catch (err) {
    console.error("getCurrentUser error:", err.response?.data || err.message);
    localStorage.removeItem("token");
    throw new Error(err.response?.data?.message || "Failed to fetch user");
  }
};

export const logoutUser = async () => {
  try {
    const res = await axiosInstance.post("/users/logout");
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Logout failed");
  }
};