using GestionTrabajosDeGradoAPI.Data;
using GestionTrabajosDeGradoAPI.Interfaces;
using GestionTrabajosDeGradoAPI.Models;
using GestionTrabajosDeGradoAPI.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace GestionTrabajosDeGradoAPI.Repository
{
    public class EstudianteRepository : IEstudianteRepository
    {

        private readonly AppDbContext _context;

        public EstudianteRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<estudiante>> GetEstudiantesPorEscuelaAsync(int idUsuario)
        {
            var usuario = await _context.usuarios
                .Include(u => u.estudiantes)
                .Include(u => u.directors)
                .FirstOrDefaultAsync(u => u.id == idUsuario);

            if (usuario == null)
                throw new Exception("Usuario no encontrado");

            int? idEscuela = null;

            if (usuario.estudiantes != null && usuario.estudiantes.Any())
            {
                idEscuela = usuario.id_escuela;
            }
            else if (usuario.directors != null && usuario.directors.Any())
            {
                idEscuela = usuario.id_escuela;
            }

            if (idEscuela == null)
                throw new Exception("No se pudo determinar la escuela del usuario");

            return await _context.estudiantes
                .Include(e => e.id_usuarioNavigation)
                .Where(e => e.id_usuarioNavigation.id_escuela == idEscuela)
                .ToListAsync();
        }


    }
}
