using BlogService.Controllers;
using BlogService.Data;
using BlogService.Dto;
using BlogService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace BlogService.Tests
{
    /// <summary>
    /// Provides a fixture for testing controllers.
    /// </summary>
    public class ControllerTestFixture
    {
        /// <summary>
        /// Gets the mock context for the controller.
        /// </summary>
        public BlogServiceContext MockContext { get; private set; }
        
        /// <summary>
        /// Initializes a new instance of the ControllerTestFixture class.
        /// Creates an in-memory database context for testing.
        /// </summary>
        public ControllerTestFixture()
        {
            var options = new DbContextOptionsBuilder<BlogServiceContext>()
                .UseInMemoryDatabase(databaseName: "BlogServiceTestDb")
                .Options;
            MockContext = new BlogServiceContext(options, new Mock<Microsoft.Extensions.Caching.Memory.IMemoryCache>().Object);
        }
    }

    public class CommentsControllerTests : IClassFixture<ControllerTestFixture>
    {
        private BlogServiceContext _context;

        public CommentsControllerTests(ControllerTestFixture fixture)
        {
            _context = fixture.MockContext;
        }

        /// <summary>
        /// Tests if the GetCommentsForPost method returns comments for a given post.
        /// </summary>
        [Fact]
        public void GetCommentsForPost_ShouldReturnComments()
        {
            var controller = new CommentsController(_context);
            var postId = 1; // Use any valid post ID
            var result = controller.GetCommentsForPost(postId);
            Assert.NotNull(result);
            // Add more assertions as needed...
        }

        /// <summary>
        /// Tests if the GetCommentsForPost method returns an empty list when there are no comments for a given post.
        /// </summary>
        [Fact]
        public void GetCommentsForPost_ShouldReturnEmptyList_WhenNoCommentsExist()
        {
            var controller = new CommentsController(_context);
            var postId = 99; // Use a post ID which doesn't have any comments
            var actionResult = controller.GetCommentsForPost(postId);
            var result = actionResult as OkObjectResult;
            var comments = result?.Value as IEnumerable<Comment>;
            Assert.Empty(comments);
        }
    }

    public class LikesControllerTests : IClassFixture<ControllerTestFixture>
    {
        private BlogServiceContext _context;

        public LikesControllerTests(ControllerTestFixture fixture)
        {
            _context = fixture.MockContext;
        }

        /// <summary>
        /// Tests if the ToggleLike method functions correctly and returns an appropriate response when a like action is performed.
        /// </summary>
        [Fact]
        public async Task ToggleLike_ShouldReturnLikedSuccessfully()
        {
            var controller = new LikesController(_context);
            var likeDto = new LikeDto 
            { 
                PostId = 1, 
                UserId = 1, 
                PostTitle = "Sample", 
                PostAuthor = "TestUser", 
                LoggedInUserName = "TestUser2" 
            };
            var result = await controller.ToggleLike(likeDto);
            Assert.NotNull(result);
            // Add more assertions as needed...
        }
    }

    public class PostsControllerTests : IClassFixture<ControllerTestFixture>
    {
        private BlogServiceContext _context;

        public PostsControllerTests(ControllerTestFixture fixture)
        {
            _context = fixture.MockContext;
        }

        /// <summary>
        /// Tests if the GetPosts method retrieves posts successfully.
        /// </summary>
        [Fact]
        public async Task GetPosts_ShouldReturnPosts()
        {
            var controller = new PostsController(_context);
            var result = await controller.GetPosts();
            Assert.NotNull(result);
            // Add more assertions as needed...
        }
    }
}