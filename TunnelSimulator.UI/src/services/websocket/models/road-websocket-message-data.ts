import { RoadModel } from "./road/road-model";
import { WebsocketMessageData } from "./websocket-message-data";

export interface RoadWebsocketMessageData extends WebsocketMessageData {
  RoadModels: RoadModel[];
}
