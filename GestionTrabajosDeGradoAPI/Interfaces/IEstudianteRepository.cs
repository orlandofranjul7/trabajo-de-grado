using GestionTrabajosDeGradoAPI.Models;
using GestionTrabajosDeGradoAPI.ViewModels;

namespace GestionTrabajosDeGradoAPI.Interfaces
{
    public interface IEstudianteRepository
    {
        Task<List<estudiante>> GetEstudiantesPorEscuelaAsync(int idEscuela);
    }
}
