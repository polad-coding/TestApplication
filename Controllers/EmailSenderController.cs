using KPProject.Interfaces;
using KPProject.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace KPProject.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class EmailSenderController : ControllerBase
    {
        private readonly IEmailSender _emailSenderService;

        public EmailSenderController(IEmailSender emailSender)
        {
            _emailSenderService = emailSender;
        }

        [HttpGet]
        [Route("SendMembershipRenewalReceipt")]
        public async Task<ActionResult> SendMembershipRenewalReceipt()
        {
            var receiptIsSent = await _emailSenderService.SendMembershipRenewalReceipt(User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (receiptIsSent)
            {
                return Ok();
            }

            return StatusCode(500);
        }

        [HttpPost]
        [Route("SendReciept")]
        public ActionResult SendReciept(List<MessageViewModel> messages)
        {
            var operationSuccessful = _emailSenderService.SendReciept(messages);

            if (operationSuccessful)
            {
                return Ok();
            }

            return StatusCode(500);
        }

        [HttpPost]
        [Route("SendReceipts")]
        public async Task<ActionResult> SendReceiptsAsync(SendOrdersReceiptViewModel sendOrdersReceiptViewModel)
        {
            var requestSucceded = await _emailSenderService.SendReceiptsAsync(sendOrdersReceiptViewModel, User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (requestSucceded)
            {
                return Ok();
            }

            return StatusCode(500);
        }
    }
}
