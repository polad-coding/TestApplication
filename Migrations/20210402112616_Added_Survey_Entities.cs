using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace KPProject.Migrations
{
    public partial class Added_Survey_Entities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Surveys",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    SurveyTakerUserId = table.Column<string>(nullable: true),
                    Seed = table.Column<int>(nullable: false),
                    PractitionerUserId = table.Column<string>(nullable: true),
                    Code = table.Column<string>(nullable: true),
                    FinishedOn = table.Column<DateTime>(nullable: false),
                    FirstStagePassed = table.Column<bool>(nullable: false),
                    SecondStagePassed = table.Column<bool>(nullable: false),
                    ThirdStagePassed = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Surveys", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Surveys_AspNetUsers_PractitionerUserId",
                        column: x => x.PractitionerUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Surveys_AspNetUsers_SurveyTakerUserId",
                        column: x => x.SurveyTakerUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SurveyFirstStages",
                columns: table => new
                {
                    SurveyId = table.Column<int>(nullable: false),
                    ValueId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurveyFirstStages", x => new { x.SurveyId, x.ValueId });
                    table.ForeignKey(
                        name: "FK_SurveyFirstStages_Surveys_SurveyId",
                        column: x => x.SurveyId,
                        principalTable: "Surveys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SurveyFirstStages_Values_ValueId",
                        column: x => x.ValueId,
                        principalTable: "Values",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SurveySecondStages",
                columns: table => new
                {
                    SurveyId = table.Column<int>(nullable: false),
                    ValueId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurveySecondStages", x => new { x.SurveyId, x.ValueId });
                    table.ForeignKey(
                        name: "FK_SurveySecondStages_Surveys_SurveyId",
                        column: x => x.SurveyId,
                        principalTable: "Surveys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SurveySecondStages_Values_ValueId",
                        column: x => x.ValueId,
                        principalTable: "Values",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SurveyThirdStages",
                columns: table => new
                {
                    SurveyId = table.Column<int>(nullable: false),
                    ValueId = table.Column<int>(nullable: false),
                    ValuePriority = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurveyThirdStages", x => new { x.SurveyId, x.ValueId });
                    table.ForeignKey(
                        name: "FK_SurveyThirdStages_Surveys_SurveyId",
                        column: x => x.SurveyId,
                        principalTable: "Surveys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SurveyThirdStages_Values_ValueId",
                        column: x => x.ValueId,
                        principalTable: "Values",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SurveyFirstStages_ValueId",
                table: "SurveyFirstStages",
                column: "ValueId");

            migrationBuilder.CreateIndex(
                name: "IX_Surveys_PractitionerUserId",
                table: "Surveys",
                column: "PractitionerUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Surveys_SurveyTakerUserId",
                table: "Surveys",
                column: "SurveyTakerUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SurveySecondStages_ValueId",
                table: "SurveySecondStages",
                column: "ValueId");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyThirdStages_ValueId",
                table: "SurveyThirdStages",
                column: "ValueId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SurveyFirstStages");

            migrationBuilder.DropTable(
                name: "SurveySecondStages");

            migrationBuilder.DropTable(
                name: "SurveyThirdStages");

            migrationBuilder.DropTable(
                name: "Surveys");
        }
    }
}
