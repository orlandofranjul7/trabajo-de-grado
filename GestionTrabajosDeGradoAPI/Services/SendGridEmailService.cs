using SendGrid;
using SendGrid.Helpers.Mail;
using Microsoft.Extensions.Options;
using GestionTrabajosDeGradoAPI.Helpers;
using GestionTrabajosDeGradoAPI.Interfaces;

namespace GestionTrabajosDeGradoAPI.Services
{
    public class SendGridEmailService : IEmailService
    {
        private readonly SendGridSettings _settings;

        public SendGridEmailService(IOptions<SendGridSettings> settings)
        {
            _settings = settings.Value;
        }

        public async Task EnviarCorreoAsync(string destino, string asunto, string contenidoHtml)
        {
            var client = new SendGridClient(_settings.ApiKey);
            var from = new EmailAddress(_settings.FromEmail, _settings.FromName);
            var to = new EmailAddress(destino);
            var msg = MailHelper.CreateSingleEmail(from, to, asunto, "", contenidoHtml);

            var response = await client.SendEmailAsync(msg);

            if ((int)response.StatusCode >= 400)
            {
                var responseBody = await response.Body.ReadAsStringAsync();
                throw new Exception($"Error al enviar correo con SendGrid: {responseBody}");
            }
        }
    }

}
