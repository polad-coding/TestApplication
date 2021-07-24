using KPProject.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.Interfaces
{
    public interface IEmailSender
    {
        void SendEmail(MessageViewModel message);
        bool SendReciept(List<MessageViewModel> messages);
        Task<bool> SendReceiptsAsync(SendOrdersReceiptViewModel sendOrdersReceiptViewModel, string userId);

    }
}
