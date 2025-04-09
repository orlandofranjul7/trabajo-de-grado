namespace GestionTrabajosDeGradoAPI.Interfaces
{
    public interface IEmailService
    {
        Task EnviarCorreoAsync(string destino, string asunto, string contenidoHtml);
    }

}
