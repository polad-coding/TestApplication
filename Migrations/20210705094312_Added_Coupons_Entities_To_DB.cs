using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace KPProject.Migrations
{
    public partial class Added_Coupons_Entities_To_DB : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AssociatedCoupons",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CodeBody = table.Column<string>(nullable: true),
                    DiscountRate = table.Column<double>(nullable: false),
                    NumberOfUsagesLeft = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AssociatedCoupons", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GeneralCoupons",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CouponBody = table.Column<string>(nullable: true),
                    DiscountRate = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GeneralCoupons", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ApplicationUserAssociatedCoupons",
                columns: table => new
                {
                    ApplicationUserId = table.Column<string>(nullable: false),
                    AssociatedCouponId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationUserAssociatedCoupons", x => new { x.ApplicationUserId, x.AssociatedCouponId });
                    table.ForeignKey(
                        name: "FK_ApplicationUserAssociatedCoupons_AspNetUsers_ApplicationUser~",
                        column: x => x.ApplicationUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ApplicationUserAssociatedCoupons_AssociatedCoupons_Associate~",
                        column: x => x.AssociatedCouponId,
                        principalTable: "AssociatedCoupons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationUserAssociatedCoupons_AssociatedCouponId",
                table: "ApplicationUserAssociatedCoupons",
                column: "AssociatedCouponId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApplicationUserAssociatedCoupons");

            migrationBuilder.DropTable(
                name: "GeneralCoupons");

            migrationBuilder.DropTable(
                name: "AssociatedCoupons");
        }
    }
}
