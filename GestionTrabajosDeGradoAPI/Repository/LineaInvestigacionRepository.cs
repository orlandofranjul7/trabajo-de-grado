using GestionTrabajosDeGradoAPI.Data;
using GestionTrabajosDeGradoAPI.Interfaces;
using GestionTrabajosDeGradoAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace GestionTrabajosDeGradoAPI.Repository
{

    public class LineaInvestigacionRepository : ILineaInvestigacionRepository
    {

        private readonly AppDbContext _context;

        public LineaInvestigacionRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<linea_investigacion>> getInvestigacionPerEscuela(int IdUsuario)
        {
            var usuario = await _context.usuarios
                .Include(u => u.estudiantes)
                .Include(u => u.directors)
                .FirstOrDefaultAsync(u => u.id == IdUsuario);

            if (usuario == null)
                throw new Exception("Usuario no encontrado");

            int? idEscuela = usuario.id_escuela;

            if (idEscuela == null)
                throw new Exception("No se pudo determinar la escuela del usuario");

            return await _context.linea_investigacions
                .Where(l => l.id_escuela == idEscuela)
                .ToListAsync();
        }

    }
}
