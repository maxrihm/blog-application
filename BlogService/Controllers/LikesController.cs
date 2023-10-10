using BlogService.Data;
using BlogService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;  // <-- Add this line

namespace BlogService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LikesController : ControllerBase
    {
        private readonly BlogServiceContext _context;

        public LikesController(BlogServiceContext context)
        {
            _context = context;
        }

        // POST: api/Likes
        [HttpPost]
        public async Task<ActionResult> AddLike(int postId, int userId)
        {
            // Check if user has already liked the post
            var existingLike = await _context.Likes.FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId);

            if (existingLike != null)
            {
                return BadRequest("User has already liked this post.");
            }

            // Add new like to Likes table
            var newLike = new Like
            {
                PostId = postId,
                UserId = userId,
                DateLiked = DateTime.Now
            };

            _context.Likes.Add(newLike);

            // Increment TotalLikes in the Post
            var post = await _context.Posts.FindAsync(postId);
            if (post != null)
            {
                post.TotalLikes += 1;
            }

            await _context.SaveChangesAsync();

            return Ok("Liked successfully.");
        }
    }
}
