﻿using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using UserService.Data;
using UserService.Models;

public class BasicAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    private readonly ApplicationDbContext _context;
    private readonly MongoDbContext _mongoDbContext;

    public BasicAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock,
        ApplicationDbContext context,
        MongoDbContext mongoDbContext)
        : base(options, logger, encoder, clock)
    {
        _context = context;
        _mongoDbContext = mongoDbContext;
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.ContainsKey("Authorization"))
        {
            _mongoDbContext.Logs.InsertOne(new Log { Message = "Authorization header was not found during login attempt.", Date = DateTime.UtcNow });
            return AuthenticateResult.Fail("Authorization header was not found.");
        }

        try
        {
            var authenticationHeaderValue = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]);
            var bytes = Convert.FromBase64String(authenticationHeaderValue.Parameter);
            string[] credentials = Encoding.UTF8.GetString(bytes).Split(":");
            var username = credentials[0];
            var password = credentials[1];

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
            {
                _mongoDbContext.Logs.InsertOne(new Log { Message = $"Invalid login attempt for username {username}.", Date = DateTime.UtcNow });
                return AuthenticateResult.Fail("Invalid username.");
            }

            if (password != user.Password)
            {
                _mongoDbContext.Logs.InsertOne(new Log { Message = $"Invalid password attempt for username {username}.", Date = DateTime.UtcNow });
                return AuthenticateResult.Fail("Invalid password.");
            }

            _mongoDbContext.Logs.InsertOne(new Log { Message = $"Successful login for username {username}.", Date = DateTime.UtcNow });

            var claims = new[] { new Claim(ClaimTypes.Name, user.Username) };
            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);

            return AuthenticateResult.Success(ticket);
        }
        catch
        {
            _mongoDbContext.Logs.InsertOne(new Log { Message = "Error has occurred during login attempt.", Date = DateTime.UtcNow });
            return AuthenticateResult.Fail("Error has occurred.");
        }
    }
}
