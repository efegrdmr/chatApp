using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Api.Data;

public sealed class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public static string BuildConnectionString(IConfiguration configuration)
    {
        var host = configuration["DB_HOST"];
        var port = configuration["DB_PORT"];
        var database = configuration["DB_NAME"];
        var username = configuration["DB_USER"];
        var password = configuration["DB_PASSWORD"];

        if (string.IsNullOrWhiteSpace(host) ||
            string.IsNullOrWhiteSpace(port) ||
            string.IsNullOrWhiteSpace(database) ||
            string.IsNullOrWhiteSpace(username) ||
            string.IsNullOrWhiteSpace(password))
        {
            throw new InvalidOperationException(
                "Database configuration is missing. Ensure DB_HOST, DB_PORT, DB_NAME, DB_USER, and DB_PASSWORD are set.");
        }

        return $"Host={host};Port={port};Database={database};Username={username};Password={password}";
    }

    public AppDbContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseNpgsql(BuildConnectionString(configuration))
            .Options;

        return new AppDbContext(options);
    }
}
