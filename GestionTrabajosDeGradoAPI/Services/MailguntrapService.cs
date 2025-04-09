using GestionTrabajosDeGradoAPI.Helpers;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;

public interface IEmailService
{
    Task EnviarCorreoAsync(string destinatario, string asunto, string contenidoHtml);
}

public class MailtrapEmailService : IEmailService
{
    private readonly MailtrapSettings _settings;

    public MailtrapEmailService(IOptions<MailtrapSettings> options)
    {
        _settings = options.Value;
    }

    public async Task EnviarCorreoAsync(string destinatario, string asunto, string contenidoHtml)
    {
        Console.WriteLine($"📤 Enviando correo a: {destinatario} con asunto: {asunto}");

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Sistema de Gestión", _settings.From));
        message.To.Add(MailboxAddress.Parse(destinatario));
        message.Subject = asunto;

        var builder = new BodyBuilder { HtmlBody = contenidoHtml };
        message.Body = builder.ToMessageBody();

        using var client = new SmtpClient();
        await client.ConnectAsync(_settings.Host, _settings.Port, MailKit.Security.SecureSocketOptions.StartTls);
        await client.AuthenticateAsync(_settings.Username, _settings.Password);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}
