import * as THREE from 'three';
import { Texture } from 'three';
import { Jeep } from './cars/jeep';
import { Matrixboard } from './matrixboard';
import { Barrier } from './barrier';
import { RoadDirection } from '../../../services/websocket/models/road/road-direction';
import { Car } from './car';
import { CarModel } from '../../../services/websocket/models/road/car-model';
import { ModelLoaderService } from '../../../services/3dmodels/model-loader.service';

export class Road {
  public offset: number = 0;

  private scene!: THREE.Scene;
  private concreteTexture!: Texture;
  private concreteTexture2!: Texture;
  private asphaltTexture!: Texture;
  private asphaltTexture2!: Texture;
  private carsLane1: Car[] = [];
  private carsLane2: Car[] = [];

  private _isCalamity = false;
  private stopCars = false;
  barriers: Barrier;

  public get isCalamity(): boolean {
    return this._isCalamity;
  }

  public set isCalamity(value: boolean) {
    this._isCalamity = value;
    
    if (!this._isCalamity) {
      this.barriers.toggleBarrier(!this.isCalamity);
      setTimeout(() => {
        this.matrixboards.setGreenArrow();
        this.stopCars = false;
      }, 1000);
    }
    else {
      this.stopCars = true;
      this.matrixboards.setCross();
      setTimeout(() => {
        this.barriers.toggleBarrier(!this.isCalamity);
      }, 1000);
    }
  }

  private direction: RoadDirection = RoadDirection.Backward;
  private matrixboards: Matrixboard;

  constructor(private modelLoaderService: ModelLoaderService, scene: THREE.Scene, offset: number, direction: RoadDirection = RoadDirection.Backward, cars: CarModel[]) {
    this.scene = scene;
    this.offset = offset;
    this.direction = direction;
    
    const textureLoader = new THREE.TextureLoader();
    this.concreteTexture = textureLoader.load('/assets/concrete.jpg');
    this.concreteTexture.wrapS = THREE.RepeatWrapping;
    this.concreteTexture.wrapT = THREE.RepeatWrapping;
    this.concreteTexture.repeat.set(15, 1);

    this.concreteTexture2 = textureLoader.load('/assets/concrete.jpg');
    this.concreteTexture2.wrapS = THREE.RepeatWrapping;
    this.concreteTexture2.wrapT = THREE.RepeatWrapping;
    this.concreteTexture2.repeat.set(1, 0.5);

    this.asphaltTexture = textureLoader.load('/assets/asphalt2.jpg');
    this.asphaltTexture.wrapS = THREE.RepeatWrapping;
    this.asphaltTexture.wrapT = THREE.RepeatWrapping;
    this.asphaltTexture.rotation = Math.PI / 2;
    this.asphaltTexture.repeat.set(1, 14);

    this.asphaltTexture2 = textureLoader.load('/assets/asphalt2.jpg');
    this.asphaltTexture2.wrapS = THREE.RepeatWrapping;
    this.asphaltTexture2.wrapT = THREE.RepeatWrapping;
    this.asphaltTexture2.rotation = Math.PI / 2;
    this.asphaltTexture2.repeat.set(1, 2);

    this.drawRoad();
    this.createCars(cars);

    this.matrixboards = new Matrixboard(this.scene, this.offset, this.direction);

    /*
    if (direction) {
      new Camera(this.scene, this.offset);
    }
    */

    this.barriers = new Barrier(this.scene, this.offset, this.direction);
  }

  createCars(cars: CarModel[]) {
    for(var car of cars) {
      if(car.Lane === 0) {
        this.carsLane1.push(new Jeep(this.modelLoaderService, this.scene, this.direction === RoadDirection.Backward ? this.offset - 2 : this.offset + 2, car.Position, car.Speed, car.Color));
      }
      else if(car.Lane === 1) { 
        this.carsLane2.push(new Jeep(this.modelLoaderService, this.scene, this.direction === RoadDirection.Backward ? this.offset + 2 : this.offset - 2, car.Position, car.Speed, car.Color));
      }
    }
  }

