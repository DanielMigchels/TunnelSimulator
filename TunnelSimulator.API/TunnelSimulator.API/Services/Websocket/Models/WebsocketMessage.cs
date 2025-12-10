namespace TunnelSimulator.API.Services.Websocket.Models;

public class WebsocketMessage
{
    public WebsocketMessageType Type { get; set; }
    public WebsocketMessageData? Data { get; set; }
}
