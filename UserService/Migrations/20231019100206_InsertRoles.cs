using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UserService.Migrations
{
    public partial class InsertRoles : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "RoleId", "Name" },
                values: new object[,]
                {
            { 0, "User" },
            { 1, "Admin" }
                }
            );
        }
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "RoleId",
                keyValues: new object[] { 0 }
            );

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "RoleId",
                keyValues: new object[] { 1 }
            );
        }

    }
}
