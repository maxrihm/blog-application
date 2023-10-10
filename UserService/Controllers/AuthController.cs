using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using UserService.Models;
using UserService.Dto;
using UserService.Data;

namespace UserService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
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
                return NotFound(new { Success = false, Message = "User not found." });
            }

            return Ok(new
            {
                Success = true,
                Username = user.Username,
                Role = user.Role?.Name  // Send the role name
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserDto userDto)
        {
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

                return Ok(new { Success = true, Message = "User registered successfully." });

            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }
    }
}
