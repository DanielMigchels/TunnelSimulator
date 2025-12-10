using TunnelSimulator.API.Services.Websocket.Models;

namespace TunnelSimulator.API.Services.Cars.Model;

public class RoadModel
{
    public int Id { get; set; }
    public RoadDirection Direction { get; set; } = RoadDirection.Forward;
    public double Offset { get; set; }
    public List<CarModel> CarModels { get; set; } = [];
}
