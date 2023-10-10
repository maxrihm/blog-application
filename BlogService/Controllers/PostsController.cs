using BlogService.Data;
using BlogService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
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
        public async Task<ActionResult<IEnumerable<Post>>> GetPosts()
        {
            return await _context.Posts.ToListAsync();
        }

        // GET: api/Posts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Post>> GetPost(int id)
        {
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
            {
                return NotFound();
            }

            return post;
        }

        // POST: api/Posts
        [HttpPost]
        public async Task<ActionResult<Post>> CreatePost(Post post)
        {
            post.DateCreated = DateTime.Now; // Set the DateCreated to current date and time
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPost", new { id = post.PostId }, post);
        }


        // ... other API endpoints ...
    }
}
