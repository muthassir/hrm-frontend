import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Attendance from "./Attendance";

const Dashboard = () => {
  const { user, axiosAuth, API } = useAuth(); 

  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState({});
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async (page = 1, limit = 10) => {
    try {
      const res = await axiosAuth.get(`${API}/api/admin/attendance?page=${page}&limit=${limit}`);
      setAttendance(res.data?.data?.items || []);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
      setAttendance([]);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axiosAuth.get(`${API}/api/admin/summary`);
      setSummary(res.data?.data || {});
    } catch (err) {
      console.error("Failed to fetch summary:", err);
      setSummary({});
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axiosAuth.get(`${API}/api/employees?page=1&limit=50`);
      setEmployees(res.data?.data?.items || []);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      setEmployees([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAttendance(), fetchSummary(), fetchEmployees()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <p className="p-6 text-primary">Loading...</p>;

  return (
    user?.role === "admin" ? (
      <div className="p-6 bg-gradient-to-br from-primary/10 via-white to-primary/5 min-h-screen text-neutral">
        <h1 className="text-3xl font-bold mb-6 text-primary">Admin Dashboard</h1>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border-t-4 border-primary p-4 rounded shadow">
            <h2 className="text-lg font-semibold text-primary">Total Employees</h2>
            <p className="text-2xl font-bold">{summary.totalEmployees || 0}</p>
          </div>
          <div className="bg-white border-t-4 border-green-500 p-4 rounded shadow">
            <h2 className="text-lg font-semibold text-green-600">Present Today</h2>
            <p className="text-2xl font-bold">{summary.present || 0}</p>
          </div>
          <div className="bg-white border-t-4 border-red-500 p-4 rounded shadow">
            <h2 className="text-lg font-semibold text-red-600">Absent Today</h2>
            <p className="text-2xl font-bold">{summary.absent || 0}</p>
          </div>
          <div className="bg-white border-t-4 border-yellow-500 p-4 rounded shadow">
            <h2 className="text-lg font-semibold text-yellow-600">Late Count</h2>
            <p className="text-2xl font-bold">{summary.lateCount || 0}</p>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white p-4 rounded shadow mb-6 border border-primary/20">
          <h2 className="text-xl font-semibold mb-2 text-primary">Recent Attendance</h2>
          <table className="w-full border rounded">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-2 border border-primary/20">Employee</th>
                <th className="p-2 border border-primary/20">Check-In</th>
                <th className="p-2 border border-primary/20">Check-Out</th>
                <th className="p-2 border border-primary/20">Within Radius</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-2 text-gray-500">No records found</td>
                </tr>
              ) : (
                attendance.map((att) => (
                  <tr key={att._id} className="hover:bg-primary/10 transition">
                    <td className="border p-2">{att.user?.name || "Unknown"}</td>
                    <td className="border p-2">{att.checkIn?.time ? new Date(att.checkIn.time).toLocaleTimeString() : "-"}</td>
                    <td className="border p-2">{att.checkOut?.time ? new Date(att.checkOut.time).toLocaleTimeString() : "-"}</td>
                    <td className="border p-2">{att.checkIn?.withinRadius ? "Yes" : "No"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Employee Preview */}
        <div className="bg-white p-4 rounded shadow border border-primary/20">
          <h2 className="text-xl font-semibold mb-2 text-primary">Employee Preview</h2>
          <ul className="list-disc pl-6 text-gray-700">
            {employees.slice(0, 5).map(emp => (
              <li key={emp._id}>{emp.name} ({emp.email})</li>
            ))}
            {employees.length > 5 && <li>...and {employees.length - 5} more</li>}
          </ul>
        </div>
      </div>
    ) : (
      <Attendance /> 
    )
  );
};

export default Dashboard;
