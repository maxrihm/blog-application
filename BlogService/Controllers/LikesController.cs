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
        public async Task<ActionResult> ToggleLike([FromBody] LikeDto likeDto)
        {
            var existingLike = await _context.Likes.FirstOrDefaultAsync(l => l.PostId == likeDto.PostId && l.UserId == likeDto.UserId);

            var post = await _context.Posts.FindAsync(likeDto.PostId);
            if (post == null)
            {
                return NotFound(new { message = "Post not found." });
            }

            if (existingLike != null)
            {
                _context.Likes.Remove(existingLike);
                post.TotalLikes -= 1;
                await _context.SaveChangesAsync();
                return Ok(new { message = "Unliked successfully." });
            }
            else
            {
                var newLike = new Like
                {
                    PostId = likeDto.PostId,
                    UserId = likeDto.UserId,
                    DateLiked = DateTime.Now
                };

                _context.Likes.Add(newLike);
                post.TotalLikes += 1;

                await _context.SaveChangesAsync();
                return Ok(new { message = "Liked successfully." });
            }
        }
    }
}
