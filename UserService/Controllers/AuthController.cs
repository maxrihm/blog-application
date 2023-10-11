using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using System;
using System.Linq;
using System.Threading.Tasks;
using UserService.Data;
using UserService.Dto;
using UserService.Models;

namespace UserService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly MongoDbContext _mongoDbContext;

        public AuthController(ApplicationDbContext context, MongoDbContext mongoDbContext)
        {
            _context = context;
            _mongoDbContext = mongoDbContext;
        }

        [HttpGet("login")]
        [Authorize]
        public async Task<IActionResult> Login()
        {
            var user = await _context.Users
                .Include(u => u.Role)  // Include the Role navigation property
                .FirstOrDefaultAsync(u => u.Username == User.Identity.Name);

            if (user == null)
            {
                _mongoDbContext.Logs.InsertOne(new Log { Message = $"Login failed for username {User.Identity.Name}. User not found.", Date = DateTime.UtcNow }); // Logging failed login
                return NotFound(new { Success = false, Message = "User not found." });
            }

            // Logging successful login
            _mongoDbContext.Logs.InsertOne(new Log { Message = $"User {user.Username} logged in.", Date = DateTime.UtcNow });

            return Ok(new
            {
                Success = true,
                UserId = user.UserId,  // Send the UserId
                Username = user.Username,
                Role = user.Role?.Name  // Send the role name
            });
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserDto userDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Success = false, Message = "Validation failed.", Errors = ModelState.Values.SelectMany(v => v.Errors) });
            }

            try
            {
                if (await _context.Users.AnyAsync(x => x.Username == userDto.Username))
                    return BadRequest(new { Success = false, Message = "Username is already taken." });

                var user = new User
                {
                    Username = userDto.Username,
                    Password = userDto.Password  // Store the plain-text password
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Log the user registration in MongoDB
                _mongoDbContext.Logs.InsertOne(new Log { Message = $"User {userDto.Username} registered.", Date = DateTime.UtcNow });

                return Ok(new { Success = true, Message = "User registered successfully." });

            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}
