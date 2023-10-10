using BlogService.Data;
using BlogService.Dto;
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
        public async Task<ActionResult> AddLike([FromBody] LikeDto likeDto)
        {
            // Check if user has already liked the post
            var existingLike = await _context.Likes.FirstOrDefaultAsync(l => l.PostId == likeDto.PostId && l.UserId == likeDto.UserId);

            if (existingLike != null)
            {
                return BadRequest("User has already liked this post.");
            }

            // Add new like to Likes table
            var newLike = new Like
            {
                PostId = likeDto.PostId,  // <- Corrected here
                UserId = likeDto.UserId,  // <- And here
                DateLiked = DateTime.Now
            };

            _context.Likes.Add(newLike);

            // Increment TotalLikes in the Post
            var post = await _context.Posts.FindAsync(likeDto.PostId);  // <- Corrected here too
            if (post != null)
            {
                post.TotalLikes += 1;
            }

            await _context.SaveChangesAsync();

            return Ok("Liked successfully.");
        }
    }
}
