using GestionTrabajosDeGradoAPI.Data;
using GestionTrabajosDeGradoAPI.Helpers;
using GestionTrabajosDeGradoAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GestionTrabajosDeGradoAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class EstudianteController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IEstudianteRepository _estudianteRepository;

        public EstudianteController(IEstudianteRepository estudianteRepository, AppDbContext context)
        {
            _context = context;
            _estudianteRepository = estudianteRepository;
        }


        [HttpGet("por-escuela")]
        public async Task<IActionResult> ObtenerEstudiantesPorEscuela()
        {
            try
            {
                int idUsuario = TokenHelper.GetUserIdToken(User);
                var estudiantes = await _estudianteRepository.GetEstudiantesPorEscuelaAsync(idUsuario);

                var resultado = estudiantes.Select(e => new
                {
                    id = e.id,
                    nombre = e.id_usuarioNavigation?.nombre ?? "Nombre no disponible"
                });

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }


    }
}
