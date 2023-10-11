namespace BlogService.Dto
{
    public class LikeDto
    {
        public int PostId { get; set; }
        public int UserId { get; set; }
        public string PostTitle { get; set; }
        public string PostAuthor { get; set; }
        public string LoggedInUserName { get; set; } // Person who liked the post
    }
}
