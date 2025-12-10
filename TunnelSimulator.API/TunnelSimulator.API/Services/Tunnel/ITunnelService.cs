using TunnelSimulator.API.Services.Tunnel.Models;

namespace TunnelSimulator.API.Services.Tunnel;

public interface ITunnelService
{
    TunnelStatusResponseModel GetTunnelStatus();
    Task SetCalamity(int tunnelTube, TunnelSetCalamityRequestModel model);
}
