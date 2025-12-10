namespace TunnelSimulator.API.Services.Cars.Model;

public class CarModel
{
    public int Id { get; set; }
    public string Color { get; set; } = string.Empty;
    public double Position { get; set; }
    public double Speed { get; set; }
    public double InitialSpeed { get; set; }
    public int Lane { get; set; }
}
