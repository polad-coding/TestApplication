using Microsoft.EntityFrameworkCore.Migrations;

namespace KPProject.Migrations
{
    public partial class Added_Field_To_Order_And_Made_Renaming_In_AC : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AssociatedCoupons_CodeBody",
                table: "AssociatedCoupons");

            migrationBuilder.DropColumn(
                name: "CodeBody",
                table: "AssociatedCoupons");

            migrationBuilder.AddColumn<string>(
                name: "CouponBody",
                table: "Orders",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CouponBody",
                table: "AssociatedCoupons",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AssociatedCoupons_CouponBody",
                table: "AssociatedCoupons",
                column: "CouponBody",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AssociatedCoupons_CouponBody",
                table: "AssociatedCoupons");

            migrationBuilder.DropColumn(
                name: "CouponBody",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "CouponBody",
                table: "AssociatedCoupons");

            migrationBuilder.AddColumn<string>(
                name: "CodeBody",
                table: "AssociatedCoupons",
                type: "varchar(255) CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AssociatedCoupons_CodeBody",
                table: "AssociatedCoupons",
                column: "CodeBody",
                unique: true);
        }
    }
}
