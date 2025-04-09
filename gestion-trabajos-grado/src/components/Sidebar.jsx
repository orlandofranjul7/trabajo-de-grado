import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <ul className={`navbar-nav main-bg sidebar sidebar-dark accordion ${isCollapsed ? "toggled" : ""}`} id="accordionSidebar">
      <Link className="sidebar-brand d-flex align-items-center justify-content-center mb-4 mt-4" to="/home">
        <div className="sidebar-brand-icon rotate-n-15">
          <i className="fas fa-solid fa-book"></i>
        </div>
        <div className="sidebar-brand-text mx-3">Gestión de Trabajos de Grado</div>
      </Link>

      <hr className="sidebar-divider my-0" />

      <li className={`nav-item ${location.pathname === "/home" ? "active" : ""}`}>
        <Link className="nav-link" to="/home">
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Home</span>
        </Link>
      </li>

      <li className={`nav-item ${location.pathname === "/propuestas" ? "active" : ""}`}>
        <Link className="nav-link" to="/propuestas">
          <i className="fas fa-fw fa-chart-area"></i>
          <span>Propuestas</span>
        </Link>
      </li>

      <li className={`nav-item ${location.pathname === "/TrabajosDeGrado" ? "active" : ""}`}>
        <Link className="nav-link" to="/TrabajosDeGrado">
          <i className="fas fa-fw fa-wrench"></i>
          <span>Trabajos de Grado</span>
        </Link>
      </li>

      <li className={`nav-item ${location.pathname === "/calendario" ? "active" : ""}`}>
        <Link className="nav-link" to="/calendario">
          <i className="fas fa-fw fa-table"></i>
          <span>Calendario</span>
        </Link>
      </li>

      <hr className="sidebar-divider d-none d-md-block" />

      <div className="text-center d-none d-md-inline">
        <button className="rounded-circle border-0" id="sidebarToggle" onClick={handleToggle}></button>
      </div>
    </ul>
  );
};

export default Sidebar;
