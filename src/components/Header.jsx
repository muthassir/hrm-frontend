import React from "react";
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
            {user && (
              <>
               {
                user.role === "admin" && (
                   <li>
                  <Link to="/dashboard">Dashboard</Link>
                  <Link to="/employees">Employees</Link>
                  <Link to="/office-location">Office Location</Link>
                </li>)
               }
                {user.role === "employee" && (
                  <li>
                    <Link to="/dashboard">Attendance</Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="navbar-center">
        <Link to="/dashboard" className="btn btn-ghost text-xl text-primary">
          HRM App
        </Link>
      </div>

      <div className="navbar-end flex items-center gap-2">
       <Modal />
      </div>
    </header>
  );
};

export default Header;