  updateCars(CarModels: CarModel[]) {
    for(var carModel of CarModels) {
      if(carModel.Lane === 0 && this.carsLane1[carModel.Id]) {
        this.carsLane1[carModel.Id].updatePosition(carModel.Position, carModel.Speed);
      }
      else if(carModel.Lane === 1 && this.carsLane2[carModel.Id]) { 
        this.carsLane2[carModel.Id].updatePosition(carModel.Position, carModel.Speed);
      }
    }
  }

  drawRoad() {
    this.drawStraightRoad1();
    this.drawStraightRoad2();
    this.drawTunnelroad();
    this.drawTiltedTunnelRoad1();
    this.drawTiltedTunnelRoad2();
    this.drawTunnelEntrance1();
    this.drawTunnelEntrance2();
  }

  drawStraightRoad1() {
    const asphaltMaterial = new THREE.MeshStandardMaterial({ map: this.asphaltTexture, side: THREE.BackSide });

    const asphaltGeometry = new THREE.PlaneGeometry(242, 10);
    const asphaltMesh = new THREE.Mesh(asphaltGeometry, asphaltMaterial);
    asphaltMesh.rotation.x = Math.PI / 2;
    asphaltMesh.castShadow = true;
    asphaltMesh.receiveShadow = true;
    asphaltMesh.position.set(279, 0, this.offset);
    this.scene.add(asphaltMesh);
  }

  drawStraightRoad2() {
    const asphaltMaterial = new THREE.MeshStandardMaterial({ map: this.asphaltTexture, side: THREE.BackSide });

    const asphaltGeometry2 = new THREE.PlaneGeometry(242, 10);
    const asphaltMesh2 = new THREE.Mesh(asphaltGeometry2, asphaltMaterial);
    asphaltMesh2.rotation.x = Math.PI / 2;
    asphaltMesh2.castShadow = true;
    asphaltMesh2.receiveShadow = true;
    asphaltMesh2.position.set(-279, 0, this.offset);
    this.scene.add(asphaltMesh2);
  }

  drawTunnelroad() {
    const group = new THREE.Group();

    const asphaltMaterial = new THREE.MeshStandardMaterial({ map: this.asphaltTexture, side: THREE.BackSide });
    const concreteMaterial = new THREE.MeshStandardMaterial({ map: this.concreteTexture, side: THREE.DoubleSide });

    const asphaltGeometry3 = new THREE.PlaneGeometry(260, 10);
    const asphaltMesh3 = new THREE.Mesh(asphaltGeometry3, asphaltMaterial);
    asphaltMesh3.rotation.x = Math.PI / 2;
    asphaltMesh3.castShadow = true;
    asphaltMesh3.receiveShadow = true;
    asphaltMesh3.position.set(0, -6, this.offset);
    group.add(asphaltMesh3);

    const roofGeometry = new THREE.BoxGeometry(254, 1, 11);
    const roofMesh = new THREE.Mesh(roofGeometry, concreteMaterial);
    roofMesh.castShadow = true;
    roofMesh.receiveShadow = true;
    roofMesh.position.set(0, -1, this.offset);
    group.add(roofMesh);

    const leftPillarGeometry = new THREE.BoxGeometry(260, 6, 1);
    const leftPillarMesh = new THREE.Mesh(leftPillarGeometry, concreteMaterial);
    leftPillarMesh.position.set(0, -3.5, this.offset + 5);
    leftPillarMesh.castShadow = true;
    leftPillarMesh.receiveShadow = true;
    group.add(leftPillarMesh);

    const rightPillarGeometry = new THREE.BoxGeometry(260, 6, 1);
    const rightPillarMesh = new THREE.Mesh(rightPillarGeometry, concreteMaterial);
    rightPillarMesh.position.set(0, -3.5, this.offset + -5);
    rightPillarMesh.castShadow = true;
    rightPillarMesh.receiveShadow = true;
    group.add(rightPillarMesh);

    for (var i = 130; i > -130; i -= 40) {
      const directionalLight = new THREE.PointLight(0xdbcfa4, 200);
      directionalLight.position.set(i, -2.5, this.offset);
      directionalLight.castShadow = false;
      group.add(directionalLight);
    }

    this.scene.add(group);
  }

