using BlogService.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace BlogService.Data
{
    public class BlogServiceContext : DbContext
    {
        public BlogServiceContext(DbContextOptions<BlogServiceContext> options) : base(options)
        {
        }

        public DbSet<BlogPost> BlogPosts { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Like> Likes { get; set; }
    }
}
