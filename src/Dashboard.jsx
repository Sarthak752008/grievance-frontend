import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://grievance-backend.onrender.com"; // Updated to Render backend URL

const Dashboard = () => {
  const [grievances, setGrievances] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "", category: "Academic" });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/grievances`, axiosConfig);
      setGrievances(res.data);
    } catch (err) {
      console.error("Failed to fetch", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/grievances/${editingId}`, formData, axiosConfig);
        setEditingId(null);
      } else {
        await axios.post(`${API_URL}/api/grievances`, formData, axiosConfig);
      }
      setFormData({ title: "", description: "", category: "Academic" });
      fetchGrievances();
    } catch (err) {
      alert("Action failed");
    }
  };

  const handleSearch = async (e) => {
    const title = e.target.value;
    setSearchTerm(title);
    if (title.length > 2) {
      const res = await axios.get(`${API_URL}/api/grievances/search?title=${title}`, axiosConfig);
      setGrievances(res.data);
    } else if (title.length === 0) {
      fetchGrievances();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this grievance?")) {
      await axios.delete(`${API_URL}/api/grievances/${id}`, axiosConfig);
      fetchGrievances();
    }
  };

  const handleEdit = (g) => {
    setEditingId(g._id);
    setFormData({ title: g.title, description: g.description, category: g.category });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="container animate-fade">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Hello, {user.name}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your grievances efficiently</p>
        </div>
        <button onClick={handleLogout} className="btn-secondary">Logout</button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Form Section */}
        <div className="glass-card">
          <h3>{editingId ? "Update Grievance" : "Submit New Grievance"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="Academic">Academic</option>
                <option value="Hostel">Hostel</option>
                <option value="Transport">Transport</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea 
                rows="4" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                required
              ></textarea>
            </div>
            <button type="submit" style={{ width: '100%' }}>
              {editingId ? "Update Grievance" : "Submit Grievance"}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => {setEditingId(null); setFormData({title:"", description:"", category:"Academic"})}}
                className="btn-secondary" 
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* List Section */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Your Grievances ({grievances.length})</h3>
            <input 
              placeholder="Search by title..." 
              style={{ width: '200px', fontSize: '0.8rem' }}
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div style={{ overflowX: 'auto' }}>
            {grievances.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No grievances found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {grievances.map(g => (
                    <tr key={g._id}>
                      <td>
                        <div style={{ fontWeight: '600' }}>{g.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(g.date).toLocaleDateString()}</div>
                      </td>
                      <td>{g.category}</td>
                      <td>
                        <span className={`badge badge-${g.status.toLowerCase().replace(' ', '-')}`}>
                          {g.status}
                        </span>
                      </td>
                      <td style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleEdit(g)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Edit</button>
                        <button onClick={() => handleDelete(g._id)} className="btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
