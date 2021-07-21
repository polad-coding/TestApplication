using KPProject.Interfaces;
using KPProject.ViewModels;
using MailKit.Net.Smtp;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.Services
{
    public class EmailSenderService : IEmailSender
    {
        private readonly EmailConfiguration _emailConfig;
        public EmailSenderService(EmailConfiguration emailConfig)
        {
            _emailConfig = emailConfig;
        }

        public bool SendReciept(List<MessageViewModel> messages)
        {
            messages.ForEach(message =>
            {
                SendEmail(message);
            });

            return true;
        }

        public void SendEmail(MessageViewModel message)
        {
            var emailMessage = CreateEmailMessage(message);
            Send(emailMessage);
        }

        private MimeMessage CreateEmailMessage(MessageViewModel message)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(_emailConfig.From));
            emailMessage.To.AddRange(message.To);
            emailMessage.Subject = message.Subject;
            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Text) { Text = message.Content };
            return emailMessage;
        }
        private void Send(MimeMessage mailMessage)
        {
            using (var client = new SmtpClient())
            {
                try
                {
                    client.Connect(_emailConfig.SmtpServer, _emailConfig.Port, true);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");
                    client.Authenticate("poladtesting@gmail.com", "plamf12345");
                    client.Send(mailMessage);
                }
                catch
                {
                    //log an error message or throw an exception or both.
                    throw;
                }
                finally
                {
                    client.Disconnect(true);
                    client.Dispose();
                }
            }

        }
    }
}
