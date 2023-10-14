using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Threading.Tasks;


public class RateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private IMemoryCache _cache;

    public RateLimitingMiddleware(RequestDelegate next, IMemoryCache cache)
    {
        _next = next;
        _cache = cache;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Bypass rate limiting for OPTIONS requests
        if (context.Request.Method == "OPTIONS")
        {
            await _next(context);
            return;
        }

        if (context.Request.Path.StartsWithSegments("/auth/login"))
        {
            var ipAddress = context.Connection.RemoteIpAddress.ToString();

            if (_cache.TryGetValue(ipAddress, out DateTime lastAttempt))
            {
                if (lastAttempt.AddSeconds(10) > DateTime.UtcNow)
                {
                    context.Response.StatusCode = (int)System.Net.HttpStatusCode.TooManyRequests;
                    await context.Response.WriteAsJsonAsync(new { error = "Too many login attempts. Please wait." });
                    return;
                }
            }
            _cache.Set(ipAddress, DateTime.UtcNow, TimeSpan.FromSeconds(30));
        }
        await _next(context);
    }
}
