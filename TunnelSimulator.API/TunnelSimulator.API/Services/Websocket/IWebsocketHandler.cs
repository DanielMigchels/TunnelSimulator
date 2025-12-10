using TunnelSimulator.API.Services.Websocket.Models;
using System.Net.WebSockets;

namespace TunnelSimulator.API.Services.Websocket;

public interface IWebsocketHandler
{
    public Task HandleWebSocketAsync(WebSocket webSocket);
    public Task SendMessageToAllAsync(WebsocketMessage message);
    public abstract Task ProcessIncomingMessage(WebsocketMessage message);
}
