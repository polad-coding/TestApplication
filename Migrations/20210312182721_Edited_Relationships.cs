using Microsoft.EntityFrameworkCore.Migrations;

namespace KPProject.Migrations
{
    public partial class Edited_Relationships : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserLanguage_AspNetUsers_ApplicationUserId",
                table: "UserLanguage");

            migrationBuilder.DropForeignKey(
                name: "FK_UserLanguage_Languages_LanguageId",
                table: "UserLanguage");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRegion_AspNetUsers_ApplicationUserId",
                table: "UserRegion");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRegion_Regions_RegionId",
                table: "UserRegion");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserRegion",
                table: "UserRegion");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserLanguage",
                table: "UserLanguage");

            migrationBuilder.RenameTable(
                name: "UserRegion",
                newName: "UserRegions");

            migrationBuilder.RenameTable(
                name: "UserLanguage",
                newName: "UserLanguages");

            migrationBuilder.RenameIndex(
                name: "IX_UserRegion_RegionId",
                table: "UserRegions",
                newName: "IX_UserRegions_RegionId");

            migrationBuilder.RenameIndex(
                name: "IX_UserLanguage_LanguageId",
                table: "UserLanguages",
                newName: "IX_UserLanguages_LanguageId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserRegions",
                table: "UserRegions",
                columns: new[] { "ApplicationUserId", "RegionId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserLanguages",
                table: "UserLanguages",
                columns: new[] { "ApplicationUserId", "LanguageId" });

            migrationBuilder.AddForeignKey(
                name: "FK_UserLanguages_AspNetUsers_ApplicationUserId",
                table: "UserLanguages",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserLanguages_Languages_LanguageId",
                table: "UserLanguages",
                column: "LanguageId",
                principalTable: "Languages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRegions_AspNetUsers_ApplicationUserId",
                table: "UserRegions",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRegions_Regions_RegionId",
                table: "UserRegions",
                column: "RegionId",
                principalTable: "Regions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserLanguages_AspNetUsers_ApplicationUserId",
                table: "UserLanguages");

            migrationBuilder.DropForeignKey(
                name: "FK_UserLanguages_Languages_LanguageId",
                table: "UserLanguages");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRegions_AspNetUsers_ApplicationUserId",
                table: "UserRegions");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRegions_Regions_RegionId",
                table: "UserRegions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserRegions",
                table: "UserRegions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserLanguages",
                table: "UserLanguages");

            migrationBuilder.RenameTable(
                name: "UserRegions",
                newName: "UserRegion");

            migrationBuilder.RenameTable(
                name: "UserLanguages",
                newName: "UserLanguage");

            migrationBuilder.RenameIndex(
                name: "IX_UserRegions_RegionId",
                table: "UserRegion",
                newName: "IX_UserRegion_RegionId");

            migrationBuilder.RenameIndex(
                name: "IX_UserLanguages_LanguageId",
                table: "UserLanguage",
                newName: "IX_UserLanguage_LanguageId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserRegion",
                table: "UserRegion",
                columns: new[] { "ApplicationUserId", "RegionId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserLanguage",
                table: "UserLanguage",
                columns: new[] { "ApplicationUserId", "LanguageId" });

            migrationBuilder.AddForeignKey(
                name: "FK_UserLanguage_AspNetUsers_ApplicationUserId",
                table: "UserLanguage",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserLanguage_Languages_LanguageId",
                table: "UserLanguage",
                column: "LanguageId",
                principalTable: "Languages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRegion_AspNetUsers_ApplicationUserId",
                table: "UserRegion",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRegion_Regions_RegionId",
                table: "UserRegion",
                column: "RegionId",
                principalTable: "Regions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
