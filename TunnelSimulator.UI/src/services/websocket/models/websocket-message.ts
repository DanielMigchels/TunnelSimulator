import { WebsocketMessageData } from "./websocket-message-data";
import { WebsocketMessageType } from "./websocket-message-type";

export interface WebsocketMessage {
  Type: WebsocketMessageType;
  Data: WebsocketMessageData | undefined;
}
