using GestionTrabajosDeGradoAPI.Data;
using GestionTrabajosDeGradoAPI.Helpers;
using GestionTrabajosDeGradoAPI.Interfaces;
using GestionTrabajosDeGradoAPI.Models;
using GestionTrabajosDeGradoAPI.ViewModels;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GestionTrabajosDeGradoAPI.Repository
{
    public class PropuestaRepository : IPropuestasService
    {
        private readonly AppDbContext _context;
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IEmailService _emailService;

        public PropuestaRepository(AppDbContext context, IUsuarioRepository usuarioRepository, IEmailService emailService)
        {
            _context = context;
            _usuarioRepository = usuarioRepository;
            _emailService = emailService;
        }

        public async Task<PropuestaResponse> AddAsync(PropuestaRequest request, ClaimsPrincipal user)
        {
            // Obtener el ID del usuario desde el token
            int idUsuario = TokenHelper.GetUserIdToken(user);

            // Obtener al estudiante relacionado con este usuario
            var estudiante = await _context.estudiantes
                .Include(e => e.id_usuarioNavigation)
                .FirstOrDefaultAsync(e => e.id_usuario == idUsuario);

            if (estudiante == null)
                throw new Exception("No se encontró el estudiante asociado al usuario.");

            // Verificar si el estudiante tiene una escuela asociada
            if (estudiante.id_usuarioNavigation.id_escuela == null)
                throw new Exception("El estudiante no tiene una escuela asociada.");

            // Obtener el director asociado a la escuela del estudiante
            var director = await _context.directors
                .FirstOrDefaultAsync(d => d.id_escuela == estudiante.id_usuarioNavigation.id_escuela);

            if (director == null)
                throw new Exception("No se encontró un director para la escuela del estudiante.");

            // Crear la nueva propuesta
            var nuevaPropuesta = new propuesta
            {
                tipo_trabajo = request.TipoTrabajo,
                titulo = request.Titulo,
                descripcion = request.Descripcion,
                estado = "Pendiente", // Estado inicial
                fecha = DateTime.UtcNow,
                id_director = director.id,
                id_investigacion = request.IdInvestigacion
            };

            // Guardar la nueva propuesta en la base de datos
            _context.propuestas.Add(nuevaPropuesta);
            await _context.SaveChangesAsync();

            // Agregar la relación entre estudiante y propuesta
            estudiante.id_propuesta.Add(nuevaPropuesta); // Relación implícita
            await _context.SaveChangesAsync();

            // Retornar la respuesta
            return new PropuestaResponse
            {
                Titulo = nuevaPropuesta.titulo,
                Descripcion = nuevaPropuesta.descripcion,
                Estado = nuevaPropuesta.estado
            };
        }

        public async Task<bool> EliminarPropuestaAsync(int id, ClaimsPrincipal user)
        {
            // Obtener el ID del usuario desde el token JWT
            int idUsuario = TokenHelper.GetUserIdToken(user);

            var propuesta = await _context.propuestas.FindAsync(id);
            if (propuesta == null)
            {
                throw new KeyNotFoundException("No se encontró la propuesta especificada.");
            }

            // Cambiar el estado a "Eliminado"
            var estadoAnterior = propuesta.estado;
            propuesta.estado = "Eliminado";
            _context.propuestas.Update(propuesta);
            await _context.SaveChangesAsync();

            // Registrar el cambio en el historial
            var historial = new historial_de_cambio
            {
                titulo = "Eliminación de propuesta",
                descripcion = $"La propuesta con ID {propuesta.id} cambió de estado: {estadoAnterior} -> Eliminado.",
                fecha = DateTime.UtcNow,
                id_propuesta = propuesta.id,
                id_autor = idUsuario
            };
            _context.historial_de_cambios.Add(historial);
            await _context.SaveChangesAsync();

            return true;
        }


        public async Task<List<propuesta>> GetAllAsync()
        {
            return await _context.propuestas
                .Where(p => p.estado != "Rechazado" && p.estado != "Eliminado")
                .Include(p => p.id_directorNavigation)
                .ToListAsync();
        }


        
        public async Task<propuesta> GetByIdAsync(int id)
        {
            var propuesta =  await _context.propuestas
                .Where(p => p.estado != "Rechazado" && p.estado != "Eliminado")
                .Include(p => p.id_estudiantes)
                .Include(p => p.id_investigacionNavigation)
                .Include(p => p.id_directorNavigation)
                .FirstOrDefaultAsync(p => p.id == id);

            return propuesta;
        }



        public async Task<PropuestaResponseDetails> GetByIdDetailsAsync(int id)
        {
            var propuesta = await _context.propuestas
                .Where(p => p.id == id && p.estado != "Rechazado" && p.estado != "Eliminado")
                .Include(p => p.id_investigacionNavigation)
                .Include(p => p.id_directorNavigation)
                .ThenInclude(d => d.id_usuarioNavigation) // 🔹 Asegurar que se carga el nombre del director
                .Include(p => p.id_estudiantes)
                .ThenInclude(e => e.id_usuarioNavigation) // 🔹 Asegurar que se carga el nombre de los sustentantes
                .AsNoTracking() // 🔹 Evita problemas de tracking de Entity Framework
                .FirstOrDefaultAsync();

            if (propuesta == null)
                return null;

            return new PropuestaResponseDetails
            {
                Id = propuesta.id,
                TipoTrabajo = propuesta.tipo_trabajo,
                Titulo = propuesta.titulo,
                Descripcion = propuesta.descripcion,
                Estado = propuesta.estado,
                Fecha = propuesta.fecha,

                // ✅ Obtener el nombre del director
                Director = propuesta.id_directorNavigation?.id_usuarioNavigation?.nombre ?? "No especificado",

                // ✅ Obtener los nombres de los sustentantes (estudiantes)
                Sustentantes = propuesta.id_estudiantes
                    .Where(e => e.id_usuarioNavigation != null) // 🔹 Evitar valores null
                    .Select(e => e.id_usuarioNavigation.nombre)
                    .ToList(),

                // ✅ Obtener el nombre de la línea de investigación
                LineaInvestigacion = propuesta.id_investigacionNavigation?.nombre ?? "No especificada"
            };
        }




        public async Task<List<PropuestaResponse>> GetPropuestasPerUsers(int idUsuario, ClaimsPrincipal user)
        {
            var roles = user.Claims
                .Where(c => c.Type == ClaimTypes.Role)
                .Select(c => c.Value)
                .ToList();

            var propuestas = new List<propuesta>();

            if (roles.Contains("Estudiante"))
            {
                var estudiante = await _context.estudiantes
                    .FirstOrDefaultAsync(e => e.id_usuario == idUsuario);

                if (estudiante != null)
                {
                    propuestas = await _context.propuestas
                        .Include(p => p.id_investigacionNavigation)
                        .Include(p => p.id_directorNavigation)
                            .ThenInclude(d => d.id_usuarioNavigation)
                        .Include(p => p.id_estudiantes)
                            .ThenInclude(e => e.id_usuarioNavigation)
                        .Where(p => p.id_estudiantes.Any(ep => ep.id == estudiante.id) &&
                                    p.estado != "Rechazado" && p.estado != "Eliminado")
                        .ToListAsync();
                }
            }
            else if (roles.Contains("Director"))
            {
                var director = await _context.directors
                    .FirstOrDefaultAsync(d => d.id_usuario == idUsuario);

                if (director != null)
                {
                    propuestas = await _context.propuestas
                        .Include(p => p.id_investigacionNavigation)
                        .Include(p => p.id_directorNavigation)
                            .ThenInclude(d => d.id_usuarioNavigation)
                        .Include(p => p.id_estudiantes)
                            .ThenInclude(e => e.id_usuarioNavigation)
                        .Where(p => p.id_director == director.id &&
                                    p.estado != "Rechazado" && p.estado != "Eliminado")
                        .ToListAsync();
                }
            }

            // Convertir a PropuestaResponse para evitar referencias nulas en el frontend
            var respuesta = propuestas.Select(p => new PropuestaResponse
            {
                Id = p.id,
                Titulo = p.titulo,
                Descripcion = p.descripcion,
                Estado = p.estado,
                Fecha = p.fecha,
                TipoTrabajo = p.tipo_trabajo,
                Director = p.id_directorNavigation?.id_usuarioNavigation?.nombre ?? "No especificado",
                LineaInvestigacion = p.id_investigacionNavigation?.nombre ?? "No especificada",
                Sustentantes = p.id_estudiantes
                    .Where(e => e.id_usuarioNavigation != null)
                    .Select(e => e.id_usuarioNavigation.nombre)
                    .ToList()
            }).ToList();

            foreach (var p in respuesta)
            {
                Console.WriteLine($"Propuesta: {p.Titulo}, Sustentantes: {string.Join(", ", p.Sustentantes ?? new List<string>())}");
            }


            return respuesta;
        }


        public async Task<PropuestaResponse> ModificarPropuesta(PropuestaRequest request, ClaimsPrincipal user)
        {
            int idUsuario = TokenHelper.GetUserIdToken(user);

            var propuesta = await _context.propuestas
                .Include(p => p.id_estudiantes)
                    .ThenInclude(e => e.id_usuarioNavigation)
                .Include(p => p.id_directorNavigation)
                    .ThenInclude(d => d.id_usuarioNavigation)
                .FirstOrDefaultAsync(p => p.id == request.Id);


            if (propuesta == null)
                throw new KeyNotFoundException("No se encontró la propuesta.");

            bool esDirector = propuesta.id_directorNavigation.id_usuario == idUsuario;
            bool esEstudiante = propuesta.id_estudiantes.Any(e => e.id_usuario == idUsuario);

            if (!esDirector && !esEstudiante)
                throw new UnauthorizedAccessException("No tienes permisos para modificar esta propuesta.");

            if (esEstudiante && !string.IsNullOrEmpty(request.Estado))
                throw new UnauthorizedAccessException("Un estudiante no puede modificar el estado de una propuesta.");

            if (esDirector && !string.IsNullOrEmpty(request.Estado) && string.IsNullOrWhiteSpace(request.Comentario))
                throw new ArgumentException("El comentario es obligatorio para aceptar o rechazar una propuesta.");

            propuesta.titulo = request.Titulo ?? propuesta.titulo;
            propuesta.descripcion = request.Descripcion ?? propuesta.descripcion;
            propuesta.tipo_trabajo = request.TipoTrabajo ?? propuesta.tipo_trabajo;

            if (esDirector && !string.IsNullOrEmpty(request.Estado))
                propuesta.estado = request.Estado;

            if (request.Sustentantes != null && request.Sustentantes.Any())
            {
                propuesta.id_estudiantes.Clear();

                var estudiantes = await _context.estudiantes
                    .Where(e => request.Sustentantes.Contains(e.id))
                    .ToListAsync();

                foreach (var estudiante in estudiantes)
                {
                    propuesta.id_estudiantes.Add(estudiante);
                }
            }

            if (esDirector && !string.IsNullOrEmpty(request.Estado))
            {
                _context.historial_de_cambios.Add(new historial_de_cambio
                {
                    titulo = $"Propuesta {request.Estado}",
                    descripcion = request.Comentario,
                    fecha = DateTime.UtcNow,
                    id_propuesta = propuesta.id,
                    id_autor = idUsuario
                });
            }

            if (esDirector && request.Estado == "Aceptada")
            {
                var yaExisteTrabajo = await _context.trabajos_de_grados
                    .AnyAsync(t => t.id_propuesta == propuesta.id);

                if (!yaExisteTrabajo)
                {
                    Console.WriteLine("Creando nuevo trabajo de grado...");

                    var nuevoTrabajo = new trabajos_de_grado
                    {
                        titulo = propuesta.titulo ?? "Sin título",
                        descripcion = propuesta.descripcion ?? "Sin descripción",
                        estado = "En progreso",
                        id_propuesta = propuesta.id,
                        fecha_inicio = DateTime.UtcNow,
                        fecha_fin = DateTime.UtcNow.AddMonths(6),
                        objetivo_general = "Pendiente",
                        objetivos_especificos = "Pendientes",
                        justificacion = "Pendiente",
                        planteamiento = "Pendiente",
                        progreso = 0,
                        id_estudiantes = propuesta.id_estudiantes.ToList()
                    };

                    _context.trabajos_de_grados.Add(nuevoTrabajo);
                    await _context.SaveChangesAsync();

                    foreach (var estudiante in propuesta.id_estudiantes)
                    {
                        Console.WriteLine($"🔁 Relacionando estudiante {estudiante.id} con trabajo {nuevoTrabajo.id}");

                        var relacion = new Dictionary<string, object>
                        {
                            ["id_estudiante"] = estudiante.id,
                            ["id_trabajo"] = nuevoTrabajo.id
                        };

                        _context.Set<Dictionary<string, object>>("estudiante_trabajo").Add(relacion);
                    }

                    await _context.SaveChangesAsync();
                }
            }

            var usuarios = propuesta.id_estudiantes
                .Select(e => e.id_usuarioNavigation)
                .Where(u => u != null && !string.IsNullOrEmpty(u.correo))
                .ToList();

            foreach (var estudiante in propuesta.id_estudiantes)
            {
                var correo = estudiante.id_usuarioNavigation?.correo;
                if (!string.IsNullOrEmpty(correo))
                {
                    await _emailService.EnviarCorreoAsync(
                        correo,
                        $"Estado de tu propuesta: {request.Estado}",
                        $"<p>Tu propuesta titulada <strong>{propuesta.titulo}</strong> ha sido <strong>{request.Estado}</strong>.</p><p>Comentario: {request.Comentario}</p>"
                    );
                }
            }



            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                var inner = ex.InnerException?.Message ?? ex.Message;
                Console.WriteLine("❌ Error al guardar trabajo de grado o relaciones:");
                Console.WriteLine(inner);
                throw new Exception("Error al guardar los cambios: " + inner);
            }

            return new PropuestaResponse
            {
                Id = propuesta.id,
                Titulo = propuesta.titulo,
                Descripcion = propuesta.descripcion,
                Estado = propuesta.estado
            };
        }




    }
}
