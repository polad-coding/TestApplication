using Microsoft.EntityFrameworkCore.Migrations;

namespace KPProject.Migrations
{
    public partial class Made_Anonymised_User_Id_Field_Nullable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Surveys_AnonymisedUsers_AnonymisedUserId",
                table: "Surveys");

            migrationBuilder.AlterColumn<int>(
                name: "AnonymisedUserId",
                table: "Surveys",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Surveys_AnonymisedUsers_AnonymisedUserId",
                table: "Surveys",
                column: "AnonymisedUserId",
                principalTable: "AnonymisedUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Surveys_AnonymisedUsers_AnonymisedUserId",
                table: "Surveys");

            migrationBuilder.AlterColumn<int>(
                name: "AnonymisedUserId",
                table: "Surveys",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Surveys_AnonymisedUsers_AnonymisedUserId",
                table: "Surveys",
                column: "AnonymisedUserId",
                principalTable: "AnonymisedUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
