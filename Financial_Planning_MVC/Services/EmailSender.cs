using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Threading.Tasks;

namespace Financial_Planning_MVC.Services
{
    public class EmailSender : IEmailSender
    {
        public EmailSender(IOptions<AuthMessageSenderOptions> optionsAccessor)
        {
            // Contains authentication to be able to use the e-mail provider.
            Options = optionsAccessor.Value;
        }

        public AuthMessageSenderOptions Options { get; } //set only via Secret Manager

        public Task SendEmailAsync(string email, string subject, string message)
        {
            return Execute(Options.SendGridKey, subject, message, email);
        }

        public Task Execute(string apiKey, string subject, string message, string email)
        {
            // Establic the e-mail client.
            var client = new SendGridClient(apiKey);
            // Create the message object.
            var msg = new SendGridMessage()
            {
                From             = new EmailAddress("timonfeldmann@gmail.com", "Financial Sample Application"),
                Subject          = subject,
                PlainTextContent = message,
                HtmlContent      = message
            };
            // Specify who the e-mail is going to.
            msg.AddTo(new EmailAddress(email));
            // Do not track clicks
            msg.SetClickTracking(false, false);

            return client.SendEmailAsync(msg);
        }
    }
}