import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Attendance = () => {
  const { axiosAuth, API } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [todayStatus, setTodayStatus] = useState({ 
    checkedIn: false, 
    checkedOut: false 
  });
  const limit = 10;

  const fetchMyAttendance = async (page = 1) => {
    try {
      const res = await axiosAuth.get(
        `${API}/api/attendance/me?page=${page}&limit=${limit}`
      );
      setAttendance(res.data.data.items);
      setTotalPages(Math.ceil(res.data.data.total / limit));
      setCurrentPage(res.data.data.page);
      
      // Check today's status
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = res.data.data.items.find(
        att => att.date === today
      );
      
      if (todayRecord) {
        setTodayStatus({
          checkedIn: !!todayRecord.checkIn?.time,
          checkedOut: !!todayRecord.checkOut?.time
        });
      } else {
        setTodayStatus({ checkedIn: false, checkedOut: false });
      }
      
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch attendance");
    }
  };

  useEffect(() => {
    fetchMyAttendance();
  }, []);

  const handleCheck = async (type) => {
    setError("");
    
    // Prevent multiple clicks
    if ((type === 'checkin' && todayStatus.checkedIn) || 
        (type === 'checkout' && todayStatus.checkedOut)) {
      setError(`Already ${type === 'checkin' ? 'checked in' : 'checked out'} today`);
      return;
    }
    
    // Checkout requires checkin first
    if (type === 'checkout' && !todayStatus.checkedIn) {
      setError("You need to check in first before checking out");
      return;
    }
    
    try {
      setLoading(true);
      await axiosAuth.post(`${API}/api/attendance/${type}`);
      
      // Update today's status
      if (type === 'checkin') {
        setTodayStatus(prev => ({ ...prev, checkedIn: true }));
      } else {
        setTodayStatus(prev => ({ ...prev, checkedOut: true }));
      }
      
      fetchMyAttendance(currentPage);
      alert(`${type === 'checkin' ? 'Check-in' : 'Check-out'} successful!`);
    } catch (err) {
      setError(err.response?.data?.message || "Attendance failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 text-primary">
      <h1 className="text-3xl font-bold mb-6 text-primary">My Attendance</h1>

      {error && (
        <div className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Check-in/Check-out Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">Today's Attendance</h2>
        
        {/* Today's Status */}
        <div className="mb-4 p-3 bg-blue-50 rounded">
          <p className="text-sm text-blue-700">
            Status: {todayStatus.checkedOut ? "Completed" : 
                    todayStatus.checkedIn ? "Checked In" : "Not Checked In"}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => handleCheck("checkin")}
            className={`btn btn-lg ${todayStatus.checkedIn ? 'btn-disabled' : 'btn-primary'}`}
            disabled={loading || todayStatus.checkedIn}
          >
            {loading ? "Processing..." : 
             todayStatus.checkedIn ? "Already Checked In" : "Check In"}
          </button>
          
          <button
            onClick={() => handleCheck("checkout")}
            className={`btn btn-lg ${todayStatus.checkedOut ? 'btn-disabled' : 'btn-secondary'}`}
            disabled={loading || todayStatus.checkedOut || !todayStatus.checkedIn}
          >
            {loading ? "Processing..." : 
             todayStatus.checkedOut ? "Already Checked Out" : 
             !todayStatus.checkedIn ? "Check In First" : "Check Out"}
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Note: You can only check in once and check out once per day.
        </p>
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-primary">Attendance History</h2>
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {attendance.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No attendance records found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-primary text-primary-content">
                    <th>Date</th>
                    <th>Check In Time</th>
                    <th>Check Out Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((att) => (
                    <tr key={att._id}>
                      <td className="font-medium">{att.date}</td>
                      <td>
                        {att.checkIn?.time ? (
                          new Date(att.checkIn.time).toLocaleTimeString()
                        ) : (
                          <span className="text-gray-400">Not checked in</span>
                        )}
                      </td>
                      <td>
                        {att.checkOut?.time ? (
                          new Date(att.checkOut.time).toLocaleTimeString()
                        ) : (
                          <span className="text-gray-400">Not checked out</span>
                        )}
                      </td>
                      <td>
                        {att.checkIn?.time && att.checkOut?.time ? (
                          <span className="badge badge-success">Completed</span>
                        ) : att.checkIn?.time ? (
                          <span className="badge badge-warning">Checked in</span>
                        ) : (
                          <span className="badge badge-error">Absent</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="join">
                  <button
                    className="join-item btn"
                    onClick={() => {
                      const prevPage = Math.max(1, currentPage - 1);
                      setCurrentPage(prevPage);
                      fetchMyAttendance(prevPage);
                    }}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button className="join-item btn">
                    Page {currentPage} of {totalPages}
                  </button>
                  <button
                    className="join-item btn"
                    onClick={() => {
                      const nextPage = Math.min(totalPages, currentPage + 1);
                      setCurrentPage(nextPage);
                      fetchMyAttendance(nextPage);
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

export default Attendance;