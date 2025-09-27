
import React, { useState, useEffect } from "react";
import { loginUser, registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Register({ onAuth }) {
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [cover, setCover] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      avatar && URL.revokeObjectURL(avatar);
      cover && URL.revokeObjectURL(cover);
    };
  }, [avatar, cover]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (file, type) => {
    if (!file) return;

    const maxSize = type === "avatar" ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(
        `${type === "avatar" ? "Avatar" : "Cover image"} must be smaller than ${
          type === "avatar" ? "2MB" : "5MB"
        }`
      );
      return;
    }

    type === "avatar" ? setAvatar(file) : setCover(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!avatar) {
      setError("Avatar is required");
      setLoading(false);
      return;
    }

    try {
      // Create FormData object (this was missing!)
      const formData = new FormData();
      
      // Append text fields
      formData.append('fullname', form.fullname);
      formData.append('username', form.username);
      formData.append('email', form.email);
      formData.append('password', form.password);
      
      // Append files with correct field names (matches your backend)
      formData.append('avatar', avatar);
      if (cover) {
        formData.append('coverImage', cover);
      }

      // 1️⃣ Register user with FormData
      await registerUser(formData);

      // 2️⃣ Auto-login after registration
      const loginResponse = await loginUser({
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", loginResponse.token);
      onAuth(loginResponse.user);
      navigate("/home");

    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-red-600">
          Create Account
        </h2>

        {error && (
          <div className="text-red-500 bg-red-50 border border-red-200 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <input
          name="fullname"
          value={form.fullname}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
        <div className="relative mb-3">
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 text-sm"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        {/* Avatar Upload */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Avatar *</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files[0], "avatar")}
            className="w-full"
            required
          />
          {avatar && (
            <img
              src={URL.createObjectURL(avatar)}
              alt="Avatar Preview"
              className="w-16 h-16 rounded-full mt-2 object-cover border"
            />
          )}
        </div>

        {/* Cover Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files[0], "cover")}
            className="w-full"
          />
          {cover && (
            <img
              src={URL.createObjectURL(cover)}
              alt="Cover Preview"
              className="w-full h-24 object-cover mt-2 rounded-lg border"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-lg text-white font-medium transition ${
            loading
              ? "bg-red-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            className="text-red-600 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}