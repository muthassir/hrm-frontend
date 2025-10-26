import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Attendance = () => {
  const { axiosAuth, API } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMyAttendance = async () => {
    try {
      const res = await axiosAuth.get(`${API}/api/attendance/me`);
      setAttendance(res.data.data.items);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch attendance");
    }
  };

  useEffect(() => {
    fetchMyAttendance();
  }, []);

  const handleCheck = async (type) => {
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          setLoading(true);
          const res = await axiosAuth.post(`${API}/api/attendance/${type}`, {
            lat: latitude,
            lng: longitude,
          });
          fetchMyAttendance();
          alert(`${type} successful! Distance: ${res.data.data.distance.toFixed(2)}m, Within Radius: ${res.data.data.withinRadius}`);
        } catch (err) {
          setError(err.response?.data?.message || "Attendance failed");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Permission denied or unable to get location");
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5 p-6 text-neutral flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-primary">My Attendance</h1>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => handleCheck("checkin")}
          className="btn bg-primary text-white border-none hover:bg-primary/90 transition rounded-lg px-6 py-2 disabled:opacity-70"
          disabled={loading}
        >
          Check In
        </button>
        <button
          onClick={() => handleCheck("checkout")}
          className="btn bg-red-600 text-white border-none hover:bg-red-700 transition rounded-lg px-6 py-2 disabled:opacity-70"
          disabled={loading}
        >
          Check Out
        </button>
      </div>

      <div className="bg-white shadow-md border border-primary/20 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2 text-primary">Attendance Records</h2>
        {attendance.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table w-full border-collapse">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="border px-2 py-1">Date</th>
                  <th className="border px-2 py-1">Check In</th>
                  <th className="border px-2 py-1">Check Out</th>
                  <th className="border px-2 py-1">Within Radius</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((att) => (
                  <tr key={att._id} className="hover:bg-primary/10 transition">
                    <td className="border px-2 py-1">{att.date}</td>
                    <td className="border px-2 py-1">
                      {att.checkIn?.time ? new Date(att.checkIn.time).toLocaleTimeString() : "-"}
                    </td>
                    <td className="border px-2 py-1">
                      {att.checkOut?.time ? new Date(att.checkOut.time).toLocaleTimeString() : "-"}
                    </td>
                    <td className="border px-2 py-1">
                      {att.checkIn?.withinRadius && att.checkOut?.withinRadius ? "Yes" : "No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 mt-3">No attendance records found.</p>
        )}
      </div>
    </div>
  );
};

export default Attendance;
