namespace UserService.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public DateTime DateCreated { get; set; }
        public ICollection<UserRole> UserRoles { get; set; }
    }
}
