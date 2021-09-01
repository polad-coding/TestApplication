using KPProject.Data;
using KPProject.HelperMethods;
using KPProject.Interfaces;
using KPProject.Models;
using KPProject.ViewModels;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.Services
{
    public class OrderService : IOrderService
    {
        private readonly ApplicationDbContext _applicationDbContext;
        private const int CODES_LENGTH = 6;

        public OrderService(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }

        public async Task<List<OrderModel>> GenerateOrdersAsync(List<OrderViewModel> ordersList, string userId)
        {
            var generatedCode = "";
            var ordersToSave = new List<OrderModel>();

            ordersList.ForEach(order =>
            {
                for (int i = 0; i < order.NumberOfUsages / order.DefaultNumberOfUsages; i++)
                {
                    generatedCode = OrderServiceHelperMethods.GenerateNewCode(CODES_LENGTH);
                    ordersToSave.Add(new OrderModel { NumberOfUsages = order.DefaultNumberOfUsages, UserId = userId, CodeBody = generatedCode });
                }
            });

            await _applicationDbContext.Orders.AddRangeAsync(ordersToSave);

            await OrderServiceHelperMethods.DecreaseNumberOfUsagesOfAssociatedCoupons(ordersList, _applicationDbContext);

            if (await _applicationDbContext.SaveChangesAsync() > 0)
            {
                return ordersToSave;
            }

            return null;
        }

        public async Task<bool> CheckIfCodeIsValidAsync(string code, string userId)
        {
            var survey = await _applicationDbContext.Surveys.FirstOrDefaultAsync((s) =>
            (s.Code == code && s.FirstStagePassed == false && s.SurveyTakerUserId == null && s.PractitionerUserId != null) ||
            (s.Code == code && s.FirstStagePassed == false && s.SurveyTakerUserId == userId)
            );

            if (survey != null)
            {
                return true;
            }

            return false;
        }

        public async Task<bool> TransferTheCodeAsync(TransferCodesViewModel transferCodesViewModel)
        {
            var order = await _applicationDbContext.Surveys.FirstOrDefaultAsync(s => s.Code == transferCodesViewModel.Code && s.PractitionerUserId != null && s.SurveyTakerUserId == null);

            if (order == null)
            {
                return false;
            }

            order.SurveyTakerUserId = transferCodesViewModel.UserId;

            _applicationDbContext.Update(order);

            var numberOfRowsAffected = await _applicationDbContext.SaveChangesAsync();

            if (numberOfRowsAffected > 0)
            {
                return true;
            }

            return false;
        }

        public async Task<bool> DeleteAllOrdersOfTheCurrentUserAsync(string userId)
        {
            var ordersToDelete = await _applicationDbContext.Orders.Where(order => order.UserId == userId).ToListAsync();

            _applicationDbContext.Orders.RemoveRange(ordersToDelete);

            var numberOfRowsAffected = await _applicationDbContext.SaveChangesAsync();

            if (numberOfRowsAffected > 0)
            {
                return true;
            }

            return false;
        }
    }
}