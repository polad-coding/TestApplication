using Microsoft.EntityFrameworkCore.Migrations;

namespace KPProject.Migrations
{
    public partial class Added_Age_Group_Property_To_Anonymised_User_Entity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Age",
                table: "AnonymisedUsers");

            migrationBuilder.AddColumn<int>(
                name: "AgeGroupId",
                table: "AnonymisedUsers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_AnonymisedUsers_AgeGroupId",
                table: "AnonymisedUsers",
                column: "AgeGroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_AnonymisedUsers_AgeGroups_AgeGroupId",
                table: "AnonymisedUsers",
                column: "AgeGroupId",
                principalTable: "AgeGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AnonymisedUsers_AgeGroups_AgeGroupId",
                table: "AnonymisedUsers");

            migrationBuilder.DropIndex(
                name: "IX_AnonymisedUsers_AgeGroupId",
                table: "AnonymisedUsers");

            migrationBuilder.DropColumn(
                name: "AgeGroupId",
                table: "AnonymisedUsers");

            migrationBuilder.AddColumn<int>(
                name: "Age",
                table: "AnonymisedUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
