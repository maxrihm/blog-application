using Microsoft.AspNetCore.SignalR;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Add SignalR service
builder.Services.AddSignalR();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Inject ILogger into your application's scope
var logger = app.Services.GetRequiredService<ILogger<Program>>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Add CORS configuration
app.UseCors(builder => 
    builder.WithOrigins("http://localhost:3000")  // Replace with your React app's URL
           .AllowAnyMethod()
           .AllowAnyHeader()
           .AllowCredentials());

app.UseAuthorization();

// Map the SignalR hub
app.MapHub<NotificationHub>("/notificationHub");

app.MapControllers();

// RabbitMQ Listener
var factory = new ConnectionFactory() { HostName = "localhost" };
using var connection = factory.CreateConnection();
using var channel = connection.CreateModel();

channel.QueueDeclare(queue: "likeNotificationQueue",
                     durable: false,
                     exclusive: false,
                     autoDelete: false,
                     arguments: null);

var consumer = new EventingBasicConsumer(channel);
consumer.Received += (model, ea) =>
{
    var body = ea.Body.ToArray();
    var message = Encoding.UTF8.GetString(body);

    // Log the received message from RabbitMQ
    logger.LogInformation($"Received message from RabbitMQ: {message}");

    var hubContext = app.Services.GetService<IHubContext<NotificationHub>>();
    hubContext.Clients.All.SendAsync("ReceiveMessage", "Server", message);
};

channel.BasicConsume(queue: "likeNotificationQueue",
                     autoAck: true,
                     consumer: consumer);

// Log that the app is starting RabbitMQ consumer
logger.LogInformation("Starting RabbitMQ consumer...");

app.Run();

public class NotificationHub : Hub
{
    public async Task SendMessage(string user, string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
}
