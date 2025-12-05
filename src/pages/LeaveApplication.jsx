// pages/LeaveApplication.js - Employee leave application
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const LeaveApplication = () => {
  const { axiosAuth, API, user } = useAuth();
  const [formData, setFormData] = useState({
    type: "casual",
    startDate: "",
    endDate: "",
    reason: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [myLeaves, setMyLeaves] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const fetchMyLeaves = async (page = 1) => {
    try {
      const res = await axiosAuth.get(
        `${API}/api/leaves/my-leaves?page=${page}&limit=${limit}`
      );
      setMyLeaves(res.data.data.items);
      setTotalPages(Math.ceil(res.data.data.total / limit));
      setCurrentPage(res.data.data.page);
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    
    if (!formData.startDate || !formData.endDate || !formData.reason.trim()) {
      setMessage("Please fill all required fields");
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setMessage("Start date must be before end date");
      return;
    }

    setLoading(true);
    try {
      await axiosAuth.post(`${API}/api/leaves/apply`, formData);
      setMessage("Leave application submitted successfully!");
      setFormData({
        type: "casual",
        startDate: "",
        endDate: "",
        reason: ""
      });
      fetchMyLeaves(1);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to apply for leave");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "sick": return "bg-red-50 text-red-700";
      case "casual": return "bg-blue-50 text-blue-700";
      case "annual": return "bg-green-50 text-green-700";
      case "emergency": return "bg-orange-50 text-orange-700";
      default: return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen p-6 text-neutral">
      <h1 className="text-3xl font-bold mb-6 text-primary">Leave Application</h1>

      {/* Application Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Apply for Leave</h2>
        
        {message && (
          <div className={`mb-4 p-3 rounded ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Leave Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                required
              >
                <option value="casual">Casual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="annual">Annual Leave</option>
                <option value="emergency">Emergency Leave</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
              placeholder="Please provide a reason for your leave..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition disabled:opacity-70"
          >
            {loading ? "Submitting..." : "Submit Leave Application"}
          </button>
        </form>
      </div>

      {/* My Leave History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">My Leave History</h2>
        
        {myLeaves.length === 0 ? (
          <p className="text-gray-500">No leave applications yet.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border p-2 text-left">Type</th>
                    <th className="border p-2 text-left">Start Date</th>
                    <th className="border p-2 text-left">End Date</th>
                    <th className="border p-2 text-left">Reason</th>
                    <th className="border p-2 text-left">Status</th>
                    <th className="border p-2 text-left">Applied On</th>
                  </tr>
                </thead>
                <tbody>
                  {myLeaves.map((leave) => (
                    <tr key={leave._id} className="hover:bg-gray-50">
                      <td className="border p-2">
                        <span className={`px-2 py-1 rounded text-xs ${getTypeColor(leave.type)}`}>
                          {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)}
                        </span>
                      </td>
                      <td className="border p-2">
                        {new Date(leave.startDate).toLocaleDateString()}
                      </td>
                      <td className="border p-2">
                        {new Date(leave.endDate).toLocaleDateString()}
                      </td>
                      <td className="border p-2">{leave.reason}</td>
                      <td className="border p-2">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(leave.status)}`}>
                          {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                        </span>
                      </td>
                      <td className="border p-2">
                        {new Date(leave.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <div className="join">
                  <button
                    className="join-item btn"
                    onClick={() => {
                      setCurrentPage(prev => Math.max(1, prev - 1));
                      fetchMyLeaves(currentPage - 1);
                    }}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button className="join-item btn no-animation">
                    Page {currentPage} of {totalPages}
                  </button>
                  <button
                    className="join-item btn"
                    onClick={() => {
                      setCurrentPage(prev => Math.min(totalPages, prev + 1));
                      fetchMyLeaves(currentPage + 1);
                    }}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LeaveApplication;