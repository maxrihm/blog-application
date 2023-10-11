using BlogService.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Collections.Generic;

namespace BlogService.Data
{
    public class BlogServiceContext : DbContext
    {
        private IMemoryCache _cache;

        public BlogServiceContext(DbContextOptions<BlogServiceContext> options, IMemoryCache cache) : base(options)
        {
            _cache = cache;
        }

        public DbSet<Post> Posts { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Like> Likes { get; set; }
    }
}
