using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BlogService.Migrations
{
    public partial class AddTotalLikes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TotalLikes",
                table: "Posts",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalLikes",
                table: "Posts");
        }
    }
}
