import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const OfficeLocation = () => {
  const { axiosAuth, API } = useAuth();
  const [office, setOffice] = useState({ latitude: "", longitude: "", radius: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchOffice = async () => {
    try {
      const res = await axiosAuth.get(`${API}/api/employees/office`);
      if (res.data.data) {
        setOffice({
          latitude: res.data.data.latitude,
          longitude: res.data.data.longitude,
          radius: res.data.data.radius,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOffice();
  }, []);

  const handleChange = (e) => {
    setOffice({ ...office, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const { latitude, longitude, radius } = office;
    if (!latitude || !longitude || !radius) {
      setMessage("All fields are required");
      return;
    }
    try {
      setLoading(true);
      await axiosAuth.post(`${API}/api/employees/office`, {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius: parseFloat(radius),
      });
      setMessage("Office location updated successfully");
      fetchOffice();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update office location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center text-neutral">
      <h1 className="text-3xl font-bold mb-6">Office Location Management</h1>

      {message && <div className="mb-4 text-green-600">{message}</div>}

      <div className="bg-white shadow rounded p-6 max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Latitude</label>
            <input
              type="number"
              name="latitude"
              value={office.latitude}
              onChange={handleChange}
              step="any"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Longitude</label>
            <input
              type="number"
              name="longitude"
              value={office.longitude}
              onChange={handleChange}
              step="any"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Radius (meters)</label>
            <input
              type="number"
              name="radius"
              value={office.radius}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {loading ? "Saving..." : "Save Office Location"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OfficeLocation;
