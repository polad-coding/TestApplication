using Microsoft.EntityFrameworkCore.Migrations;

namespace KPProject.Migrations
{
    public partial class Added_Anonymised_User_Field_To_Survey_Entity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AnonymisedUserId",
                table: "Surveys",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Surveys_AnonymisedUserId",
                table: "Surveys",
                column: "AnonymisedUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Surveys_AnonymisedUsers_AnonymisedUserId",
                table: "Surveys",
                column: "AnonymisedUserId",
                principalTable: "AnonymisedUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Surveys_AnonymisedUsers_AnonymisedUserId",
                table: "Surveys");

            migrationBuilder.DropIndex(
                name: "IX_Surveys_AnonymisedUserId",
                table: "Surveys");

            migrationBuilder.DropColumn(
                name: "AnonymisedUserId",
                table: "Surveys");
        }
    }
}
