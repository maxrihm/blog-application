using BlogService.Data;
using BlogService.Dto;
using BlogService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace BlogService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly BlogServiceContext _context;
        private MemoryCache _cache;

        public PostsController(BlogServiceContext context)
        {
            _context = context;
            _cache = new MemoryCache(new MemoryCacheOptions());
        }

        // Method to clear all caches
        private void InvalidateAllCaches()
        {
            _cache.Dispose();
            _cache = new MemoryCache(new MemoryCacheOptions());
        }

        // GET: api/Posts
        [HttpGet]
        public async Task<ActionResult<object>> GetPosts([FromQuery] int pageIndex = 0, [FromQuery] int pageSize = 10)
        {
            var totalPosts = await _context.Posts.CountAsync();
            var posts = await _context.Posts
                .OrderByDescending(p => p.DateCreated)
                .Skip(pageIndex * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var result = new
            {
                posts = posts,
                totalCount = totalPosts
            };

            return result;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PostDetailsDto>> GetPostDetails(int id, [FromQuery] int currentUserId)
        {
            var cacheKey = $"post_{id}_{currentUserId}";
            if (_cache.TryGetValue(cacheKey, out object cachedResult))
            {
                return cachedResult as PostDetailsDto;
            }

            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound();

            var isLikedByUser = await _context.Likes.AnyAsync(l => l.PostId == id && l.UserId == currentUserId);

            var postDto = new PostDetailsDto
            {
                PostId = post.PostId,
                UserId = post.UserId,
                UserName = post.UserName,
                Title = post.Title,
                Content = post.Content,
                DateCreated = post.DateCreated,
                TotalLikes = post.TotalLikes,
                IsLikedByUser = isLikedByUser
            };

            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromMinutes(10));

            _cache.Set(cacheKey, postDto, cacheOptions);

            return postDto;
        }

        // POST: api/Posts
        [HttpPost]
        public async Task<ActionResult<Post>> CreatePost(Post post)
        {
            post.DateCreated = DateTime.Now;
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            InvalidateAllCaches();

            return new CreatedAtRouteResult(new { id = post.PostId }, post);
        }

        // DELETE: api/Posts/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePost(int id, [FromQuery] int currentUserId, [FromQuery] string userRole)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                return NotFound();
            }
            if (post.UserId != currentUserId && userRole != "Admin")
            {
                return Forbid("You are not authorized to delete this post.");
            }

            // Remove all comments associated with the post
            _context.Comments.RemoveRange(_context.Comments.Where(c => c.PostId == id));

            // Remove all likes associated with the post
            _context.Likes.RemoveRange(_context.Likes.Where(l => l.PostId == id));

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            InvalidateAllCaches();

            return NoContent();
        }

        // ... other API endpoints ...
    }
}
