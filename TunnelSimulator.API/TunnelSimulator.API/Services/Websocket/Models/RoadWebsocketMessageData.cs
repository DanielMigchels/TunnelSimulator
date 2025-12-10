using TunnelSimulator.API.Services.Cars.Model;

namespace TunnelSimulator.API.Services.Websocket.Models;

public class RoadWebsocketMessageData : WebsocketMessageData
{
    public List<RoadModel> RoadModels { get; set; } = [];
}
