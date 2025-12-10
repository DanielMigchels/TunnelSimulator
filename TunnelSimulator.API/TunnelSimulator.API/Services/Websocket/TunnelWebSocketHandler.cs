using TunnelSimulator.API.Services.Websocket.Models;

namespace TunnelSimulator.API.Services.Websocket;

public class TunnelWebSocketHandler : WebsocketHandler
{
    public override Task ProcessIncomingMessage(WebsocketMessage message)
    {
        // We don't do anything with incoming messages. I encourage just using the REST interface. We have no authentication here.
        return Task.CompletedTask;
    }

    public async Task TunnelStatusUpdated()
    {
        var message = new WebsocketMessage()
        {
            Type = WebsocketMessageType.TunnelStatusUpdated
        };
        await SendMessageToAllAsync(message);
    }
}
