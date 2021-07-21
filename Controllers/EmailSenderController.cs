using KPProject.Interfaces;
using KPProject.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
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
    }
}
