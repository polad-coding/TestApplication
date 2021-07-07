using Microsoft.EntityFrameworkCore.Migrations;

namespace KPProject.Migrations
{
    public partial class Made_Code_Body_Fields_Unique_In_Coupon_Entities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "CouponBody",
                table: "GeneralCoupons",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext CHARACTER SET utf8mb4",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CodeBody",
                table: "AssociatedCoupons",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext CHARACTER SET utf8mb4",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_GeneralCoupons_CouponBody",
                table: "GeneralCoupons",
                column: "CouponBody",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AssociatedCoupons_CodeBody",
                table: "AssociatedCoupons",
                column: "CodeBody",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_GeneralCoupons_CouponBody",
                table: "GeneralCoupons");

            migrationBuilder.DropIndex(
                name: "IX_AssociatedCoupons_CodeBody",
                table: "AssociatedCoupons");

            migrationBuilder.AlterColumn<string>(
                name: "CouponBody",
                table: "GeneralCoupons",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CodeBody",
                table: "AssociatedCoupons",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);
        }
    }
}
