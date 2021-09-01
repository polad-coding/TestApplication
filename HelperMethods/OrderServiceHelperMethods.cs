using KPProject.Data;
using KPProject.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace KPProject.HelperMethods
{
    public class OrderServiceHelperMethods
    {
        public static async Task DecreaseNumberOfUsagesOfAssociatedCoupons(List<OrderViewModel> ordersList, ApplicationDbContext applicationDbContext)
        {
            foreach (var order in ordersList)
            {
                var coupon = await applicationDbContext.AssociatedCoupons.FirstOrDefaultAsync(ac => ac.CouponBody == order.CouponBody);

                for (int i = 0; i < order.NumberOfUsages; i++)
                {
                    if (order.CouponBody == null || coupon == null)
                    {
                        continue;
                    }

                    if (coupon.NumberOfUsagesLeft == 1)
                    {
                        applicationDbContext.AssociatedCoupons.Remove(coupon);
                        continue;
                    }

                    coupon.NumberOfUsagesLeft -= 1;
                    applicationDbContext.AssociatedCoupons.Update(coupon);
                }

            }
        }

        public static string GenerateNewCode(int CODES_LENGTH)
        {
            var codesLength = CODES_LENGTH;
            var code = new StringBuilder();
            var randomGenerator = new Random();
            var sourceString = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            char randomCharacter = ' ';

            for (int i = 0; i < codesLength; i++)
            {
                randomCharacter = sourceString[randomGenerator.Next(0, sourceString.Length)];
                code.Append(randomCharacter);
            }

            return code.ToString();
        }
    }
}
