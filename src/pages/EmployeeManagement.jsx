import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const EmployeeManagement = () => {
  const { axiosAuth, API } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    department: "",
    dateOfJoining: "",
    password: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchEmployees = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axiosAuth.get(
        `${API}/api/employees?page=${page}&limit=${limit}&q=${search}`
      );
      setEmployees(res.data.data.items);
      setTotalItems(res.data.data.total);
      setTotalPages(Math.ceil(res.data.data.total / limit));
      setCurrentPage(res.data.data.page);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!formData.name || !formData.email) {
      setError("Name and email are required");
      return;
    }
    
    if (!editingId && !formData.password) {
      setError("Password is required for new employees");
      return;
    }

    try {
      if (editingId) {
        await axiosAuth.put(`${API}/api/employees/${editingId}`, formData);
        setSuccess("Employee updated successfully");
      } else {
        await axiosAuth.post(`${API}/api/employees`, formData);
        setSuccess("Employee added successfully");
      }
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        designation: "",
        department: "",
        dateOfJoining: "",
        password: "",
      });
      setEditingId(null);
      setShowForm(false);
      fetchEmployees(currentPage);
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save employee");
    }
  };

  const handleEdit = (emp) => {
    setFormData({
      name: emp.name || "",
      email: emp.email || "",
      phone: emp.phone || "",
      designation: emp.designation || "",
      department: emp.department || "",
      dateOfJoining: emp.dateOfJoining ? emp.dateOfJoining.split("T")[0] : "",
      password: "", // Don't show password when editing
    });
    setEditingId(emp._id);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axiosAuth.delete(`${API}/api/employees/${id}`);
      setSuccess("Employee deleted successfully");
      fetchEmployees(currentPage);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      designation: "",
      department: "",
      dateOfJoining: "",
      password: "",
    });
    setEditingId(null);
    setShowForm(false);
    setError("");
    setSuccess("");
  };

  //pagination 
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen p-6 text-neutral">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Employee Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="btn btn-primary"
        >
          {showForm ? "Cancel" : "Add Employee"}
        </button>
      </div>

      {/* alert */}
      {success && (
        <div className="alert alert-success mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{success}</span>
        </div>
      )}
      
      {error && (
        <div className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/*  add edit form */}
      {showForm && (
        <div className="bg-white shadow-md rounded p-6 mb-6 border border-primary/20">
          <h2 className="text-xl font-semibold mb-4 text-primary">
            {editingId ? "Edit Employee" : "Add New Employee"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Full Name *</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="input input-success bg-white w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email *</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-success bg-white w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Phone</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 234 567 8900"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input input-success bg-white w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Designation</span>
                </label>
                <input
                  type="text"
                  name="designation"
                  placeholder="Software Engineer"
                  value={formData.designation}
                  onChange={handleChange}
                  className="input input-success bg-white w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Department</span>
                </label>
                <input
                  type="text"
                  name="department"
                  placeholder="Engineering"
                  value={formData.department}
                  onChange={handleChange}
                  className="input input-success bg-white w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Date of Joining</span>
                </label>
                <input
                  type="date"
                  name="dateOfJoining"
                  value={formData.dateOfJoining}
                  onChange={handleChange}
                  className="input input-success bg-white w-full"
                />
              </div>

              {!editingId && (
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium">Password *</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="input input-success bg-white w-full"
                    required
                  />
                  <label className="label">
                    <span className="label-text-alt">Minimum 6 characters</span>
                  </label>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <button type="submit" className="btn btn-primary">
                {editingId ? "Update Employee" : "Add Employee"}
              </button>
              <button type="button" onClick={resetForm} className="btn btn-ghost">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Pagination Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full md:w-1/3">
          <div className="form-control">
            <div className="input-group">
              <input
                type="text"
                placeholder="Search employees..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input input-success bg-white w-full bg-white"
              />
            </div>
          </div>
        </div>
        
        {/* Pagination Info */}
        <div className="text-sm text-gray-600">
          Showing {(currentPage - 1) * limit + 1} to{" "}
          {Math.min(currentPage * limit, totalItems)} of {totalItems} employees
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-primary">Employees List</h2>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-2 text-gray-500">Loading employees...</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500">No employees found</p>
            {search && (
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your search
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-primary text-primary-content">
                    <th className="font-semibold">Name</th>
                    <th className="font-semibold">Email</th>
                    <th className="font-semibold">Phone</th>
                    <th className="font-semibold">Designation</th>
                    <th className="font-semibold">Department</th>
                    <th className="font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp._id} className="hover bg-white">
                      <td>
                        <div className="font-medium">{emp.name}</div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span>{emp.email}</span>
                        </div>
                      </td>
                      <td>
                        <div>{emp.phone || "-"}</div>
                      </td>
                      <td>
                        <div>
                          {emp.designation ? (
                            <span className="badge badge-outline">{emp.designation}</span>
                          ) : (
                            "-"
                          )}
                        </div>
                      </td>
                      <td>
                        <div>
                          {emp.department ? (
                            <span className="badge badge-ghost">{emp.department}</span>
                          ) : (
                            "-"
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(emp)}
                            className="btn btn-sm btn-warning"
                            title="Edit employee"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(emp._id)}
                            className="btn btn-sm btn-error"
                            title="Delete employee"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Bottom Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages} • {totalItems} total employees
                  </div>
                  <div className="join">
                    <button
                      className="join-item btn"
                      onClick={() => handlePageChange(currentPage - 1)}
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
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      className="join-item btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;