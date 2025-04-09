import React from "react";
import { Link } from "react-router-dom"; // Para navegación interna
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

const Home = () => {
  return (
    <div id="page-top">
      {/* Sidebar */}
      <div id="wrapper">
        <Sidebar/>

        {/* Contenido */}
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            {/* Topbar */}
            <Header/>


            {/* Contenido Principal */}
            <div className="container-fluid mt-5 text-center">
              <h3 className="display-4 main-text-color">
                <i className="fas fa-university"></i> Gestión de Trabajos de Grado
              </h3>
              <p className="lead text-muted">Facilitando el proceso académico de Trabajos de Grado.</p>
              <img src="/assets/img/home-img.png" className="img-fluid img-home mb-4" alt="Gestión Académica" />

              {/* Iconos Relevantes */}
              <div className="row text-center mt-4 mb-3">
                <div className="col-md-4">
                  <i className="fas fa-edit fa-3x text-primary mb-3"></i>
                  <h5>Gestión de Propuestas</h5>
                  <p className="text-muted">Envía, revisa y actualiza propuestas de manera digital.</p>
                </div>
                <div className="col-md-4">
                  <i className="fas fa-user-tie fa-3x text-primary mb-3"></i>
                  <h5>Asignación de Asesores</h5>
                  <p className="text-muted">Facilita la asignación de roles clave en cada trabajo de grado.</p>
                </div>
                <div className="col-md-4">
                  <i className="fas fa-chart-line fa-3x text-primary mb-3"></i>
                  <h5>Seguimiento en Tiempo Real</h5>
                  <p className="text-muted">Consulta el estado y progreso de tus trabajos fácilmente.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
            <Footer/>
        </div>
      </div>
    </div>
  );
};

export default Home;
