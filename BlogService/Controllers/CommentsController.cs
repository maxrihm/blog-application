// BlogService/Controllers/CommentsController.cs

using BlogService.Data;
using BlogService.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace BlogService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly BlogServiceContext _context;

        public CommentsController(BlogServiceContext context)
        {
            _context = context;
        }

        // GET: api/Comments/{postId}
        [HttpGet("{postId}")]
        public IActionResult GetCommentsForPost(int postId)
        {
            var comments = _context.Comments
                .Where(c => c.PostId == postId)
                .OrderByDescending(c => c.DateCreated)
                .ToList();

            return Ok(comments);
        }

        // POST: api/Comments
        [HttpPost]
        public async Task<ActionResult<Comment>> CreateComment(Comment comment)
        {
            comment.DateCreated = DateTime.Now;
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return new CreatedAtRouteResult(new { id = comment.CommentId }, comment);
        }
    }
}
