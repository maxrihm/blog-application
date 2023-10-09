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
        public IActionResult Login()
        {
            return Ok(new { Success = true, Username = User.Identity.Name });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserDto userDto)
        {
            if (await _context.Users.AnyAsync(x => x.Username == userDto.Username))
                return BadRequest("Username is already taken.");

            var user = new User
            {
                Username = userDto.Username,
                Password = userDto.Password  // Store the plain-text password
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "User registered successfully." });
        }
    }
}
