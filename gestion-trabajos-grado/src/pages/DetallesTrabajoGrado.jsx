import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

const DetallesTrabajoGrado = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trabajo, setTrabajo] = useState(null);

  useEffect(() => {
    const fetchTrabajo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`TrabajosDeGrado/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrabajo(response.data);
      } catch (error) {
        console.error("Error al obtener detalles del trabajo de grado:", error);
      }
    };

    fetchTrabajo();
  }, [id]);

  if (!trabajo) return <div className="container mt-5">Cargando detalles...</div>;

  return (
    <div id="wrapper">
      <Sidebar />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <Header />
          <div className="container-fluid mt-4">
            <h2 className="mb-4">Detalles del Trabajo de Grado</h2>
            <div className="card shadow mb-4">
              <div className="card-body">
                <p><strong>Título:</strong> {trabajo.titulo}</p>
                <p><strong>Descripción:</strong></p>
                <div dangerouslySetInnerHTML={{ __html: trabajo.descripcion }} />
                <p><strong>Estado:</strong> {trabajo.estado}</p>
                <p><strong>Fecha de Inicio:</strong> {new Date(trabajo.fecha_inicio).toLocaleDateString()}</p>
                <p><strong>Fecha de Fin:</strong> {trabajo.fecha_fin ? new Date(trabajo.fecha_fin).toLocaleDateString() : "No definida"}</p>
                <p><strong>Objetivo General:</strong> {trabajo.objetivo_general}</p>
                <p><strong>Objetivos Específicos:</strong> {trabajo.objetivos_especificos}</p>
                <p><strong>Justificación:</strong> {trabajo.justificacion}</p>
                <p><strong>Planteamiento:</strong> {trabajo.planteamiento}</p>
                <p><strong>Progreso:</strong> {trabajo.progreso}%</p>

                <p><strong>Sustentantes:</strong> {trabajo.sustentantes && trabajo.sustentantes.length > 0 ? trabajo.sustentantes.join(", ") : "N/A"}</p>
                <p><strong>Director:</strong> {trabajo.director || "N/A"}</p>
                <p><strong>Asesores:</strong> {trabajo.asesores && trabajo.asesores.length > 0 ? trabajo.asesores.join(", ") : "N/A"}</p>
                <p><strong>Jurados:</strong> {trabajo.jurados && trabajo.jurados.length > 0 ? trabajo.jurados.join(", ") : "N/A"}</p>

                <button onClick={() => navigate("/TrabajosDeGrado")} className="btn btn-secondary mt-3">
                  Volver
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default DetallesTrabajoGrado;
