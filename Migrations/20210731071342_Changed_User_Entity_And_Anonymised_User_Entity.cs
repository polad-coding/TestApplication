using Microsoft.EntityFrameworkCore.Migrations;

namespace KPProject.Migrations
{
    public partial class Changed_User_Entity_And_Anonymised_User_Entity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Education",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "Position",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "SectorOfActivity",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "Education",
                table: "AnonymisedUsers");

            migrationBuilder.DropColumn(
                name: "Position",
                table: "AnonymisedUsers");

            migrationBuilder.DropColumn(
                name: "SectorOfActivity",
                table: "AnonymisedUsers");

            migrationBuilder.CreateTable(
                name: "AnonymisedUserEducations",
                columns: table => new
                {
                    AnonymisedUserId = table.Column<int>(nullable: false),
                    EducationId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnonymisedUserEducations", x => new { x.AnonymisedUserId, x.EducationId });
                    table.ForeignKey(
                        name: "FK_AnonymisedUserEducations_AnonymisedUsers_AnonymisedUserId",
                        column: x => x.AnonymisedUserId,
                        principalTable: "AnonymisedUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AnonymisedUserEducations_Educations_EducationId",
                        column: x => x.EducationId,
                        principalTable: "Educations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AnonymisedUserPositions",
                columns: table => new
                {
                    AnonymisedUserId = table.Column<int>(nullable: false),
                    PositionId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnonymisedUserPositions", x => new { x.AnonymisedUserId, x.PositionId });
                    table.ForeignKey(
                        name: "FK_AnonymisedUserPositions_AnonymisedUsers_AnonymisedUserId",
                        column: x => x.AnonymisedUserId,
                        principalTable: "AnonymisedUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AnonymisedUserPositions_Positions_PositionId",
                        column: x => x.PositionId,
                        principalTable: "Positions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AnonymisedUserSectorsOfActivities",
                columns: table => new
                {
                    AnonymisedUserId = table.Column<int>(nullable: false),
                    SectorOfActivityId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnonymisedUserSectorsOfActivities", x => new { x.AnonymisedUserId, x.SectorOfActivityId });
                    table.ForeignKey(
                        name: "FK_AnonymisedUserSectorsOfActivities_AnonymisedUsers_Anonymised~",
                        column: x => x.AnonymisedUserId,
                        principalTable: "AnonymisedUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AnonymisedUserSectorsOfActivities_SectorsOfActivity_SectorOf~",
                        column: x => x.SectorOfActivityId,
                        principalTable: "SectorsOfActivity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AnonymisedUserEducations_EducationId",
                table: "AnonymisedUserEducations",
                column: "EducationId");

            migrationBuilder.CreateIndex(
                name: "IX_AnonymisedUserPositions_PositionId",
                table: "AnonymisedUserPositions",
                column: "PositionId");

            migrationBuilder.CreateIndex(
                name: "IX_AnonymisedUserSectorsOfActivities_SectorOfActivityId",
                table: "AnonymisedUserSectorsOfActivities",
                column: "SectorOfActivityId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AnonymisedUserEducations");

            migrationBuilder.DropTable(
                name: "AnonymisedUserPositions");

            migrationBuilder.DropTable(
                name: "AnonymisedUserSectorsOfActivities");

            migrationBuilder.AddColumn<string>(
                name: "Education",
                table: "AspNetUsers",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Position",
                table: "AspNetUsers",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SectorOfActivity",
                table: "AspNetUsers",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Education",
                table: "AnonymisedUsers",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Position",
                table: "AnonymisedUsers",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SectorOfActivity",
                table: "AnonymisedUsers",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);
        }
    }
}
