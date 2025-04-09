import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getUserFromToken } from "../api/auth";
import "react-quill/dist/quill.snow.css";

const AgregarPropuesta = () => {
  const navigate = useNavigate();
  const user = useMemo(() => getUserFromToken(), []);

  // Estados del formulario
  const [tipoTrabajo, setTipoTrabajo] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [idInvestigacion, setIdInvestigacion] = useState("");

  // Estados para sustentantes y líneas de investigación
  const [sustentantes, setSustentantes] = useState([]);
  const [lineasInvestigacion, setLineasInvestigacion] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Obtener sustentantes desde la API
    const fetchSustentantes = async () => {
      try {
        const response = await axios.get("/estudiante/por-escuela", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSustentantes(response.data);
      } catch (error) {
        console.error("Error al obtener sustentantes:", error);
      }
    };

    // Obtener líneas de investigación desde la API
    const fetchLineasInvestigacion = async () => {
      try {
        const response = await axios.get("/lineainvestigacion/investigaciones", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLineasInvestigacion(response.data);
      } catch (error) {
        console.error("Error al obtener líneas de investigación:", error);
      }
    };

    fetchSustentantes();
    fetchLineasInvestigacion();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Obtener los sustentantes seleccionados
    const sustentantesSeleccionados = [...document.getElementById("sustentantes").selectedOptions].map(
      (option) => option.value
    );

    // Construir el objeto de la propuesta
    const propuestaData = {
      TipoTrabajo: tipoTrabajo,
      Titulo: titulo,
      Descripcion: descripcion,
      Estado: "Pendiente",
      IdInvestigacion: idInvestigacion,
      Sustentantes: sustentantesSeleccionados, // Lista de IDs de estudiantes
    };

    try {
      const response = await axios.post("/propuestas/agregar", propuestaData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Propuesta guardada:", response.data);
      navigate("/propuestas");
    } catch (error) {
      console.error("Error al guardar la propuesta:", error);
    }
  };

  return (
    <div id="page-top">
      <div id="wrapper">
        <Sidebar />

        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Header />

            <div className="container-fluid">
              <h1 className="h3 mb-2 text-gray-800">
                Agregar Propuesta de trabajo de grado
              </h1>
            </div>

            <div className="container-fluid mt-3">
              <form onSubmit={handleSubmit}>
                {/* Tipo de trabajo final */}
                <div className="form-group">
                  <label htmlFor="tipoTrabajo">Tipo de trabajo final</label>
                  <select
                    id="tipoTrabajo"
                    name="tipoTrabajo"
                    className="form-control"
                    required
                    value={tipoTrabajo}
                    onChange={(e) => setTipoTrabajo(e.target.value)}
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="Proyecto de Grado">Proyecto de grado</option>
                    <option value="Tesis de Grado">Tesis de grado</option>
                    <option value="Monográfico de Grado">Monográfico de grado</option>
                  </select>
                </div>

                {/* Título */}
                <div className="form-group">
                  <label htmlFor="titulo">Título del Trabajo de Grado</label>
                  <input
                    type="text"
                    className="form-control"
                    id="titulo"
                    name="titulo"
                    placeholder="Ingrese el título del trabajo"
                    required
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                  />
                </div>

                {/* Descripción usando ReactQuill */}
                <div className="form-group">
                  <label htmlFor="descripcion">Descripción del Trabajo</label>
                  <ReactQuill
                    theme="snow"
                    value={descripcion}
                    onChange={setDescripcion}
                    className="editor-container"
                  />
                </div>

                {/* Sustentantes (se filtra para no incluir al usuario actual) */}
                <div className="form-group">
                  <label htmlFor="sustentantes">Sustentantes</label>
                  <select
                    id="sustentantes"
                    name="sustentantes[]"
                    className="form-control"
                    multiple
                    required
                  >
                    {sustentantes.length > 0 ? (
                      sustentantes
                        .filter((s) => s.id !== parseInt(user?.userId, 10))
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.nombre}
                          </option>
                        ))
                    ) : (
                      <option disabled>No hay sustentantes disponibles</option>
                    )}
                  </select>
                </div>

                {/* Línea de Investigación */}
                <div className="form-group">
                  <label htmlFor="lineaInvestigacion">Línea de Investigación</label>
                  <select
                    id="lineaInvestigacion"
                    name="lineaInvestigacion"
                    className="form-control"
                    required
                    value={idInvestigacion}
                    onChange={(e) => setIdInvestigacion(e.target.value)}
                  >
                    <option value="">Seleccione una opción</option>
                    {lineasInvestigacion.length > 0 ? (
                      lineasInvestigacion.map((linea) => (
                        <option key={linea.id} value={linea.id}>
                          {linea.nombre}
                        </option>
                      ))
                    ) : (
                      <option disabled>No hay líneas de investigación disponibles</option>
                    )}
                  </select>
                </div>

                {/* Botones */}
                <button type="submit" className="btn btn-primary mt-2">
                  Guardar Propuesta
                </button>
                <button
                  type="button"
                  className="btn btn-danger mt-2 ml-2"
                  onClick={() => navigate("/propuestas")}
                >
                  Cancelar
                </button>
              </form>
            </div>
          </div>

          <Footer />
        </div>
      </div>

      <a className="scroll-to-top rounded" href="#page-top">
        <i className="fas fa-angle-up"></i>
      </a>
    </div>
  );
};

export default AgregarPropuesta;
