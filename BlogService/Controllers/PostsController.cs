using BlogService.Data;
using BlogService.Dto;
using BlogService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BlogService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly BlogServiceContext _context;
        private readonly IMemoryCache _cache;

        public PostsController(BlogServiceContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }

        // ... other API endpoints ...

        // GET: api/Posts
        [HttpGet]
        public async Task<ActionResult<object>> GetPosts([FromQuery] int pageIndex = 0, [FromQuery] int pageSize = 10)
        {
            var cacheKey = $"posts_{pageIndex}_{pageSize}";
            if (_cache.TryGetValue(cacheKey, out object cachedResult))
            {
                return cachedResult;
            }

            var totalPosts = await _context.Posts.CountAsync();

            var posts = await _context.Posts
                .Skip(pageIndex * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var result = new
            {
                posts = posts,
                totalCount = totalPosts
            };

            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromMinutes(10));

            _cache.Set(cacheKey, result, cacheOptions);

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

            // Check if the post is liked by the current user
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
            post.DateCreated = DateTime.Now; // Set the DateCreated to current date and time
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            _cache.Remove("posts_0_10"); // Remove the cached result for the first page of posts

            return new CreatedAtRouteResult(new { id = post.PostId }, post);
        }

        // DELETE: api/Posts/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePost(int id, [FromQuery] int currentUserId)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                return NotFound();
            }

            // Check if the current user is the author of the post
            if (post.UserId != currentUserId)
            {
                return Forbid("You are not authorized to delete this post.");
            }

            // Delete associated likes
            var likesToDelete = _context.Likes.Where(l => l.PostId == id);
            _context.Likes.RemoveRange(likesToDelete);

            // Delete the post
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            // Invalidate caches
            _cache.Remove($"post_{id}_{currentUserId}"); // Clear cache for the specific post details
            _cache.Remove("posts_0_10"); // Clear cache for the first page of post listings. Consider invalidating all pages.

            return NoContent();
        }
        // ... other API endpoints ...
    }
}
