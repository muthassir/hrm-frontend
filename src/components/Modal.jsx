import React from "react";
import { useAuth } from "../context/AuthContext";

const Modal = () => {
   const { user, logout } = useAuth();
  const openModal = () => {
    const modal = document.getElementById("my_modal_1");
    if (modal) modal.showModal();
  };

  return (
    <>
      <button className="btn btn-primary" onClick={openModal}>
        Profile
      </button>

      <dialog id="my_modal_1" className="modal text-primary">
        <div className="modal-box bg-white">
          <h3 className="font-bold text-lg">Hello!</h3>
          <div className="py-4 flex flex-col gap-2">
            {user && (
          <>
            <span className="text-gray-700">
              Hello, {user.name}
            </span>
             <span className="text-gray-700 ">
              Mail: {user.email}
            </span>
           <form method="dialog">
             <button
              onClick={logout}
              className="btn btn-sm btn-primary text-white hover:bg-red-700 mt-4"
            >
              Logout
            </button>
           </form>
          </>
        )}
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Modal;
