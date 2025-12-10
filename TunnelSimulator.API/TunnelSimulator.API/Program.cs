using TunnelSimulator.API.Services.Cars;
using TunnelSimulator.API.Services.Tunnel;
using TunnelSimulator.API.Services.Websocket;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddTransient<ITunnelService, TunnelService>();
builder.Services.AddHostedService<CarsService>();
builder.Services.AddSingleton<TunnelWebSocketHandler>();

builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "wwwroot/tunnelsimulator.ui/browser/";
});

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "TunnelSimulator.API", Version = "v1" });
});

var app = builder.Build();

app.UseWebSockets();
var webSocketHandler = app.Services.GetRequiredService<TunnelWebSocketHandler>();

app.Map("/ws", async context =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        using var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        await webSocketHandler.HandleWebSocketAsync(webSocket);
    }
    else
    {
        context.Response.StatusCode = 400;
    }
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
app.UseSpaStaticFiles();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.UseSpa(spa =>
{
    if (app.Environment.IsDevelopment())
    {
        spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
    }
});

app.Run();
