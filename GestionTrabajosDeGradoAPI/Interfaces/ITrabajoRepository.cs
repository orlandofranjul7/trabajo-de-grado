using GestionTrabajosDeGradoAPI.Models;
using System.Security.Claims;

namespace GestionTrabajosDeGradoAPI.Interfaces
{
    public interface ITrabajoRepository
    {
        Task<List<trabajos_de_grado>> GetTrabajosPorUsuario(int idUsuario, ClaimsPrincipal user);
        Task<trabajos_de_grado?> ObtenerTrabajoPorIdAsync(int id);

    }
}
