using GestionTrabajosDeGradoAPI.Data;
using GestionTrabajosDeGradoAPI.Interfaces;
using GestionTrabajosDeGradoAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GestionTrabajosDeGradoAPI.Repository
{
    public class TrabajoRepository : ITrabajoRepository
    {
        private readonly AppDbContext _context;

        public TrabajoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<trabajos_de_grado>> GetTrabajosPorUsuario(int idUsuario, ClaimsPrincipal user)
        {
            var roles = user.Claims
                .Where(c => c.Type == ClaimTypes.Role)
                .Select(c => c.Value)
                .ToList();

            IQueryable<trabajos_de_grado> query = _context.trabajos_de_grados
                .Include(t => t.id_estudiantes)
                    .ThenInclude(e => e.id_usuarioNavigation)
                .Include(t => t.id_jurados)
                    .ThenInclude(j => j.id_usuarioNavigation)
                .Include(t => t.asesor_trabajos)
                    .ThenInclude(a => a.id_asesorNavigation)
                .Include(t => t.id_propuestaNavigation);

            if (roles.Contains("Estudiante"))
            {
                var estudiante = await _context.estudiantes.FirstOrDefaultAsync(e => e.id_usuario == idUsuario);
                if (estudiante != null)
                {
                    return await query
                        .Where(t => t.id_estudiantes.Any(e => e.id == estudiante.id))
                        .ToListAsync();
                }
            }

            if (roles.Contains("Director"))
            {
                var director = await _context.directors.FirstOrDefaultAsync(d => d.id_usuario == idUsuario);
                if (director != null)
                {
                    var propuestasDelDirector = await _context.propuestas
                        .Where(p => p.id_director == director.id)
                        .Select(p => p.id)
                        .ToListAsync();

                    return await query
                        .Where(t => t.id_propuesta != null && propuestasDelDirector.Contains(t.id_propuesta.Value))
                        .ToListAsync();
                }
            }

            if (roles.Contains("Asesor"))
            {
                var asesor = await _context.asesors.FirstOrDefaultAsync(a => a.id_usuario == idUsuario);
                if (asesor != null)
                {
                    return await query
                        .Where(t => t.asesor_trabajos.Any(at => at.id_asesor == asesor.id))
                        .ToListAsync();
                }
            }

            if (roles.Contains("Jurado"))
            {
                var jurado = await _context.jurados.FirstOrDefaultAsync(j => j.id_usuario == idUsuario);
                if (jurado != null)
                {
                    return await query
                        .Where(t => t.id_jurados.Any(j => j.id == jurado.id))
                        .ToListAsync();
                }
            }

            return new List<trabajos_de_grado>();
        }

        public async Task<trabajos_de_grado?> ObtenerTrabajoPorIdAsync(int id)
        {

            return await _context.trabajos_de_grados
                .Include(t => t.id_estudiantes)
                    .ThenInclude(e => e.id_usuarioNavigation)
                .Include(t => t.asesor_trabajos)
                    .ThenInclude(at => at.id_asesorNavigation)
                        .ThenInclude(a => a.id_usuarioNavigation)
                .Include(t => t.id_jurados)
                    .ThenInclude(j => j.id_usuarioNavigation)
                .Include(t => t.id_propuestaNavigation)
                    .ThenInclude(p => p.id_directorNavigation)
                        .ThenInclude(d => d.id_usuarioNavigation)
                .FirstOrDefaultAsync(t => t.id == id);

        }
    }
}
