using BlogService.Data;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.MSSqlServer;

var builder = WebApplication.CreateBuilder(args);

// Before your application starts:
var connectionString = builder.Configuration.GetConnectionString("BlogServiceDatabase");

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration) // Read settings from appsettings.json
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.MSSqlServer(
        connectionString: connectionString,
        tableName: "Logs",
        autoCreateSqlTable: true) // This will auto-create the logs table if it doesn't exist
    .CreateLogger();

builder.Host.UseSerilog(); // <-- Add this line

try
{
    Log.Information("Starting the application");

    // Add services to the container.
    builder.Services.AddControllers();

    // Add DbContext to the DI container.
    builder.Services.AddDbContext<BlogServiceContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("BlogServiceDatabase")));

    // Add CORS policy to allow requests from http://localhost:3000
    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(builder =>
        {
            builder.WithOrigins("http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
    });

    // Add memory cache service to the DI container.
    builder.Services.AddMemoryCache();

    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    var app = builder.Build();

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();

    app.UseAuthorization();

    app.UseCors();

    app.UseSerilogRequestLogging(); // This logs incoming HTTP requests.

    app.MapControllers();

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application start-up failed");
}
finally
{
    Log.CloseAndFlush();
}
