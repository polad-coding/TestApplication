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
    public class CouponController: ControllerBase
    {
        private readonly ICouponService _couponService;

        public CouponController(ICouponService couponService)
        {
            _couponService = couponService;
        }

        [HttpPost]
        [Route("CheckIfAllCouponsAreValid")]
        public async Task<ActionResult<bool>> CheckIfAllCouponsAreValidAsync(List<OrderViewModel> orders)
        {
            var requestResult = await _couponService.CheckIfAllCouponsAreValidAsync(orders);

            return Ok(requestResult);
        }

        [HttpGet]
        [Route("GetCoupon")]
        public async Task<ActionResult<GetCouponRequestResponseViewModel>> GetCouponAsync([FromQuery] string couponBody)
        {
            var coupon = await _couponService.GetCouponAsync(couponBody, User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (coupon != null)
            {
                return Ok(coupon);
            }

            return BadRequest();
        }
    }
}
