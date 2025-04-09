import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    try {
      const response = await fetch("http://localhost:5122/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo: email, contraseña: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error en el inicio de sesión");
      }

      // Guardar el token en localStorage
      localStorage.setItem("token", data.token);

      // Redirigir al usuario (ajusta la ruta según tu aplicación)
      window.location.href = "/home";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="main-bg d-flex justify-content-center align-items-center min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                <div className="row">
                  <div
                    className="bg-login-image col-lg-6 d-none d-lg-block"
                    style={{
                      backgroundImage: "url('/assets/img/Imagen_login.jpg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  ></div>

                  <div className="col-lg-6">
                    <div className="p-5">
                      <div className="text-center">
                        <img
                          src="/assets/img/unphu_verde.webp"
                          alt="UNPHU"
                          style={{ maxWidth: "70%", height: "auto" }}
                          className="mb-2"
                        />
                        <h1 className="h5 text-gray-900 mb-4">
                          Gestión de Trabajos de Grado
                        </h1>
                      </div>

                      {error && <div className="alert alert-danger">{error}</div>}

                      <form className="user" onSubmit={handleSubmit}>
                        <div className="form-group">
                          <input
                            type="email"
                            className="form-control form-control-user"
                            placeholder="Ingrese su correo electrónico..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="password"
                            className="form-control form-control-user"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>

                        <button type="submit" className="btn btn-primary btn-user btn-block">
                          Iniciar Sesión
                        </button>
                      </form>

                      <hr />
                      <div className="text-center">
                        <a className="small" href="forgot-password.html">
                          ¿Olvidó su contraseña?
                        </a>
                      </div>
                      <div className="text-center">
                        <a className="small" href="register.html">
                          Crear una cuenta
                        </a>
                      </div>
                    </div>
                  </div>
                  {/* End Form Section */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
