import { CarModel } from "./car-model";
import { RoadDirection } from "./road-direction";

export interface RoadModel {
  Id: number;
  CarModels: CarModel[];
  Direction: RoadDirection;
  Offset: number;
}
