using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace KPProject.Migrations
{
    public partial class Added_Age_Group_Entity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AgeGroupModelId",
                table: "AspNetUsers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "AgeGroups",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    GroupAgeRange = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AgeGroups", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_AgeGroupModelId",
                table: "AspNetUsers",
                column: "AgeGroupModelId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_AgeGroups_AgeGroupModelId",
                table: "AspNetUsers",
                column: "AgeGroupModelId",
                principalTable: "AgeGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_AgeGroups_AgeGroupModelId",
                table: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "AgeGroups");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_AgeGroupModelId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "AgeGroupModelId",
                table: "AspNetUsers");
        }
    }
}
