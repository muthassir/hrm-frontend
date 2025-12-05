import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Modal from "./Modal";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {user ? (
              <>
                {user.role === "admin" && (
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/employees">Employees</Link>
                    <Link to="/leave-management">Leave Management</Link>
                  </li>
                )}
                {user.role === "employee" && (
                  <li>
                    <Link to="/dashboard">Attendance</Link>
                    <Link to="/leave">Apply Leave</Link>
                  </li>
                )}
              </>
            ) : (
              // public menu
              <li>
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="navbar-center">
        <Link
          to={user ? "/dashboard" : "/"}
          className="btn btn-ghost text-xl text-primary"
        >
          EMS App
        </Link>
      </div>

      <div className="navbar-end flex items-center gap-2">
        {user ? (
          <Modal />
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-ghost">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
