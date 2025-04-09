import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import "./styles/sb-admin-2.css";
import "./styles/sb-admin-2.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
//import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "popper.js";
import "../public/assets/vendor/fontawesome-free/css/all.min.css"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
