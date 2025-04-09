import { jwtDecode } from "jwt-decode";

export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded Token:", decoded);

    // Extracting correct fields from the token
    return {
      name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "Usuario",
      userId: decoded.UsuarioId || "",
      role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "Invitado",
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
