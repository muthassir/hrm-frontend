import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Attendance from "./Attendance";

const Dashboard = () => {
  const { user, axiosAuth, API } = useAuth(); 

  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState({});
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchAttendance = async (page = 1) => {
    try {
      const res = await axiosAuth.get(`${API}/api/admin/attendance?page=${page}&limit=${limit}`);
      setAttendance(res.data?.data?.items || []);
      setTotalPages(Math.ceil(res.data?.data?.total / limit));
      setCurrentPage(res.data?.data?.page);
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
      const res = await axiosAuth.get(`${API}/api/employees?page=1&limit=5`);
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

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    user?.role === "admin" ? (
      <div className="p-6 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-white shadow-lg">
            <div className="card-body p-4">
              <div className="flex items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-600">Total Employees</h2>
                  <p className="text-3xl font-bold text-primary">{summary.totalEmployees || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-white shadow-lg">
            <div className="card-body p-4">
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-600">Present Today</h2>
                  <p className="text-3xl font-bold text-green-600">{summary.present || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-white shadow-lg">
            <div className="card-body p-4">
              <div className="flex items-center">
                <div className="rounded-full bg-red-100 p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-600">Absent Today</h2>
                  <p className="text-3xl font-bold text-red-600">{summary.absent || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-white shadow-lg">
            <div className="card-body p-4">
              <div className="flex items-center">
                <div className="rounded-full bg-yellow-100 p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-600">Late Today</h2>
                  <p className="text-3xl font-bold text-yellow-600">{summary.lateCount || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Attendance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 text-primary">
          <div className="card bg-white shadow-lg">
            <div className="card-body p-0">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold text-primary">Recent Attendance</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr className="bg-gray-50 text-primary">
                      <th className="font-semibold">Employee</th>
                      <th className="font-semibold">Check-In</th>
                      <th className="font-semibold">Check-Out</th>
                      <th className="font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-gray-500">
                          No attendance records found
                        </td>
                      </tr>
                    ) : (
                      attendance.map((att) => (
                        <tr key={att._id}>
                          <td>
                            <div className="font-medium">{att.user?.name || "Unknown"}</div>
                            <div className="text-xs text-gray-500">{att.user?.department || ""}</div>
                          </td>
                          <td>
                            {att.checkIn?.time ? (
                              <div>
                                <div>{new Date(att.checkIn.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                <div className="text-xs text-gray-500">
                                  {new Date(att.checkIn.time).toLocaleDateString()}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td>
                            {att.checkOut?.time ? (
                              <div>
                                <div>{new Date(att.checkOut.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                <div className="text-xs text-gray-500">
                                  {new Date(att.checkOut.time).toLocaleDateString()}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td>
                            {att.checkIn?.time && att.checkOut?.time ? (
                              <span className="badge badge-success">Completed</span>
                            ) : att.checkIn?.time ? (
                              <span className="badge badge-warning">Checked In</span>
                            ) : (
                              <span className="badge badge-error">Absent</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Attendance Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="join">
                      <button
                        className="join-item btn btn-sm"
                        onClick={() => fetchAttendance(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      <button className="join-item btn btn-sm">
                        {currentPage}
                      </button>
                      <button
                        className="join-item btn btn-sm"
                        onClick={() => fetchAttendance(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Employee Preview */}
          <div className="card bg-white shadow-lg">
            <div className="card-body p-0">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold text-primary">Recent Employees</h2>
                <span className="badge badge-primary">{employees.length}</span>
              </div>
              <div className="p-4">
                {employees.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No employees found
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {employees.map(emp => (
                      <li key={emp._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className="flex items-center">
                          <div className="avatar placeholder mr-3">
                            <div className="bg-primary text-white text-center rounded-full w-8 h-8">
                              <span>{emp.name.charAt(0)}</span>
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">{emp.name}</div>
                            <div className="text-sm text-gray-500">{emp.email}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          {emp.department && (
                            <span className="badge badge-ghost">{emp.department}</span>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            {emp.designation || "No designation"}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 text-center">
                  <a href="/employees" className="text-primary hover:underline">
                    View all employees →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-white shadow-lg">
            <div className="card-body">
              <h3 className="font-semibold text-gray-600 mb-2">Attendance Rate</h3>
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="text-3xl font-bold text-primary">
                    {summary.totalEmployees ? 
                      Math.round((summary.present / summary.totalEmployees) * 100) : 0
                    }%
                  </div>
                  <div className="text-sm text-gray-500">Present today</div>
                </div>
                <div className="radial-progress text-primary" 
                  style={{"--value": summary.totalEmployees ? 
                    (summary.present / summary.totalEmployees) * 100 : 0, 
                    "--size": "4rem", "--thickness": "4px"}}>
                  {summary.totalEmployees ? 
                    Math.round((summary.present / summary.totalEmployees) * 100) : 0
                  }%
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-white shadow-lg">
            <div className="card-body">
              <h3 className="font-semibold text-gray-600 mb-2">Late Arrivals</h3>
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="text-3xl font-bold text-yellow-600">{summary.lateCount || 0}</div>
                  <div className="text-sm text-gray-500">Employees late today</div>
                </div>
                <div className="text-yellow-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-white shadow-lg">
            <div className="card-body">
              <h3 className="font-semibold text-gray-600 mb-2">Absent Rate</h3>
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="text-3xl font-bold text-red-600">{summary.absent || 0}</div>
                  <div className="text-sm text-gray-500">Employees absent today</div>
                </div>
                <div className="text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <Attendance /> 
    )
  );
};

export default Dashboard;