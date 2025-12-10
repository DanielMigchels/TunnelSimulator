import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebsocketMessage } from './models/websocket-message';
import { WebsocketMessageType } from './models/websocket-message-type';
import { WebsocketMessageData } from './models/websocket-message-data';

@Injectable({
  providedIn: 'root'
})
export class TunnelWebsocketService {
  
  private socket: WebSocket | null = null;
  private messageSubject = new Subject<WebsocketMessage>();
  private tunnelStatusUpdatedSubject = new Subject<WebsocketMessageData | undefined>();
  private roadStatusUpdatedSubject = new Subject<WebsocketMessageData | undefined>();

  constructor() {
    this.connect();
  }

  private connect() {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      const isSecure = window.location.protocol === "https:";
      const wsProtocol = isSecure ? "wss" : "ws";

      const wsUrl = `${wsProtocol}://${window.location.host}/ws`;
      console.log('Connecting to WebSocket:', wsUrl);
      this.socket = new WebSocket(wsUrl);
  
      this.socket.onopen = () => console.log('WebSocket connected to', wsUrl);
      this.socket.onmessage = (event) => this.handleMessage(event.data);
      this.socket.onclose = () => {
        console.log('WebSocket disconnected, refreshing webpage...');
        window.location.reload();
      };
      this.socket.onerror = (error) => console.error('WebSocket error:', error);
    }
  } 
  
  private handleMessage(json: string) {
    try {
      const message: WebsocketMessage = JSON.parse(json);
      this.messageSubject.next(message);

      switch (message.Type) {
        case WebsocketMessageType.TunnelStatusUpdated:
          this.tunnelStatusUpdatedSubject.next(message.Data);
          break;
          case WebsocketMessageType.RoadStatusUpdated:
            this.roadStatusUpdatedSubject.next(message.Data);
            break;
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  sendMessage(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket is not connected.');
    }
  }

  getMessages(): Observable<WebsocketMessage> {
    return this.messageSubject.asObservable();
  }

  getTunnelStatusUpdates(): Observable<any> {
    return this.tunnelStatusUpdatedSubject.asObservable();
  }

  getRoadStatusUpdates(): Observable<any> {
    return this.roadStatusUpdatedSubject.asObservable();
  }
}
