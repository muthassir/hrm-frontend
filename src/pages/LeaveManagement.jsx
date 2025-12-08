import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const LeaveManagement = () => {
  const { axiosAuth, API } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    userId: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [employees, setEmployees] = useState([]);
  const limit = 10;

const fetchLeaves = async (page = 1) => {
  setLoading(true);
  try {
    let url = `${API}/api/leaves/all?page=${page}&limit=${limit}`;
    if (filters.status) url += `&status=${filters.status}`;
    if (filters.type) url += `&type=${filters.type}`;
    if (filters.userId) url += `&userId=${filters.userId}`;

    const res = await axiosAuth.get(url);
    setLeaves(res.data.data.items);
    setTotalItems(res.data.data.total);
    setTotalPages(Math.ceil(res.data.data.total / limit));
    setCurrentPage(res.data.data.page);
  } catch (err) {
    console.error("Failed to fetch leaves:", err);
  } finally {
    setLoading(false);
  }
};

  const fetchEmployees = async () => {
    try {
      const res = await axiosAuth.get(`${API}/api/employees?limit=100`);
      setEmployees(res.data.data.items);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  useEffect(() => {
    fetchLeaves();
    fetchEmployees();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchLeaves(1);
  };

  const clearFilters = () => {
    setFilters({ status: "", type: "", userId: "" });
    setCurrentPage(1);
    fetchLeaves(1);
  };

  const handleStatusUpdate = async (leaveId, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this leave?`)) return;

    try {
      await axiosAuth.put(`${API}/api/leaves/${leaveId}/status`, { status });
      fetchLeaves(currentPage);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update leave status");
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
      <h1 className="text-3xl font-bold mb-6 text-primary">Leave Management</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Leave Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All Types</option>
              <option value="casual">Casual</option>
              <option value="sick">Sick</option>
              <option value="annual">Annual</option>
              <option value="emergency">Emergency</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Employee</label>
            <select
              name="userId"
              value={filters.userId}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} ({emp.department})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Leaves Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Leave Applications</h2>
          <div className="text-sm text-gray-600">
            Total: {totalItems} leaves
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading leaves...</div>
        ) : leaves.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No leave applications found.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border p-2 text-left">Employee</th>
                    <th className="border p-2 text-left">Type</th>
                    <th className="border p-2 text-left">Period</th>
                    <th className="border p-2 text-left">Reason</th>
                    <th className="border p-2 text-left">Status</th>
                    <th className="border p-2 text-left">Applied On</th>
                    <th className="border p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave._id} className="hover:bg-gray-50">
                      <td className="border p-2">
                        <div>
                          <div className="font-medium">{leave.user?.name}</div>
                          <div className="text-sm text-gray-500">{leave.user?.department}</div>
                        </div>
                      </td>
                      <td className="border p-2">
                        <span className={`px-2 py-1 rounded text-xs ${getTypeColor(leave.type)}`}>
                          {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)}
                        </span>
                      </td>
                      <td className="border p-2">
                        <div>
                          <div>{new Date(leave.startDate).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500">to</div>
                          <div>{new Date(leave.endDate).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td className="border p-2 max-w-xs truncate">{leave.reason}</td>
                      <td className="border p-2">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(leave.status)}`}>
                          {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                        </span>
                      </td>
                      <td className="border p-2">
                        {new Date(leave.createdAt).toLocaleDateString()}
                      </td>
                      <td className="border p-2">
                        {leave.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusUpdate(leave._id, "approved")}
                              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(leave._id, "rejected")}
                              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {leave.status !== "pending" && (
                          <div className="text-sm text-gray-500">
                            Reviewed on {new Date(leave.reviewedAt).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalItems)} of {totalItems} leaves
                </div>
                <div className="join">
                  <button
                    className="join-item btn"
                    onClick={() => {
                      const prevPage = Math.max(1, currentPage - 1);
                      setCurrentPage(prevPage);
                      fetchLeaves(prevPage);
                    }}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        className={`join-item btn ${currentPage === pageNum ? "btn-primary" : ""}`}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          fetchLeaves(pageNum);
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    className="join-item btn"
                    onClick={() => {
                      const nextPage = Math.min(totalPages, currentPage + 1);
                      setCurrentPage(nextPage);
                      fetchLeaves(nextPage);
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

export default LeaveManagement;