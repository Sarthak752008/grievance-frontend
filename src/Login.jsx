import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const BASE_URL = "https://grievance-backend-e6gr.onrender.com"; // Live Render Backend URL

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/login`, formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.student));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="glass-card animate-fade" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center">Welcome Back</h2>
        {error && <div style={{ color: 'var(--error-color)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="email@example.com" 
              required 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required 
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button type="submit" style={{ width: '100%', marginTop: '0.5rem' }}>Login</button>
        </form>
        
        <p className="text-center mt-4" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
