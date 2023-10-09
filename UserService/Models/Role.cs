namespace UserService.Models
{
    public class Role
    {
        public int RoleId { get; set; }
        public string Name { get; set; }
        public ICollection<User> Users { get; set; }  // One-to-many relationship
    }
}
