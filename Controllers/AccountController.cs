using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.Controllers
{
    [Authorize(Roles = "User")]
    [Route("[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {

        [HttpPost]
        [Route("DoSomething")]
        public async Task<ActionResult> DoSomething()
        {
            return Ok("All is ok!");
        }

    }
}
