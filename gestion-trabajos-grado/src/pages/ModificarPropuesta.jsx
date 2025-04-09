// ... imports
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getUserFromToken } from "../api/auth";
import Select from "react-select";

const ModificarPropuesta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUserFromToken();

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    tipoTrabajo: "Proyecto de grado",
    IdInvestigacion: "",
    sustentantes: [],
  });

  const [lineasInvestigacion, setLineasInvestigacion] = useState([]);
  const [sustentantes, setSustentantes] = useState([]);
  const [selectedSustentantes, setSelectedSustentantes] = useState([]);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
  
        // 1. Obtener propuesta primero
        const propuestaRes = await axios.get(`/propuestas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const propuesta = propuestaRes.data;
  
        // 2. Obtener líneas de investigación
        const lineasRes = await axios.get("/lineainvestigacion/investigaciones", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLineasInvestigacion(lineasRes.data);
  
        // 3. Obtener todos los estudiantes de la escuela
        const sustentantesRes = await axios.get("/estudiante/por-escuela", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        // Filtrar para excluir al usuario actual y mapear a react-select
        const opcionesSustentantes = sustentantesRes.data
          .filter((s) => s.id_usuario !== user.userId)
          .map((s) => ({
            value: s.id,
            label: s.nombre,
          }));
        setSustentantes(opcionesSustentantes);
  
        // 4. Poblar los sustentantes seleccionados (excluyendo el usuario actual)
        const selectedSust = propuesta.id_estudiantes
          ?.filter((s) => s.id_usuario !== user.userId)
          .map((s) => ({ value: s.id, label: s.nombre })) || [];
  
        setSelectedSustentantes(selectedSust);
  
        // 5. Setear los valores del formulario
        setFormData({
          titulo: propuesta.titulo || "",
          descripcion: propuesta.descripcion || "",
          tipoTrabajo: propuesta.tipo_trabajo || "Proyecto de grado",
          IdInvestigacion: propuesta.id_investigacion?.toString() || "",
          sustentantes: [user.userId, ...selectedSust.map((s) => s.value)],
        });
      } catch (error) {
        console.error("Error al cargar datos para modificar propuesta:", error);
      }
    };
  
    fetchData();
  }, [id]);
  

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrores((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSustentantesChange = (selectedOptions) => {
    setSelectedSustentantes(selectedOptions);
    const valores = [user.userId, ...selectedOptions.map((opt) => opt.value)];
    setFormData((prev) => ({
      ...prev,
      sustentantes: valores,
    }));
    setErrores((prev) => ({ ...prev, sustentantes: "" }));
  };

  const validarCampos = () => {
    const erroresTemp = {};
    if (!formData.titulo.trim()) erroresTemp.titulo = "El título es obligatorio.";
    if (!formData.descripcion || formData.descripcion === "<p><br></p>")
      erroresTemp.descripcion = "La descripción es obligatoria.";
    if (!formData.IdInvestigacion)
      erroresTemp.IdInvestigacion = "Debe seleccionar una línea de investigación.";
    if (!formData.tipoTrabajo) erroresTemp.tipoTrabajo = "Debe seleccionar el tipo de trabajo.";
    if (!formData.sustentantes || formData.sustentantes.length === 0)
      erroresTemp.sustentantes = "Debe seleccionar al menos un sustentante.";

    setErrores(erroresTemp);
    return Object.keys(erroresTemp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarCampos()) return;

    try {
      const token = localStorage.getItem("token");

      const payload = {
        Id: parseInt(id),
        Titulo: formData.titulo,
        Descripcion: formData.descripcion,
        TipoTrabajo: formData.tipoTrabajo,
        Estado: formData.estado || null,
        IdInvestigacion: parseInt(formData.IdInvestigacion),
        Sustentantes: formData.sustentantes,
        Comentario: formData.comentario || null,
      };

      await axios.put("/Propuestas/modificar", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/propuestas");
    } catch (error) {
      console.error("Error al modificar la propuesta:", error.response?.data || error);
    }
  };

  return (
    <div id="wrapper">
      <Sidebar />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <Header />
          <div className="container-fluid">
            <h1 className="h3 mb-2 text-gray-800">Modificar Propuesta de Trabajo de Grado</h1>
            <div className="container-fluid mt-3">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="titulo">Título del Trabajo</label>
                  <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    className={`form-control ${errores.titulo ? "is-invalid" : ""}`}
                    value={formData.titulo}
                    onChange={handleChange}
                  />
                  {errores.titulo && <div className="invalid-feedback">{errores.titulo}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="descripcion">Descripción</label>
                  <ReactQuill
                    theme="snow"
                    value={formData.descripcion}
                    onChange={(value) => {
                      setFormData((prev) => ({ ...prev, descripcion: value }));
                      setErrores((prev) => ({ ...prev, descripcion: "" }));
                    }}
                    className={errores.descripcion ? "is-invalid" : ""}
                  />
                  {errores.descripcion && (
                    <div className="text-danger mt-1">{errores.descripcion}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Sustentantes</label>
                  <Select
                    isMulti
                    options={sustentantes}
                    value={selectedSustentantes}
                    onChange={handleSustentantesChange}
                    className={errores.sustentantes ? "is-invalid" : ""}
                  />
                  {errores.sustentantes && (
                    <div className="text-danger mt-1">{errores.sustentantes}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="IdInvestigacion">Línea de Investigación</label>
                  <select
                    id="IdInvestigacion"
                    name="IdInvestigacion"
                    className={`form-control ${errores.IdInvestigacion ? "is-invalid" : ""}`}
                    value={formData.IdInvestigacion}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione una opción</option>
                    {lineasInvestigacion.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.nombre}
                      </option>
                    ))}
                  </select>
                  {errores.IdInvestigacion && (
                    <div className="invalid-feedback">{errores.IdInvestigacion}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="tipoTrabajo">Tipo de Trabajo Final</label>
                  <select
                    id="tipoTrabajo"
                    name="tipoTrabajo"
                    className={`form-control ${errores.tipoTrabajo ? "is-invalid" : ""}`}
                    value={formData.tipoTrabajo}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="Proyecto de grado">Proyecto de grado</option>
                    <option value="Tesis de grado">Tesis de grado</option>
                    <option value="Monográfico de grado">Monográfico de grado</option>
                  </select>
                  {errores.tipoTrabajo && (
                    <div className="invalid-feedback">{errores.tipoTrabajo}</div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary mt-3">
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  className="btn btn-danger mt-3 ml-2"
                  onClick={() => navigate("/propuestas")}
                >
                  Cancelar
                </button>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ModificarPropuesta;
