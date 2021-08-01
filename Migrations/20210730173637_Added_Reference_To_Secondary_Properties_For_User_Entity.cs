using Microsoft.EntityFrameworkCore.Migrations;

namespace KPProject.Migrations
{
    public partial class Added_Reference_To_Secondary_Properties_For_User_Entity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ApplicationUserEducations",
                columns: table => new
                {
                    ApplicationUserId = table.Column<string>(nullable: false),
                    EducationId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationUserEducations", x => new { x.ApplicationUserId, x.EducationId });
                    table.ForeignKey(
                        name: "FK_ApplicationUserEducations_AspNetUsers_ApplicationUserId",
                        column: x => x.ApplicationUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ApplicationUserEducations_Educations_EducationId",
                        column: x => x.EducationId,
                        principalTable: "Educations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ApplicationUserPositions",
                columns: table => new
                {
                    ApplicationUserId = table.Column<string>(nullable: false),
                    PositionId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationUserPositions", x => new { x.ApplicationUserId, x.PositionId });
                    table.ForeignKey(
                        name: "FK_ApplicationUserPositions_AspNetUsers_ApplicationUserId",
                        column: x => x.ApplicationUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ApplicationUserPositions_Positions_PositionId",
                        column: x => x.PositionId,
                        principalTable: "Positions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ApplicationUserSectorsOfActivities",
                columns: table => new
                {
                    ApplicationUserId = table.Column<string>(nullable: false),
                    SectorOfActivityId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationUserSectorsOfActivities", x => new { x.ApplicationUserId, x.SectorOfActivityId });
                    table.ForeignKey(
                        name: "FK_ApplicationUserSectorsOfActivities_AspNetUsers_ApplicationUs~",
                        column: x => x.ApplicationUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ApplicationUserSectorsOfActivities_SectorsOfActivity_SectorO~",
                        column: x => x.SectorOfActivityId,
                        principalTable: "SectorsOfActivity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationUserEducations_EducationId",
                table: "ApplicationUserEducations",
                column: "EducationId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationUserPositions_PositionId",
                table: "ApplicationUserPositions",
                column: "PositionId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationUserSectorsOfActivities_SectorOfActivityId",
                table: "ApplicationUserSectorsOfActivities",
                column: "SectorOfActivityId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApplicationUserEducations");

            migrationBuilder.DropTable(
                name: "ApplicationUserPositions");

            migrationBuilder.DropTable(
                name: "ApplicationUserSectorsOfActivities");
        }
    }
}
