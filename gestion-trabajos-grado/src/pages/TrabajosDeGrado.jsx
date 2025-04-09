import React, { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getUserFromToken } from "../api/auth";
import { Link } from "react-router-dom";

import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net";

const TrabajosDeGrado = () => {
  const [trabajos, setTrabajos] = useState([]);
  const tableRef = useRef(null);
  const user = getUserFromToken();

  useEffect(() => {
    const fetchTrabajos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/TrabajosDeGrado/mis-trabajos", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const trabajosFiltrados = response.data || [];
        setTrabajos(trabajosFiltrados);
      } catch (error) {
        console.error("Error al obtener trabajos de grado:", error);
      }
    };

    fetchTrabajos();
  }, []);

  useEffect(() => {
    if (trabajos.length > 0) {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }
      $(tableRef.current).DataTable();
      console.log(trabajos);
    }
  }, [trabajos]);

  return (
    <div id="wrapper">
      <Sidebar />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <Header />
          <div className="container-fluid">
            <h1 className="h2 mb-2 text-gray-800">Trabajos de Grado</h1>

            <div className="card shadow mb-4">
              <div className="card-body">
                <div className="table-responsive">
                  <table ref={tableRef} className="table table-bordered" width="100%">
                    <thead>
                      <tr>
                        <th>Sustentantes</th>
                        <th>Título</th>
                        <th>Estado</th>
                        <th>Fecha de Inicio</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trabajos.map((t) => (
                        <tr key={t.id}>
                          <td>
                            {t.id_estudiantes?.length > 0
                              ? t.id_estudiantes
                                  .map((e) => e.id_usuarioNavigation?.nombre || "Desconocido")
                                  .join(" | ")
                              : "Sin sustentantes"}
                          </td>
                          <td>{t.titulo}</td>
                          <td>{t.estado}</td>
                          <td>
                            {t.fecha_inicio
                              ? new Date(t.fecha_inicio).toLocaleDateString("es-ES", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                })
                              : "N/A"}
                          </td>
                          <td className="d-flex justify-content-center">
                            <Link to={`/ModificarTrabajoGrado/${t.id}`} className="text-primary mr-3">
                              <i className="fas fa-pencil-alt"></i>
                            </Link>
                            <button className="text-danger mr-3 border-0 bg-transparent" onClick={() => handleShowModal(p)}>
                              <i className="fas fa-trash-alt"></i>
                            </button>
                            <Link to={`/DetallesTrabajoGrado/${t.id}`} className="text-secondary">
                              <i className="fas fa-eye"></i>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default TrabajosDeGrado;
