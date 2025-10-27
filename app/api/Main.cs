var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.MapGet("/api/health", () => Results.Ok(new { ok = true }));
app.MapGet("/api/todos", () =>
{
    var todos = new[] { new { id = 1, title = "ilk iş", done = false } };
    return Results.Ok(todos);
});

app.Run();
