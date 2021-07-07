using System.ComponentModel.DataAnnotations.Schema;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.Models
{
    public class GeneralCoupon
    {
        public int Id { get; set; }
        public string CouponBody { get; set; }
        public double DiscountRate { get; set; }
    }
}
