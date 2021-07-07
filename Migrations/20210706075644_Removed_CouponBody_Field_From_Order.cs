using Microsoft.EntityFrameworkCore.Migrations;

namespace KPProject.Migrations
{
    public partial class Removed_CouponBody_Field_From_Order : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CouponBody",
                table: "Orders");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CouponBody",
                table: "Orders",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);
        }
    }
}
