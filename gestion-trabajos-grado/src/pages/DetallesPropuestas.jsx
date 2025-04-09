import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getUserFromToken } from "../api/auth";
import { Modal, Button, Form } from "react-bootstrap";

const DetallesPropuestas = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUserFromToken();

  const [propuesta, setPropuesta] = useState(null);
  const [estadoAActualizar, setEstadoAActualizar] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [comentario, setComentario] = useState("");

  useEffect(() => {
    const fetchPropuesta = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/propuestas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPropuesta(response.data);
      } catch (error) {
        console.error("Error al obtener la propuesta:", error);
      }
    };

    fetchPropuesta();
  }, [id]);

  const handleAbrirModal = (estado) => {
    setEstadoAActualizar(estado);
    setComentario("");
    setShowModal(true);
  };

  const handleCerrarModal = () => {
    setShowModal(false);
    setEstadoAActualizar("");
  };

  const handleConfirmar = async () => {
    if (!comentario.trim()) {
      alert("Debes ingresar un comentario antes de continuar.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
  
      const payload = {
        Id: propuesta.id,
        Titulo: propuesta.titulo ?? "",                      // asegúrate de enviar string
        Descripcion: propuesta.descripcion ?? "",
        TipoTrabajo: propuesta.tipoTrabajo ?? "",            // cuidado con la propiedad: puede ser tipo_trabajo o tipoTrabajo
        Estado: estadoAActualizar,
        Comentario: comentario,
        IdInvestigacion: propuesta.id_investigacion ?? 0,
        Sustentantes: propuesta.id_estudiantes?.map(e => e.id) ?? []
      };
  
      console.log("Payload enviado al backend:", payload); // 👀 revisa bien esto
  
      await axios.put("/propuestas/modificar", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setShowModal(false);
      navigate("/propuestas");
    } catch (error) {
      console.error("Error al actualizar el estado:", error.response?.data || error);
    }
  };
  
  

  return (
    <div id="wrapper">
      <Sidebar />

      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <Header />

          <div className="container-fluid mt-5">
            <h2 className="mb-4 text-secondary">
              <i className="fas fa-file-alt mr-2"></i>
              Detalles de la Propuesta de Trabajo de Grado
            </h2>

            <div className="card card-custom">
              <div className="card-header card-header-custom">
                <i className="fas fa-info-circle mr-2"></i>Información del Trabajo de Grado
              </div>
              <div className="card-body">
                <div className="form-group d-flex align-items-center mb-3">
                  <label className="mr-3 mb-0">
                    <i className="fas fa-clipboard-list mr-1"></i>Tipo de Trabajo Final:
                  </label>
                  <span>{propuesta?.tipoTrabajo}</span>
                </div>

                <div className="form-group d-flex align-items-center mb-3">
                  <label className="mr-3 mb-0">
                    <i className="fas fa-heading mr-1"></i>Título del Trabajo de Grado:
                  </label>
                  <span>{propuesta?.titulo}</span>
                </div>

                <div className="form-group mb-3">
                  <label className="mb-2">
                    <i className="fas fa-align-left mr-1"></i>Descripción del Trabajo
                  </label>
                  <div
                    style={{
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      borderRadius: "0.25rem",
                      padding: "1rem",
                      width: "100%",
                      display: "inline-block"
                    }}
                    dangerouslySetInnerHTML={{ __html: propuesta?.descripcion }}
                  />
                </div>


                <div className="form-group d-flex align-items-center mb-3">
                  <label className="mr-3 mb-0">
                    <i className="fas fa-user-graduate mr-1"></i>Sustentantes:
                  </label>
                  <span>
                    {propuesta?.sustentantes?.length
                      ? propuesta.sustentantes.join(", ")
                      : "No hay sustentantes"}
                  </span>
                </div>

                <div className="form-group d-flex align-items-center mb-3">
                  <label className="mr-3 mb-0">
                    <i className="fas fa-flask mr-1"></i>Línea de Investigación:
                  </label>
                  <span>{propuesta?.lineaInvestigacion}</span>
                </div>

                <div className="form-group d-flex align-items-center mb-3">
                  <label className="mr-3 mb-0">
                    <i className="fas fa-user-tie mr-1"></i>Director:
                  </label>
                  <span>{propuesta?.director}</span>
                </div>

                {/* Botones solo para el director */}
                {user?.role?.toLowerCase() === "director" && (
                  <div className="mt-4 d-flex flex-column flex-md-row ">
                    <button
                      className="btn btn-success"
                      onClick={() => handleAbrirModal("Aceptada")}
                    >
                      <i className="fas fa-check-circle mr-1"></i> Aceptar Propuesta
                    </button>
                    <button
                      className="btn btn-danger ml-3"
                      onClick={() => handleAbrirModal("Rechazada")}
                    >
                      <i className="fas fa-times-circle mr-1"></i> Rechazar Propuesta
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>

      {/* Modal para comentario */}
      <Modal show={showModal} onHide={handleCerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>{estadoAActualizar} Propuesta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="comentario">
            <Form.Label>Comentario (obligatorio)</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCerrarModal}>
            Cancelar
          </Button>
          <Button
            variant={estadoAActualizar === "Aceptada" ? "success" : "danger"}
            onClick={handleConfirmar}
            disabled={!comentario.trim()}
          >
            Confirmar {estadoAActualizar}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DetallesPropuestas;
