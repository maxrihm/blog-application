namespace BlogService.Models
{
    public class Like
    {
        public int LikeId { get; set; }
        public int PostId { get; set; }
        public int UserId { get; set; }
        public DateTime DateLiked { get; set; }
    }

}
