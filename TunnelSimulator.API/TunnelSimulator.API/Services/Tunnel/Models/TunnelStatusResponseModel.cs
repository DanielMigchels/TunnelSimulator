namespace TunnelSimulator.API.Services.Tunnel.Models;

public class TunnelStatusResponseModel
{
    public List<TunnelTubeStatusResponseModel> Tubes { get; set; } = [];
}
