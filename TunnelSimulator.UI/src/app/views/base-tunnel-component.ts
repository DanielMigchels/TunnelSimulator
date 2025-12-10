import { ActivatedRoute } from "@angular/router";
import { TunnelService } from "../../services/tunnel/tunnel.service";
import { TunnelWebsocketService } from "../../services/websocket/tunnel-websocket.service";
import { TunnelStatusResponseModel } from "../../services/tunnel/models/tunnel-status-response-model";
import { World } from "../animation/objects/world";
import { TunnelScene } from "../animation/tunnel-scene";
import * as THREE from 'three';
import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { WebsocketMessage } from "../../services/websocket/models/websocket-message";
import { TunnelInterfaceComponent } from "./tunnel/tunnel-interface/tunnel-interface.component";
import { ModelLoaderService } from "../../services/3dmodels/model-loader.service";

@Component({
  selector: 'app-base-tunnel',
  template: ''
})
export abstract class BaseTunnelComponent implements OnInit, AfterViewInit {

  @ViewChild('interface') interfaceComponent?: TunnelInterfaceComponent;
  @ViewChildren('threeContainer') threeContainers!: QueryList<ElementRef>;

  tunnelScenes: TunnelScene[] = [];
  tunnelStatus!: TunnelStatusResponseModel;
  world!: World;
  sharedScene!: THREE.Scene;

  highQuality = true;

  cameraViews = [
    { cameraPositionX: 185, cameraPositionY: 5, cameraPositionZ: -13, lookPositionX: 400, lookPositionY: -30, lookPositionZ: 100 },
    { cameraPositionX: 180, cameraPositionY: 5, cameraPositionZ: -13, lookPositionX: 125, lookPositionY: -30, lookPositionZ: 30 },
    { cameraPositionX: 100, cameraPositionY: -2, cameraPositionZ: -3, lookPositionX: 300, lookPositionY: -30, lookPositionZ: -30 },
    { cameraPositionX: 95, cameraPositionY: -2, cameraPositionZ: -3, lookPositionX: -30, lookPositionY: -50, lookPositionZ: -50 },
    { cameraPositionX: -95, cameraPositionY: -2, cameraPositionZ: -3, lookPositionX: -30, lookPositionY: -50, lookPositionZ: -50 },
    { cameraPositionX: -100, cameraPositionY: -2, cameraPositionZ: -3, lookPositionX: -300, lookPositionY: -30, lookPositionZ: -30 },
    { cameraPositionX: -180, cameraPositionY: 5, cameraPositionZ: 13, lookPositionX: -125, lookPositionY: -30, lookPositionZ: -30 },
    { cameraPositionX: -185, cameraPositionY: 5, cameraPositionZ: 13, lookPositionX: -400, lookPositionY: -30, lookPositionZ: -100 },

    { cameraPositionX: -185, cameraPositionY: 5, cameraPositionZ: 13, lookPositionX: -400, lookPositionY: -30, lookPositionZ: -100 },
    { cameraPositionX: -180, cameraPositionY: 5, cameraPositionZ: 13, lookPositionX: -125, lookPositionY: -30, lookPositionZ: -30 },
    { cameraPositionX: -100, cameraPositionY: -2, cameraPositionZ: 3, lookPositionX: -300, lookPositionY: -30, lookPositionZ: 30 },
    { cameraPositionX: -95, cameraPositionY: -2, cameraPositionZ: 3, lookPositionX: 30, lookPositionY: -50, lookPositionZ: 50 },
    { cameraPositionX: 95, cameraPositionY: -2, cameraPositionZ: 3, lookPositionX: 30, lookPositionY: -50, lookPositionZ: 50 },
    { cameraPositionX: 100, cameraPositionY: -2, cameraPositionZ: 3, lookPositionX: 300, lookPositionY: -30, lookPositionZ: 30 },
    { cameraPositionX: 180, cameraPositionY: 5, cameraPositionZ: -13, lookPositionX: 125, lookPositionY: -30, lookPositionZ: 30 },
    { cameraPositionX: 185, cameraPositionY: 5, cameraPositionZ: -13, lookPositionX: 400, lookPositionY: -30, lookPositionZ: 100 },
  ];

  constructor(protected route: ActivatedRoute, protected tunnelService: TunnelService, protected tunnelWebsocketService: TunnelWebsocketService, protected modelLoaderService: ModelLoaderService) {
  }

  getTunnelStatus() {
    this.tunnelService.getTunnelStatus().subscribe((response) => {
      this.tunnelStatus = response;
      this.processTunnelStatus(this.tunnelStatus);
    });
  }

  setCameraPosition(x: number, y: number, z: number): void {
    this.tunnelScenes.forEach(tunnelScene => {
      tunnelScene.setCameraPosition(x, y, z);
    });
  }

  setLookAt(x: number, y: number, z: number): void {
    this.tunnelScenes.forEach(tunnelScene => {
      tunnelScene.setLookAt(x, y, z);
    });
  }

  processTunnelStatus(tunnelStatus: TunnelStatusResponseModel) {
    if (this.interfaceComponent) {
      this.interfaceComponent.tunnelStatus = tunnelStatus;
    }

    this.world.roads[0].isCalamity = tunnelStatus.tubes[0].isCalamity;
    this.world.roads[1].isCalamity = tunnelStatus.tubes[1].isCalamity;
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const highQualityParam = params.get('highquality');
      if (this.highQuality !== null) {
        this.highQuality = highQualityParam !== null ? highQualityParam !== 'false' : true;
      }
    });
  }

  ngAfterViewInit(): void {
    this.sharedScene = new THREE.Scene();
    this.world = new World(this.modelLoaderService, this.sharedScene, this.tunnelWebsocketService, this.highQuality);

    this.threeContainers.forEach((container, index) => {
      const tunnelScene = new TunnelScene(container, this.sharedScene, this.world, index);
      tunnelScene.initialize(this.highQuality);
      this.tunnelScenes.push(tunnelScene);
    });

    this.tunnelWebsocketService.getRoadStatusUpdates().subscribe((data) => {
      if (!this.tunnelStatus) {
        this.getTunnelStatus();
      }
    });

    this.tunnelWebsocketService.getTunnelStatusUpdates().subscribe((message: WebsocketMessage) => {
      this.getTunnelStatus();
    });
  }
}
