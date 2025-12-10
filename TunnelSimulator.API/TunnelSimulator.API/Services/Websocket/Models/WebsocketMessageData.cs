using TunnelSimulator.API.Services.Websocket.Models;
using System.Text.Json.Serialization;


[JsonDerivedType(typeof(RoadWebsocketMessageData), typeDiscriminator: "roadModel")]

public class WebsocketMessageData
{
}
