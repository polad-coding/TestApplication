using KPProject.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace KPProject.Interfaces
{
    public interface ICouponService
    {
        Task<bool> CheckIfAllCouponsAreValidAsync(List<OrderViewModel> orders);
        Task<GetCouponRequestResponseViewModel> GetCouponAsync(string couponBody, string userId);


    }
}
