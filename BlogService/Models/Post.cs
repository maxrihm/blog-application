namespace BlogService.Models
{
    public class Post
    {
        public int PostId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.Now;
    }
}
