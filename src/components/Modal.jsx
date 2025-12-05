import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Modal = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    closeModal();
  };

  return (
    <>
      <button 
        className="btn btn-primary" 
        onClick={openModal}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Profile
      </button>

      {isOpen && (
        <dialog open className="modal modal-open">
          <div className="modal-box bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-primary">Profile Details</h3>
              <button 
                onClick={closeModal}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            {user && (
              <div className="space-y-4">
                {/* Profile Header */}
                <div className="flex items-center space-x-4">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-white text-center rounded-full w-8 h-8">
                      <span className="mt-2 text-center">{user.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">{user.name}</h4>
                    <p className="text-gray-600">{user.email}</p>
                    <span className={`badge mt-1 ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-gray-800">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Role</label>
                      <p className="text-gray-800 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                    <p className="text-gray-800">{user.email}</p>
                  </div>
                  {user.department && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Department</label>
                      <p className="text-gray-800">{user.department}</p>
                    </div>
                  )}
                  {user.designation && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Designation</label>
                      <p className="text-gray-800">{user.designation}</p>
                    </div>
                  )}
                </div>

                <div className="modal-action mt-6">
                  <button
                    onClick={handleLogout}
                    className="btn btn-error btn-outline"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                  <button
                    onClick={closeModal}
                    className="btn btn-ghost"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div 
            className="modal-backdrop" 
            onClick={closeModal}
          >
            <button>close</button>
          </div>
        </dialog>
      )}
    </>
  );
};

export default Modal;