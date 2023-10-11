namespace BlogService.Models
{
    public class Comment
    {
        public int CommentId { get; set; }
        public int PostId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }  // New field
        public string Content { get; set; }
        public DateTime DateCreated { get; set; }
    }

}
