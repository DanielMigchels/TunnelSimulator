using TunnelSimulator.API.Services.Tunnel.Models;
using TunnelSimulator.API.Services.Websocket;

namespace TunnelSimulator.API.Services.Tunnel;

public class TunnelService(TunnelWebSocketHandler tunnelWebSocketHandler) : ITunnelService
{
    public static TunnelStatusResponseModel TunnelStatus = new TunnelStatusResponseModel()
    {
        Tubes =
        [
            new TunnelTubeStatusResponseModel()
            {
                IsCalamity = false,
            },
            new TunnelTubeStatusResponseModel()
            {
                IsCalamity = false,
            }
        ]
    };

    public TunnelStatusResponseModel GetTunnelStatus()
    {
        return TunnelStatus;
    }

    public async Task SetCalamity(int tunnelTube, TunnelSetCalamityRequestModel model)
    {
        TunnelStatus.Tubes[tunnelTube].IsCalamity = model.IsCalamity;
        await tunnelWebSocketHandler.TunnelStatusUpdated();
    }
}
