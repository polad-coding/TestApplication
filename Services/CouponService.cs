using KPProject.Data;
using KPProject.Interfaces;
using KPProject.ViewModels;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.Services
{
    public class CouponService: ICouponService
    {
        private readonly ApplicationDbContext _applicationDbContext;

        public CouponService(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }

        /// <summary>
        /// Checks if all entered coupons, are used proper amount of times.
        /// </summary>
        /// <param name="orders"></param>
        /// <returns></returns>
        public async Task<bool> CheckIfAllCouponsAreValidAsync(List<OrderViewModel> orders)
        {

            foreach (var order in orders)
            {
                if (order.CouponBody == null)
                {
                    continue;
                }

                var coupon = await _applicationDbContext.AssociatedCoupons.FirstOrDefaultAsync(ac => ac.CouponBody == order.CouponBody);

                if (coupon == null)
                {
                    continue;
                }

                var numberOfDuplicateCoupons = 0;

                orders.ForEach(o =>
                {
                    if (o.CouponBody == order.CouponBody)
                    {
                        numberOfDuplicateCoupons += 1 * o.NumberOfUsages;
                    }
                });

                if (coupon.NumberOfUsagesLeft < numberOfDuplicateCoupons)
                {
                    return false;
                }
            }

            return true;
        }

        public async Task<GetCouponRequestResponseViewModel> GetCouponAsync(string couponBody, string userId)
        {
            GetCouponRequestResponseViewModel response;
            var generalCoupon = await _applicationDbContext.GeneralCoupons.FirstOrDefaultAsync(gc => gc.CouponBody == couponBody);

            if (generalCoupon != null)
            {
                response = new GetCouponRequestResponseViewModel { Id = generalCoupon.Id, CouponBody = couponBody, NumberOfUsagesLeft = null, DiscountRate = generalCoupon.DiscountRate };
                return response;
            }

            var associatedCoupon = await _applicationDbContext.AssociatedCoupons.FirstOrDefaultAsync(ac => ac.CouponBody == couponBody && ac.ApplicationUserAssociatedCoupons.FirstOrDefault(auac => auac.ApplicationUserId == userId && auac.AssociatedCouponId == ac.Id) != null);

            if (associatedCoupon != null)
            {
                response = new GetCouponRequestResponseViewModel { Id = associatedCoupon.Id, CouponBody = couponBody, NumberOfUsagesLeft = associatedCoupon.NumberOfUsagesLeft, DiscountRate = associatedCoupon.DiscountRate };
                return response;
            }

            return null;
        }

    }
}