  drawTiltedTunnelRoad1() {
    const concreteMaterial = new THREE.MeshStandardMaterial({ map: this.concreteTexture, side: THREE.DoubleSide });
    const asphaltMaterial = new THREE.MeshStandardMaterial({ map: this.asphaltTexture2, side: THREE.BackSide });

    const group = new THREE.Group();
    const asphaltGeometry4 = new THREE.PlaneGeometry(31.8, 10);
    const asphaltMesh4 = new THREE.Mesh(asphaltGeometry4, asphaltMaterial);
    asphaltMesh4.castShadow = true;
    asphaltMesh4.receiveShadow = true;
    asphaltMesh4.rotation.set(Math.PI / 2, 0, 0);
    group.add(asphaltMesh4);

    const roofGeometry = new THREE.BoxGeometry(31.8, 1, 11);
    const roofMesh = new THREE.Mesh(roofGeometry, concreteMaterial);
    roofMesh.castShadow = true;
    roofMesh.receiveShadow = true;
    roofMesh.position.set(0, 5, 0);
    group.add(roofMesh);

    const leftPillarGeometry = new THREE.BoxGeometry(31.8, 6, 1);
    const leftPillarMesh = new THREE.Mesh(leftPillarGeometry, concreteMaterial);
    leftPillarMesh.position.set(0, 1.5, 5);
    leftPillarMesh.castShadow = true;
    leftPillarMesh.receiveShadow = true;
    group.add(leftPillarMesh);

    const rightPillarGeometry = new THREE.BoxGeometry(31.8, 6, 1);
    const rightPillarMesh = new THREE.Mesh(rightPillarGeometry, concreteMaterial);
    rightPillarMesh.position.set(0, 1.5, -5);
    rightPillarMesh.castShadow = true;
    rightPillarMesh.receiveShadow = true;
    group.add(rightPillarMesh);

    const directionalLight = new THREE.PointLight(0xdbcfa4, 200);
    directionalLight.castShadow = false;
    directionalLight.position.set(9, 0, 0)
    group.add(directionalLight);

    group.rotation.set(0, 0, 0.19);
    group.position.set(143, -3, this.offset);
    this.scene.add(group);
  }

  drawTiltedTunnelRoad2() {
    const group = new THREE.Group();

    const concreteMaterial = new THREE.MeshStandardMaterial({ map: this.concreteTexture, side: THREE.DoubleSide });
    const asphaltMaterial = new THREE.MeshStandardMaterial({ map: this.asphaltTexture2, side: THREE.BackSide });

    const asphaltGeometry5 = new THREE.PlaneGeometry(31.8, 10);
    const asphaltMesh5 = new THREE.Mesh(asphaltGeometry5, asphaltMaterial);
    asphaltMesh5.castShadow = true;
    asphaltMesh5.receiveShadow = true;
    asphaltMesh5.rotation.set(Math.PI / 2, 0, 0);
    group.add(asphaltMesh5);

    const roofGeometry = new THREE.BoxGeometry(31.8, 1, 11);
    const roofMesh = new THREE.Mesh(roofGeometry, concreteMaterial);
    roofMesh.castShadow = true;
    roofMesh.receiveShadow = true;
    roofMesh.position.set(0, 5, 0);
    group.add(roofMesh);

    const leftPillarGeometry = new THREE.BoxGeometry(31.8, 6, 1);
    const leftPillarMesh = new THREE.Mesh(leftPillarGeometry, concreteMaterial);
    leftPillarMesh.position.set(0, 1.5, 5);
    leftPillarMesh.castShadow = true;
    leftPillarMesh.receiveShadow = true;
    group.add(leftPillarMesh);

    const rightPillarGeometry = new THREE.BoxGeometry(31.8, 6, 1);
    const rightPillarMesh = new THREE.Mesh(rightPillarGeometry, concreteMaterial);
    rightPillarMesh.position.set(0, 1.5, -5);
    rightPillarMesh.castShadow = true;
    rightPillarMesh.receiveShadow = true;
    group.add(rightPillarMesh);

    const directionalLight = new THREE.PointLight(0xdbcfa4, 200);
    directionalLight.castShadow = false;
    directionalLight.position.set(-9, 0, 0)
    group.add(directionalLight);

    group.rotation.set(0, 0, -0.19);
    group.position.set(-143, -3, this.offset);
    this.scene.add(group);
  }

