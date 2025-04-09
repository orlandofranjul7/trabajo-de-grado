import React, { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { getUserFromToken } from "../api/auth";
import Header from "../components/Header";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

// Importar jQuery y DataTables
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.min.css"; 
import "datatables.net";

const Propuestas = () => {
  const [propuestas, setPropuestas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [propuestaSeleccionada, setPropuestaSeleccionada] = useState(null);
  const user = getUserFromToken();

  const tableRef = useRef(null);

  useEffect(() => {
    const fetchPropuestas = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5122/api/Propuestas/mis-propuestas", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const propuestasFiltradas = response.data.filter(p => p.estado !== "Eliminado");
        setPropuestas(propuestasFiltradas);
      } catch (error) {
        console.error("Error al obtener propuestas:", error);
      }
    };

    fetchPropuestas();
  }, []);

  // Inicializar DataTable después de renderizar las propuestas
  useEffect(() => {
    if (propuestas.length > 0) {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy(); // Destruir instancia previa
      }
      $(tableRef.current).DataTable(); // Inicializar DataTable
    }
  }, [propuestas]);

  const handleShowModal = (propuesta) => {
    setPropuestaSeleccionada(propuesta);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPropuestaSeleccionada(null);
  };

  const handleEliminar = async () => {
    if (!propuestaSeleccionada) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/propuestas/${propuestaSeleccionada.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPropuestas(prev => prev.filter(p => p.id !== propuestaSeleccionada.id));
      alert("Propuesta eliminada correctamente.");
      handleCloseModal();
    } catch (error) {
      console.error("Error al eliminar la propuesta:", error);
      alert("Error al eliminar la propuesta.");
    }
  };

  return (
    <div id="wrapper">
      <Sidebar />

      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <Header />

          <div className="container-fluid">
            <h1 className="h2 mb-2 text-gray-800">Propuestas de trabajos de grado</h1>

            <div className="d-flex justify-content-end mb-4">
              <Link to="/AgregarPropuesta" className="btn btn-primary btn-icon-split">
                <span className="icon text-white-50"><i className="fas fa-plus"></i></span>
                <span className="text">Agregar propuesta</span>
              </Link>
              <button className="btn btn-primary btn-icon-split ml-2">
                <span className="icon text-white-50"><i className="fas fa-book"></i></span>
                <span className="text">Generar reporte</span>
              </button>
            </div>

            <div className="card shadow mb-4">
              <div className="card-body">
                <div className="table-responsive">
                  <table ref={tableRef} className="table table-bordered" width="100%">
                    <thead>
                      <tr>
                        <th>Sustentantes</th>
                        <th>Título</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {propuestas.map((p) => (
                        <tr key={p.id}>
                          <td>{p.sustentantes?.length ? p.sustentantes.join(" | ") : "Sin sustentantes"}</td>
                          <td>{p.titulo}</td>
                          <td>
                            {p.fecha
                              ? new Date(p.fecha).toLocaleDateString("es-ES", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                })
                              : "Fecha no disponible"}
                          </td>
                          <td>{p.estado}</td>
                          <td className="d-flex justify-content-center">
                            <Link to={`/ModificarPropuesta/${p.id}`} className="text-primary mr-3">
                              <i className="fas fa-pencil-alt"></i>
                            </Link>
                            <button className="text-danger mr-3 border-0 bg-transparent" onClick={() => handleShowModal(p)}>
                              <i className="fas fa-trash-alt"></i>
                            </button>
                            <Link to={`/DetallesPropuesta/${p.id}`} className="text-secondary">
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

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar esta propuesta?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
          <Button variant="danger" onClick={handleEliminar}>Eliminar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Propuestas;
