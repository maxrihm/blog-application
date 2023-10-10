using RabbitMQ.Client;
using System.Text;

namespace BlogService
{

    public class RabbitMQPublisher
    {
        private readonly string _hostname;

        public RabbitMQPublisher(string hostname)
        {
            _hostname = hostname;
        }

        public void PublishMessage(string queueName, string message)
        {
            var factory = new ConnectionFactory() { HostName = _hostname };
            using var connection = factory.CreateConnection();
            using var channel = connection.CreateModel();

            channel.QueueDeclare(queue: queueName,
                                 durable: false,
                                 exclusive: false,
                                 autoDelete: false,
                                 arguments: null);

            var body = Encoding.UTF8.GetBytes(message);

            channel.BasicPublish(exchange: "",
                                 routingKey: queueName,
                                 basicProperties: null,
                                 body: body);
        }
    }

}
