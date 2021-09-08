using KPProject.Data;
using KPProject.Interfaces;
using KPProject.Models;
using KPProject.ViewModels;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KPProject.Services
{
    public class EmailSenderService : IEmailSender
    {
        private readonly ApplicationDbContext _applicationDbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;

        public EmailSenderService(IConfiguration configuration, ApplicationDbContext applicationDbContext, UserManager<ApplicationUser> userManager)
        {
            _applicationDbContext = applicationDbContext;
            _userManager = userManager;
            _configuration = configuration;
        }

        //These methods support was suspended
        //public async Task<bool> SendReceiptsAsync(SendOrdersReceiptViewModel sendOrdersReceiptViewModel, string userId)
        //{
        //    var messages = new List<MessageViewModel>();
        //    var user = await _applicationDbContext.Users.FindAsync(userId);
        //    var isPractitionerUser = await _userManager.IsInRoleAsync(user, "Practitioner");
        //    var toEmail = "";

        //    if (isPractitionerUser)
        //    {
        //        toEmail = user.ProfessionalEmail == null ? user.Email : user.ProfessionalEmail;
        //    }
        //    else
        //    {
        //        toEmail = user.Email;
        //    }

        //    var messageContent = this.GenerateMessageContent(user, sendOrdersReceiptViewModel, isPractitionerUser);

        //    messages.Add(new MessageViewModel(new List<string> { toEmail }, "Your orders receipt", messageContent));


        //    var receiptsAreSent = this.SendReciept(messages);

        //    return receiptsAreSent;
        //}

        //private string GenerateMessageContent(ApplicationUser user, SendOrdersReceiptViewModel sendOrdersReceiptViewModel, bool isPractitionerUser)
        //{
        //    var message = new StringBuilder();
        //    var appealToString = user.FirstName == null || user.LastName == null ? $"{user.FirstName} {user.LastName}" : "Customer";
        //    var proccedToAccountType = isPractitionerUser ? "practitionerAccount" : "personalAccount";

        //    message.AppendLine($"Dear  {appealToString}, thank you for purchasing our products. Here is the receipt for your latest order:\n");
        //    message.AppendLine($"Date: {DateTime.Now.ToString("dd/MM/yyyy")}");
        //    message.AppendLine($"Total price: {sendOrdersReceiptViewModel.totalPriceString}\n");
        //    message.AppendLine($"Below are the codes that you bought, to navigate to your personal space and see them please procced to https://www.somefreedomain.ml/{proccedToAccountType}:");
        //    message.AppendLine("-----------------------------------------------------------------");

        //    foreach (var entry in sendOrdersReceiptViewModel.codesDictionary)
        //    {
        //        if (entry.Value == 1)
        //        {
        //            message.AppendLine($"{entry.Key} - {entry.Value} usage");
        //        }
        //        else
        //        {
        //            message.AppendLine($"{entry.Key} - {entry.Value} usages");
        //        }
        //    }

        //    message.AppendLine("-----------------------------------------------------------------\n");
        //    message.AppendLine("We appreciate your order!");
        //    message.AppendLine("Kairios Praxis");

        //    return message.ToString();
        //}

        //public bool SendReciept(List<MessageViewModel> messages)
        //{
        //    messages.ForEach(message =>
        //    {
        //        SendEmail(message);
        //    });

        //    return true;
        //}

        //public void SendEmail(MessageViewModel message)
        //{
        //    var emailMessage = CreateEmailMessage(message);
        //    Send(emailMessage);
        //}

        private MimeMessage CreateEmailMessage(MessageViewModel message)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(_configuration.GetSection("EmailSendersEmailAddress").Value));
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
                    client.Connect("smtp.gmail.com", 465, true);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");
                    client.Authenticate(_configuration.GetSection("EmailSendersEmailAddress").Value, _configuration.GetSection("EmailSendersPassword").Value);
                    client.Send(mailMessage);
                }
                catch
                {
                    throw;
                }
                finally
                {
                    client.Disconnect(true);
                    client.Dispose();
                }
            }
        }

        //These methods support was suspended
        //private string GenerateMembershipRenewalMessageContent(ApplicationUser user)
        //{
        //    var message = new StringBuilder();
        //    var appealToString = user.FirstName == null || user.LastName == null ? $"{user.FirstName} {user.LastName}" : "Customer";
        //    var proccedToAccountType = "practitionerAccount";
        //    var newMembershipValidTill = _applicationDbContext.Memberships.First(m => m.UserId == user.Id).ValidTill;

        //    message.AppendLine($"Dear  {appealToString}, thank you for renewing your membership. Here is the receipt for your latest renewal:\n");
        //    message.AppendLine($"Date: {DateTime.Now.ToString("dd/MM/yyyy")}");
        //    message.AppendLine($"Total price: $50\n");
        //    message.AppendLine($"Your new membership is expanded till {newMembershipValidTill.ToString("dd/MM/yyyy")}, to see your membership status in your account please procced to https://www.somefreedomain.ml/{proccedToAccountType}.\n");
        //    message.AppendLine("We appreciate your order!");
        //    message.AppendLine("Kairios Praxis");

        //    return message.ToString();
        //}

        //private MessageViewModel GenerateMembershipRenewalMessage(ApplicationUser user)
        //{
        //    var toAddress = user.ProfessionalEmail == null ? user.Email : user.ProfessionalEmail;
        //    var messageContent = this.GenerateMembershipRenewalMessageContent(user);
        //    var message = new MessageViewModel(new List<string> { toAddress }, "Membership renewal receipt", messageContent);

        //    return message;
        //}

        private MessageViewModel GeneratePasswordResetMessage(string email, string resetLink)
        {
            var messageContent = $"Dear customer here is your password reset link: {resetLink}.\n\nPlease proceed to it, and follow the instructions on the site.";
            var message = new MessageViewModel(new List<string> { email }, "Reset password", messageContent);

            return message;
        }

        //These methods support was suspended
        //public async Task<bool> SendMembershipRenewalReceipt(string userId)
        //{
        //    var user = await _applicationDbContext.Users.FindAsync(userId);
        //    var message = this.GenerateMembershipRenewalMessage(user);

        //    var emailToSend = this.CreateEmailMessage(message);

        //    this.Send(emailToSend);

        //    return true;
        //}

        public async Task<bool> EmailPasswordResetLinkAsync(string email)
        {
            var user = await _applicationDbContext.Users.FirstAsync(u => u.Email == email || u.ProfessionalEmail == email);

            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);

            var queryParams = new Dictionary<string, string>()
            {
                {"token", resetToken },
                {"email", email }
            };

            var resetLink = QueryHelpers.AddQueryString($"https://{_configuration.GetSection("JwtIssuer").Value}/resetPassword", queryParams);

            var message = this.GeneratePasswordResetMessage(email, resetLink);
            var emailToSend = this.CreateEmailMessage(message);

            this.Send(emailToSend);

            return true;
        }

        public bool EmailUserAboutNewCodeTransfered(CodeTransferEmailViewModel codeTransferEmailViewModel)
        {
            var callback = $"https://{_configuration.GetSection("JwtIssuer").Value}/personalAccount";

            var message = this.GenerateEmailAboutNewCodeTransferedMessage(codeTransferEmailViewModel, callback);
            var emailToSend = this.CreateEmailMessage(message);

            this.Send(emailToSend);

            return true;
        }

        private MessageViewModel GenerateEmailAboutNewCodeTransferedMessage(CodeTransferEmailViewModel codeTransferEmailViewModel, string callback)
        {
            var message = new MessageViewModel(new List<string> { codeTransferEmailViewModel.Email }, codeTransferEmailViewModel.Subject, codeTransferEmailViewModel.Message + $"\nYour new code is {codeTransferEmailViewModel.Code}.\nPlease proceed to your personal space, to see it:" + callback);

            return message;
        }

        private MessageViewModel GenerateMessageToPractitioner(EmailMessageToPractitionerViewModel emailMessageToPractitioner, string email)
        {
            var message = new MessageViewModel(new List<string> { email }, emailMessageToPractitioner.MessageSubject, emailMessageToPractitioner.MessageContent);

            return message;
        }

        public async Task<bool> SendMessageToPractitionerAsync(EmailMessageToPractitionerViewModel emailMessageToPractitioner)
        {
            var user = await _applicationDbContext.Users.FirstAsync(u => u.Id == emailMessageToPractitioner.PractitionerId);
            var message = this.GenerateMessageToPractitioner(emailMessageToPractitioner, user.Email);
            var emailToSend = this.CreateEmailMessage(message);

            this.Send(emailToSend);

            return true;
        }
    }
}
