using KPProject.ViewModels;
using System.Threading.Tasks;

namespace KPProject.Interfaces
{
    public interface IEmailSender
    {
        //These methods support was suspended
        //void SendEmail(MessageViewModel message);
        //bool SendReciept(List<MessageViewModel> messages);
        //Task<bool> SendReceiptsAsync(SendOrdersReceiptViewModel sendOrdersReceiptViewModel, string userId);
        //Task<bool> SendMembershipRenewalReceipt(string userId);

        Task<bool> EmailPasswordResetLinkAsync(string email);
        bool EmailUserAboutNewCodeTransfered(CodeTransferEmailViewModel emailCodeLinkViewModel);
        Task<bool> SendMessageToPractitionerAsync(EmailMessageToPractitionerViewModel emailMessageToPractitioner);
    }
}
