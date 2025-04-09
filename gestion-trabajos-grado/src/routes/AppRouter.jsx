import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Propuestas from "../pages/Propuestas";
import AgregarPropuesta from "../pages/AgregarPropuesta";
import DetallesPropuesta from "../pages/DetallesPropuestas";
import ModificarPropuesta from "../pages/ModificarPropuesta";
import TrabajosDeGrado from "../pages/TrabajosDeGrado";
import DetallesTrabajoGrado from "../pages/DetallesTrabajoGrado";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/propuestas" element={<Propuestas />} />
        <Route path="/AgregarPropuesta" element={<AgregarPropuesta />} />
        <Route path="/DetallesPropuesta/:id" element={<DetallesPropuesta />} /> 
        <Route path="/ModificarPropuesta/:id" element={<ModificarPropuesta />} />
        <Route path="/TrabajosDeGrado" element={<TrabajosDeGrado />} />
        <Route path="/DetallesTrabajoGrado/:id" element={<DetallesTrabajoGrado/>} />
        {/* Ruta dinámica para ver detalles de la propuesta */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
