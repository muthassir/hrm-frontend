import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const EmployeeManagement = () => {
  const { axiosAuth, API } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("")
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

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axiosAuth.get(`${API}/api/employees`);
      setEmployees(res.data.data.items);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await axiosAuth.put(`${API}/api/employees/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axiosAuth.post(`${API}/api/employees`, formData);
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
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save employee");
    }
  };

  // edit employee
  const handleEdit = (emp) => {
    setFormData({
      name: emp.name || "",
      email: emp.email || "",
      phone: emp.phone || "",
      designation: emp.designation || "",
      department: emp.department || "",
      dateOfJoining: emp.dateOfJoining ? emp.dateOfJoining.split("T")[0] : "",
      password: "",
    });
    setEditingId(emp._id);
  };

  // delete employee
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this employee?")) return;
    try {
      await axiosAuth.delete(`${API}/api/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  // filter employees 
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation.toLowerCase().includes(search.toLowerCase()) ||
      emp.department.toLowerCase().includes(search.toLowerCase()) ||
      (emp.phone || "").includes(search)
  );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-primary/10 via-white to-primary/5 text-neutral">
      <h1 className="text-3xl font-bold mb-4 text-primary">Employee Management</h1>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      {/* Employee add */}
      <div className="bg-white shadow-md rounded p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">{editingId ? "Edit Employee" : "Add Employee"}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="p-2 border rounded focus:ring-2 focus:ring-primary"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="p-2 border rounded focus:ring-2 focus:ring-primary"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="p-2 border rounded focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            name="designation"
            placeholder="Designation"
            value={formData.designation}
            onChange={handleChange}
            className="p-2 border rounded focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            className="p-2 border rounded focus:ring-2 focus:ring-primary"
          />
          <input
            type="date"
            name="dateOfJoining"
            value={formData.dateOfJoining}
            onChange={handleChange}
            className="p-2 border rounded focus:ring-2 focus:ring-primary"
          />
          {!editingId && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="p-2 border rounded focus:ring-2 focus:ring-primary"
              required
            />
          )}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
            >
              {editingId ? "Update" : "Add"} Employee
            </button>
          </div>
        </form>
      </div>

      {/* Search Filter */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, email, phone, designation or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 w-full border bg-white rounded focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Employees Table */}
      <div className="bg-white shadow-md rounded p-4">
        <h2 className="text-xl font-semibold mb-2 text-primary">Employees List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : filteredEmployees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Email</th>
                  <th className="border px-2 py-1">Phone</th>
                  <th className="border px-2 py-1">Designation</th>
                  <th className="border px-2 py-1">Department</th>
                  <th className="border px-2 py-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-primary/10 transition">
                    <td className="border px-2 py-1">{emp.name}</td>
                    <td className="border px-2 py-1">{emp.email}</td>
                    <td className="border px-2 py-1">{emp.phone || "-"}</td>
                    <td className="border px-2 py-1">{emp.designation || "-"}</td>
                    <td className="border px-2 py-1">{emp.department || "-"}</td>
                    <td className="border px-2 py-1 flex gap-2">
                      <button
                        onClick={() => handleEdit(emp)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(emp._id)}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No employees found.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;
