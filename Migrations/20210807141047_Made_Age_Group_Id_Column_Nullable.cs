using Microsoft.EntityFrameworkCore.Migrations;

namespace KPProject.Migrations
{
    public partial class Made_Age_Group_Id_Column_Nullable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_AgeGroups_AgeGroupModelId",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<int>(
                name: "AgeGroupModelId",
                table: "AspNetUsers",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_AgeGroups_AgeGroupModelId",
                table: "AspNetUsers",
                column: "AgeGroupModelId",
                principalTable: "AgeGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_AgeGroups_AgeGroupModelId",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<int>(
                name: "AgeGroupModelId",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_AgeGroups_AgeGroupModelId",
                table: "AspNetUsers",
                column: "AgeGroupModelId",
                principalTable: "AgeGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
