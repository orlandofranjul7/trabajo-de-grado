using GestionTrabajosDeGradoAPI.Helpers;
using GestionTrabajosDeGradoAPI.Interfaces;
using GestionTrabajosDeGradoAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GestionTrabajosDeGradoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrabajosDeGradoController : ControllerBase
    {
        private readonly ITrabajoRepository _trabajoRepository;

        public TrabajosDeGradoController(ITrabajoRepository trabajoRepository)
        {
            _trabajoRepository = trabajoRepository;
        }


        [HttpGet("mis-trabajos")]
        public async Task<IActionResult> ObtenerTrabajosPorUsuario()
        {
            try
            {
                int idUsuario = TokenHelper.GetUserIdToken(User);
                var trabajos = await _trabajoRepository.GetTrabajosPorUsuario(idUsuario, User);

                if (trabajos == null || !trabajos.Any())
                    return NotFound("No se encontraron trabajos de grado para este usuario.");

                return Ok(trabajos);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetalles(int id)
        {
            var trabajo = await _trabajoRepository.ObtenerTrabajoPorIdAsync(id);

            if (trabajo == null)
                return NotFound(new { mensaje = "Trabajo de grado no encontrado." });

            return Ok(new
            {
                trabajo.id,
                trabajo.titulo,
                trabajo.descripcion,
                trabajo.estado,
                trabajo.fecha_inicio,
                trabajo.fecha_fin,
                trabajo.objetivo_general,
                trabajo.objetivos_especificos,
                trabajo.justificacion,
                trabajo.planteamiento,
                trabajo.progreso,

                sustentantes = trabajo.id_estudiantes.Select(e => new
                {
                    id = e.id,
                    nombre = e.id_usuarioNavigation?.nombre,
                    correo = e.id_usuarioNavigation?.correo
                }),

                asesores = trabajo.asesor_trabajos.Select(a => new
                {
                    id = a.id_asesorNavigation?.id,
                    nombre = a.id_asesorNavigation?.id_usuarioNavigation?.nombre,
                    correo = a.id_asesorNavigation?.id_usuarioNavigation?.correo
                }),

                jurados = trabajo.id_jurados.Select(j => new
                {
                    id = j.id,
                    nombre = j.id_usuarioNavigation?.nombre,
                    correo = j.id_usuarioNavigation?.correo
                }),

                director = new
                {
                    id = trabajo.id_propuestaNavigation?.id_directorNavigation?.id,
                    nombre = trabajo.id_propuestaNavigation?.id_directorNavigation?.id_usuarioNavigation?.nombre,
                    correo = trabajo.id_propuestaNavigation?.id_directorNavigation?.id_usuarioNavigation?.correo
                }
            });

        }
    }
}
