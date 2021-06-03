using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace KPProject.Migrations
{
    public partial class Added_Anonymised_User_Entity_To_The_Database : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AnonymisedUsers",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    GenderId = table.Column<int>(nullable: true),
                    Education = table.Column<string>(nullable: true),
                    Position = table.Column<string>(nullable: true),
                    SectorOfActivity = table.Column<string>(nullable: true),
                    Age = table.Column<int>(nullable: false),
                    MyerBriggsCode = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnonymisedUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AnonymisedUsers_Gender_GenderId",
                        column: x => x.GenderId,
                        principalTable: "Gender",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AnonymisedUserRegions",
                columns: table => new
                {
                    AnonymisedUserId = table.Column<int>(nullable: false),
                    RegionId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnonymisedUserRegions", x => new { x.AnonymisedUserId, x.RegionId });
                    table.ForeignKey(
                        name: "FK_AnonymisedUserRegions_AnonymisedUsers_AnonymisedUserId",
                        column: x => x.AnonymisedUserId,
                        principalTable: "AnonymisedUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AnonymisedUserRegions_Regions_RegionId",
                        column: x => x.RegionId,
                        principalTable: "Regions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AnonymisedUserRegions_RegionId",
                table: "AnonymisedUserRegions",
                column: "RegionId");

            migrationBuilder.CreateIndex(
                name: "IX_AnonymisedUsers_GenderId",
                table: "AnonymisedUsers",
                column: "GenderId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AnonymisedUserRegions");

            migrationBuilder.DropTable(
                name: "AnonymisedUsers");
        }
    }
}
