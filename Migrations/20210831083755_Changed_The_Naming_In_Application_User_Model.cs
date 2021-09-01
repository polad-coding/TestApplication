using Microsoft.EntityFrameworkCore.Migrations;

namespace KPProject.Migrations
{
    public partial class Changed_The_Naming_In_Application_User_Model : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_AgeGroups_AgeGroupModelId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_AgeGroupModelId",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                name: "AgeGroupId",
                table: "AspNetUsers",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_AgeGroupId",
                table: "AspNetUsers",
                column: "AgeGroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_AgeGroups_AgeGroupId",
                table: "AspNetUsers",
                column: "AgeGroupId",
                principalTable: "AgeGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_AgeGroups_AgeGroupId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_AgeGroupId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "AgeGroupId",
                table: "AspNetUsers");

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
                onDelete: ReferentialAction.Restrict);
        }
    }
}
