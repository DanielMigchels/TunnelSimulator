import * as THREE from 'three';
import { Skybox } from './skybox';
import { Road } from './road';
import { Forest } from './forest';
import { TunnelWebsocketService } from '../../../services/websocket/tunnel-websocket.service';
import { RoadWebsocketMessageData } from '../../../services/websocket/models/road-websocket-message-data';
import { ModelLoaderService } from '../../../services/3dmodels/model-loader.service';

export class World {

  private scene!: THREE.Scene;
  public roads: Road[] = [];
  public planeCreated = false;  
  
  constructor(private modelLoaderService: ModelLoaderService, scene: THREE.Scene, private tunnelWebsocketService: TunnelWebsocketService, highQuality: boolean = true) {
    this.scene = scene;
    
    this.addLight();

    new Skybox(this.scene);

    tunnelWebsocketService.getRoadStatusUpdates().subscribe((data) => {
      var roadWebsocketMessageData = data as RoadWebsocketMessageData;
      this.processRoadData(roadWebsocketMessageData);
      if (!this.planeCreated) {
        this.createPlane();
        this.planeCreated = true;
      }
    });

    if (highQuality) {
      new Forest(this.scene, this.modelLoaderService);
    }    
  }

  processRoadData(roadWebsocketMessageData: RoadWebsocketMessageData) {
    for (var road of roadWebsocketMessageData.RoadModels) {
      if (!this.roads[road.Id]) {
        this.roads[road.Id] = new Road(this.modelLoaderService, this.scene, road.Offset, road.Direction, road.CarModels);
      }
      else {
        this.roads[road.Id].updateCars(road.CarModels);
      }
    }
  }

  addLight() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(400, 400, 400);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 512;
    directionalLight.shadow.mapSize.height = 512;
    directionalLight.shadow.camera.near = 4;
    directionalLight.shadow.camera.far = 1200;
    directionalLight.shadow.camera.left = -400;
    directionalLight.shadow.camera.right = 400;
    directionalLight.shadow.camera.top = 400;
    directionalLight.shadow.camera.bottom = -400;
    directionalLight.shadow.bias = -0.003;
    this.scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-400, 400, -400);
    this.scene.add(directionalLight2);
  }

  createPlane() {
    const planeShape = new THREE.Shape();
    planeShape.moveTo(400, 400);
    planeShape.lineTo(400, -400);
    planeShape.lineTo(-400, -400);
    planeShape.lineTo(-400, 400);
    planeShape.lineTo(400, 400); // Close the shape

    for(const road of this.roads) {
      const hole1 = new THREE.Path();
      hole1.moveTo(-160, -5 - road.offset);
      hole1.lineTo(-160, -5- road.offset);
      hole1.lineTo(-160, 5 - road.offset);
      hole1.lineTo(-130, 5 - road.offset);
      hole1.lineTo(-130, -5 - road.offset);
      planeShape.holes.push(hole1);
  
      const hole2 = new THREE.Path();
      hole2.moveTo(160, -5 - road.offset);
      hole2.lineTo(160, -5 - road.offset);
      hole2.lineTo(160, 5 - road.offset);
      hole2.lineTo(130, 5 - road.offset);
      hole2.lineTo(130, -5 - road.offset);
      planeShape.holes.push(hole2);
    }
    
    const geometry = new THREE.ShapeGeometry(planeShape);

    const textureLoader = new THREE.TextureLoader();
    const grassTexture = textureLoader.load('/assets/grass.png');
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(0.1, 0.1);

    const material = new THREE.MeshStandardMaterial({ map: grassTexture, side: THREE.FrontSide });
    const plane = new THREE.Mesh(geometry, material);
    plane.castShadow = true;
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.1;
    plane.receiveShadow = true;
    plane.castShadow = true;

    this.scene.add(plane);

    this.addWater();
  }

  addWater() {
    const textureLoader = new THREE.TextureLoader();
    const waterTexture = textureLoader.load('/assets/water.jpg');
    waterTexture.wrapS = THREE.RepeatWrapping;
    waterTexture.wrapT = THREE.RepeatWrapping;
    waterTexture.repeat.set(4, 40);

    const waterGeometry = new THREE.PlaneGeometry(150, 800, 1, 1);
    const waterMaterial = new THREE.MeshStandardMaterial({ map: waterTexture, side: THREE.FrontSide });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.receiveShadow = true;
    water.castShadow = true;
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0;
    this.scene.add(water);
  }

  animate(deltaTime: number) {
    for (var road of this.roads) {
      road.animate(deltaTime);
    }
  }
}