  drawTunnelEntrance1() {
    const group = new THREE.Group();
    const concreteMaterial = new THREE.MeshStandardMaterial({ map: this.concreteTexture2, side: THREE.DoubleSide });

    const roofGeometry = new THREE.BoxGeometry(3, 1, 11);
    const roofMesh = new THREE.Mesh(roofGeometry, concreteMaterial);
    roofMesh.castShadow = true;
    roofMesh.receiveShadow = true;
    roofMesh.position.set(-0.25, 5, 0);
    group.add(roofMesh);

    const leftPillarGeometry = new THREE.BoxGeometry(2.5, 6, 1);
    const leftPillarMesh = new THREE.Mesh(leftPillarGeometry, concreteMaterial);
    leftPillarMesh.position.set(0, 1.5, 5);
    leftPillarMesh.castShadow = true;
    leftPillarMesh.receiveShadow = true;
    group.add(leftPillarMesh);

    const rightPillarGeometry = new THREE.BoxGeometry(2.5, 6, 1);
    const rightPillarMesh = new THREE.Mesh(rightPillarGeometry, concreteMaterial);
    rightPillarMesh.position.set(0, 1.5, -5);
    rightPillarMesh.castShadow = true;
    rightPillarMesh.receiveShadow = true;

    group.add(rightPillarMesh);
    group.position.set(159, 0, this.offset);
    this.scene.add(group);
  }

  drawTunnelEntrance2() {
    const group = new THREE.Group();
    const concreteMaterial = new THREE.MeshStandardMaterial({ map: this.concreteTexture2, side: THREE.DoubleSide });

    const roofGeometry = new THREE.BoxGeometry(3, 1, 11);
    const roofMesh = new THREE.Mesh(roofGeometry, concreteMaterial);
    roofMesh.castShadow = true;
    roofMesh.receiveShadow = true;
    roofMesh.position.set(0.25, 5, 0);
    group.add(roofMesh);

    const leftPillarGeometry = new THREE.BoxGeometry(2.5, 6, 1);
    const leftPillarMesh = new THREE.Mesh(leftPillarGeometry, concreteMaterial);
    leftPillarMesh.position.set(0, 1.5, 5);
    leftPillarMesh.castShadow = true;
    leftPillarMesh.receiveShadow = true;
    group.add(leftPillarMesh);

    const rightPillarGeometry = new THREE.BoxGeometry(2.5, 6, 1);
    const rightPillarMesh = new THREE.Mesh(rightPillarGeometry, concreteMaterial);
    rightPillarMesh.position.set(0, 1.5, -5);
    rightPillarMesh.castShadow = true;
    rightPillarMesh.receiveShadow = true;

    group.add(rightPillarMesh);
    group.position.set(-159, 0, this.offset);
    this.scene.add(group);
  }

  animate(deltaTime: number) {
    for (var car of this.carsLane1) {
      car.animate(deltaTime, this.carsLane1, this.stopCars);
    }
    for (var car of this.carsLane2) {
      car.animate(deltaTime, this.carsLane2, this.stopCars);
    }
  }
}
