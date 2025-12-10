import { Component, ViewChild } from '@angular/core';
import { TunnelService } from '../../../services/tunnel/tunnel.service';
import { TunnelWebsocketService } from '../../../services/websocket/tunnel-websocket.service';
import { NgIconComponent } from '@ng-icons/core';
import { TunnelInterfaceComponent } from './tunnel-interface/tunnel-interface.component';
import { NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BaseTunnelComponent } from '../base-tunnel-component';
import { ModelLoaderService } from '../../../services/3dmodels/model-loader.service';

@Component({
  selector: 'app-tunnel',
  imports: [NgClass, NgIconComponent, TunnelInterfaceComponent],
  templateUrl: './tunnel.component.html',
  styleUrl: './tunnel.component.scss'
})
export class TunnelComponent extends BaseTunnelComponent {
  controlsToggled: boolean = false;

  constructor(route: ActivatedRoute, tunnelService: TunnelService, tunnelWebsocketService: TunnelWebsocketService, modelLoaderService: ModelLoaderService) {
    super(route, tunnelService, tunnelWebsocketService, modelLoaderService);
  }

  setCameraLookPosition(cameraPosition: { cameraPositionX: number, cameraPositionY: number, cameraPositionZ: number, lookPositionX: number, lookPositionY: number, lookPositionZ: number }) {
    this.setCameraPosition(cameraPosition.cameraPositionX, cameraPosition.cameraPositionY, cameraPosition.cameraPositionZ);
    this.setLookAt(cameraPosition.lookPositionX, cameraPosition.lookPositionY, cameraPosition.lookPositionZ);
  }
}
