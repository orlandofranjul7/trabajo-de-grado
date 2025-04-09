import React from "react";
import { getUserFromToken } from "../api/auth";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Header = () => {
  const user = getUserFromToken();
  const userName = user ? user.name : "Invitado";

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      {/* Sidebar Toggle */}
      <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
        <i className="fa fa-bars"></i>
      </button>

      {/* Navbar Icons */}
      <ul className="navbar-nav ml-auto">
        {/* Notifications */}
        <li className="nav-item dropdown no-arrow mx-1">
          <a className="nav-link dropdown-toggle" href="#" id="alertsDropdown">
            <i className="fas fa-bell fa-fw"></i>
            <span className="badge badge-danger badge-counter">3+</span>
          </a>
        </li>

        {/* Messages */}
        <li className="nav-item dropdown no-arrow mx-1">
          <a className="nav-link dropdown-toggle" href="#" id="messagesDropdown">
            <i className="fas fa-envelope fa-fw"></i>
            <span className="badge badge-danger badge-counter">7</span>
          </a>
        </li>

        {/* User Profile */}
        <li className="nav-item dropdown no-arrow">
          <a className="nav-link dropdown-toggle" href="#" id="userDropdown">
            <span className="mr-2 d-none d-lg-inline text-gray-600 small">{userName}</span>
            <img className="img-profile rounded-circle" src="/assets/img/undraw_profile.svg" alt="Profile" />
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
