using TunnelSimulator.API.Services.Cars.Model;
using TunnelSimulator.API.Services.Tunnel;
using TunnelSimulator.API.Services.Websocket;
using TunnelSimulator.API.Services.Websocket.Models;

namespace TunnelSimulator.API.Services.Cars;

public class CarsService(TunnelWebSocketHandler tunnelWebSocketHandler, ITunnelService tunnelService) : ICarsService
{
    public int websocketRefreshRate = 1; // Actually important for the cars stopping when calamity.
    public List<RoadModel> Roads = [];
    private System.Threading.Timer timer;

    private CancellationToken cancellationToken { get; set; }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        this.cancellationToken = cancellationToken;
        var random = new Random();

        var colors = new List<string> { "#ffffff", "#888888", "#ff8888", "#88ff88", "#8888ff", "#ffff88", "#88ffff", "#ff88ff" };

        var roadBackward = new RoadModel()
        {
            Id = 0,
            Direction = RoadDirection.Backward,
            Offset = -6.5,
        };

        for (var i = -395; i < 395; i += random.Next(30, 80))
        {
            roadBackward.CarModels.Add(new CarModel()
            {
                Id = roadBackward.CarModels.Count(x => x.Lane == 0),
                Color = colors[random.Next(0, 7)],
                Position = i,
                Speed = -4,
                InitialSpeed = -4,
                Lane = 0
            });
        }

        for (var i = -395; i < 395; i += random.Next(30, 80))
        {
            roadBackward.CarModels.Add(new CarModel()
            {
                Id = roadBackward.CarModels.Count(x => x.Lane == 1),
                Color = colors[random.Next(0, 7)],
                Position = i,
                Speed = -5,
                InitialSpeed = -5,
                Lane = 1
            });
        }

        Roads.Add(roadBackward);

        var roadForward = new RoadModel()
        {
            Id = 1,
            Direction = RoadDirection.Forward,
            Offset = 6.5,
        };

        for (var i = -390; i < 390; i += random.Next(30, 80))
        {
            roadForward.CarModels.Add(new CarModel()
            {
                Id = roadForward.CarModels.Count(x => x.Lane == 0),
                Color = colors[random.Next(0, 7)],
                Position = i,
                Speed = 4,
                InitialSpeed = 4,
                Lane = 0
            });
        }

        for (var i = -390; i < 390; i += random.Next(30, 80))
        {
            roadForward.CarModels.Add(new CarModel()
            {
                Id = roadForward.CarModels.Count(x => x.Lane == 1),
                Color = colors[random.Next(0, 7)],
                Position = i,
                Speed = 5,
                InitialSpeed = 5,
                Lane = 1
            });
        }

        Roads.Add(roadForward);

        timer = new System.Threading.Timer(ProcessRoadsCallback, null, TimeSpan.Zero, TimeSpan.FromMilliseconds(250 * websocketRefreshRate));
    }

    private void ProcessRoadsCallback(object state)
    {
        ProcessRoads().GetAwaiter().GetResult();
    }

    public async Task ProcessRoads()
    {
        foreach (var road in Roads)
        {
            foreach (var car in road.CarModels)
            {
                var tunnelStatus = tunnelService.GetTunnelStatus();

                car.Position += car.Speed * websocketRefreshRate;

                CarModel? carInFront = null;
                if (car.InitialSpeed > 0)
                {
                    carInFront = road.CarModels
                        .Where(c => c.Position > car.Position && c.Lane == car.Lane)
                        .OrderBy(c => c.Position)
                        .FirstOrDefault();
                }
                else if (car.InitialSpeed < 0)
                {
                    carInFront = road.CarModels
                        .Where(c => c.Position < car.Position && c.Lane == car.Lane)
                        .OrderByDescending(c => c.Position)
                        .FirstOrDefault();
                }

                if (carInFront != null && Math.Abs(carInFront.Position - car.Position) < 13)
                {
                    car.Speed = carInFront.Speed;
                }
                else
                {
                    car.Speed = car.InitialSpeed;
                }

                if (tunnelStatus.Tubes[road.Id].IsCalamity)
                {
                    if ((car.InitialSpeed > 0 && car.Position > -173 && car.Position < -167) ||
                        (car.InitialSpeed < 0 && car.Position < 173 && car.Position > 167))
                    {
                        car.Speed = 0;
                        car.Position = car.InitialSpeed > 0 ? -169 : 169;
                    }
                }
                else
                {
                    car.Speed = car.InitialSpeed;
                }

                if (car.Speed > 0 && car.Position > 390)
                {
                    car.Position = -390;
                }
                else if (car.Speed < 0 && car.Position < -390)
                {
                    car.Position = 390;
                }
            }
        }

        await tunnelWebSocketHandler.SendMessageToAllAsync(new WebsocketMessage()
        {
            Type = WebsocketMessageType.RoadStatusUpdated,
            Data = new RoadWebsocketMessageData()
            {
                RoadModels = new List<RoadModel>(Roads)
            }
        });
    }

    public async Task StopAsync(CancellationToken cancellationToken)
    {
        timer?.Change(Timeout.Infinite, 0);
        await Task.CompletedTask;
    }
}
