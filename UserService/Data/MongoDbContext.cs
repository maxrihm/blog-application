using MongoDB.Bson;
using MongoDB.Driver;

namespace UserService.Data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database = null;

        public MongoDbContext(string connectionString, string dbName)
        {
            var client = new MongoClient(connectionString);
            if (client != null)
                _database = client.GetDatabase(dbName);
        }

        public IMongoCollection<Log> Logs => _database.GetCollection<Log>("Logs");
    }

    public class Log
    {
        public ObjectId Id { get; set; }
        public string Message { get; set; }
        public DateTime Date { get; set; }
    }
}
