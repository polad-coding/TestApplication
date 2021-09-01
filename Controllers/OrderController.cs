using KPProject.Interfaces;
using KPProject.Models;
using KPProject.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace KPProject.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        [Route("DeleteAllOrdersOfTheCurrentUser")]
        public async Task<ActionResult> DeleteAllOrdersOfTheCurrentUserAsync()
        {
            var requestSucceded = await _orderService.DeleteAllOrdersOfTheCurrentUserAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (requestSucceded)
            {
                return Ok();
            }

            return StatusCode(500);
        }

        [HttpPost]
        [Route("TransferTheCode")]
        public async Task<ActionResult> TransferTheCodeAsync([FromBody] TransferCodesViewModel transferCodesViewModel)
        {
            var isOperationSuccessful = await _orderService.TransferTheCodeAsync(transferCodesViewModel);

            if (isOperationSuccessful)
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpGet]
        [Route("CheckIfCodeIsValid")]
        public async Task<ActionResult<bool>> CheckIfCodeIsValidAsync(string code)
        {
            var isValid = await _orderService.CheckIfCodeIsValidAsync(code, User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (isValid)
            {
                return Ok(true);
            }

            return Ok(false);
        }

        [HttpPost]
        [Route("GenerateOrders")]
        public async Task<ActionResult<List<OrderModel>>> GenerateOrdersAsync(List<OrderViewModel> ordersList)
        {
            var orders = await _orderService.GenerateOrdersAsync(ordersList, User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (orders != null)
            {
                return Ok(orders);
            }

            return BadRequest();
        }
    }
}
