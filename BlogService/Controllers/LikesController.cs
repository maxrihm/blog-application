// BlogService/Controllers/LikesController.cs
using BlogService.Data;
using BlogService.Dto;
using BlogService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serilog;

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
            Log.Information("ToggleLike called for PostId: {PostId}, UserId: {UserId}", likeDto.PostId, likeDto.UserId);
            var existingLike = await _context.Likes.FirstOrDefaultAsync(l => l.PostId == likeDto.PostId && l.UserId == likeDto.UserId);

            var post = await _context.Posts.FindAsync(likeDto.PostId);
            if (post == null)
            {
                Log.Warning("Post not found for PostId: {PostId}", likeDto.PostId);
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

                // Send a notification to RabbitMQ
                var publisher = new RabbitMQPublisher("localhost");
                var notificationMessage = $"Post \"{likeDto.PostTitle}\" by {likeDto.PostAuthor} was liked by {likeDto.LoggedInUserName}! 👍";
                publisher.PublishMessage("likeNotificationQueue", notificationMessage);

                return Ok(new { message = "Liked successfully." });
            }
        }
    }
}
