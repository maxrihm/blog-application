using System.ComponentModel.DataAnnotations.Schema;

namespace UserService.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime DateCreated { get; set; }

        public int RoleId { get; set; }  // New ForeignKey to Role
        public Role Role { get; set; }  // Navigation property
    }
}
