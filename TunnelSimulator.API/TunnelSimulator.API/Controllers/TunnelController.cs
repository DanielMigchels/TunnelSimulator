using TunnelSimulator.API.Services.Tunnel;
using TunnelSimulator.API.Services.Tunnel.Models;
using Microsoft.AspNetCore.Mvc;

namespace TunnelSimulator.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TunnelController(ITunnelService tunnelService) : ControllerBase
{
    [HttpGet]
    public IActionResult GetTunnelStatus()
    {
        var status = tunnelService.GetTunnelStatus();
        return Ok(status);
    }

    [HttpPost("{tunnelTube}/Calamity")]
    public IActionResult SetCalamity([FromRoute] int tunnelTube, [FromBody] TunnelSetCalamityRequestModel model)
    {
        tunnelService.SetCalamity(tunnelTube, model);
        return Ok();
    }
}
