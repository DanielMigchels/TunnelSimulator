using TunnelSimulator.API.Services.Websocket.Models;
using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Text.Json;
using System.Text;

namespace TunnelSimulator.API.Services.Websocket;

public abstract class WebsocketHandler : IWebsocketHandler
{
    private readonly ConcurrentDictionary<Guid, WebSocket> sockets = new();

    public async Task HandleWebSocketAsync(WebSocket webSocket)
    {
        var socketId = Guid.NewGuid();
        sockets.TryAdd(socketId, webSocket);

        var buffer = new byte[1024 * 4];

        try
        {
            while (webSocket.State == WebSocketState.Open)
            {
                var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                if (result.MessageType == WebSocketMessageType.Text)
                {
                    var json = Encoding.UTF8.GetString(buffer, 0, result.Count);
                    var message = JsonSerializer.Deserialize<WebsocketMessage>(json);
                    if (message != null)
                    {
                        await ProcessIncomingMessage(message);
                    }

                }

                if (result.MessageType == WebSocketMessageType.Close)
                {
                    break;
                }
            }
        }
        finally
        {
            sockets.TryRemove(socketId, out _);
            await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed", CancellationToken.None);
        }
    }

    public async Task SendMessageToAllAsync(WebsocketMessage message)
    {
        var json = JsonSerializer.Serialize(message);

        var bytes = Encoding.UTF8.GetBytes(json);
        var tasks = sockets.Values
            .Where(socket => socket.State == WebSocketState.Open)
            .Select(socket => socket.SendAsync(new ArraySegment<byte>(bytes), WebSocketMessageType.Text, true, CancellationToken.None));

        await Task.WhenAll(tasks);
    }

    public abstract Task ProcessIncomingMessage(WebsocketMessage message);
}
