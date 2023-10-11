using BlogService.Data;
using BlogService.Dto;
using BlogService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        public PostsController(BlogServiceContext context)
        {
            _context = context;
        }

        // ... other API endpoints ...

        // GET: api/Posts
        [HttpGet]
        public async Task<ActionResult<object>> GetPosts([FromQuery] int pageIndex = 0, [FromQuery] int pageSize = 10)
        {
            var totalPosts = await _context.Posts.CountAsync();

            var posts = await _context.Posts
                .Skip(pageIndex * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new 
            {
                posts = posts,
                totalCount = totalPosts
            };
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PostDetailsDto>> GetPostDetails(int id, [FromQuery] int currentUserId)
        {
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

            return postDto;
        }

        // POST: api/Posts
        [HttpPost]
        public async Task<ActionResult<Post>> CreatePost(Post post)
        {
            post.DateCreated = DateTime.Now; // Set the DateCreated to current date and time
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return new CreatedAtRouteResult(new { id = post.PostId }, post);
        }

        // ... other API endpoints ...
    }
}
