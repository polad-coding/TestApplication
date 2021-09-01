using KPProject.Models;
using KPProject.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace KPProject.Interfaces
{
    public interface IOrderService
    {
        Task<List<OrderModel>> GenerateOrdersAsync(List<OrderViewModel> ordersList, string userId);
        Task<bool> CheckIfCodeIsValidAsync(string code, string userId);
        Task<bool> TransferTheCodeAsync(TransferCodesViewModel transferCodesViewModel);
        Task<bool> DeleteAllOrdersOfTheCurrentUserAsync(string userId);

    }
}
