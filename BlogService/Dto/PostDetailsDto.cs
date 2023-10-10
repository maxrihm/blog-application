namespace BlogService.Dto
{
    public class PostDetailsDto
    {
        public int PostId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime DateCreated { get; set; }
        public int TotalLikes { get; set; }
        public bool IsLikedByUser { get; set; }
    }

}
