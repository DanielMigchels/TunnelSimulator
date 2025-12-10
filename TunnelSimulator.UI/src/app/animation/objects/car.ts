import * as THREE from 'three';

export class Car {
  public scene!: THREE.Scene;
  public offset!: number;
  public color!: string;
  public car?: THREE.Group<THREE.Object3DEventMap>;

  public speed = 2;
  public initialSpeed = 2;
  public x = 0;

  constructor(scene: THREE.Scene, offset: number, x: number, speed: number = 2, color: string) {
    this.offset = offset;
    this.scene = scene;
    this.speed = speed;
    this.initialSpeed = speed;
    this.x = x;
    this.color = color;
  }

  updatePosition(position: number, speed: number) {
    if (!this.car) {
      return;
    }

    this.x = position;
    this.car!.position.x = this.x;
    this.speed = speed;

    if (this.car.position.x > 400) {
      this.x = -400;
      this.car.position.x = this.x;
      this.car.position.y = 0;
      this.car.rotation.z = 0;
    } else if (this.car.position.x < -400) {
      this.x = 400;
      this.car.position.x = this.x;
      this.car.position.y = 0;
      this.car.rotation.z = 0;
    } else if (this.car.position.x >= -128 && this.car.position.x <= 128) {
      this.car.position.y = -6;
      this.car.rotation.z = 0;
    } else if (this.car.position.x > -158 && this.car.position.x < -128) {
      this.car.position.y = (((this.car.position.x + 128) * -1) / 5) - 6;
      this.car.rotation.z = -0.2;
    } else if (this.car.position.x > 128 && this.car.position.x < 158) {
      this.car.position.y = ((this.car.position.x - 128) / 5) - 6;
      this.car.rotation.z = 0.2;
    } else {
      this.car.rotation.z = 0;
      this.car.position.y = 0;
    }
  }

  animate(deltaTime: number, carsInLane: Car[], isCalamity: boolean) {
    if (!this.car) {
      return;
    }

    this.x += (this.speed * deltaTime);
    this.car.position.x = this.x;

    if (isCalamity) {
      if ((this.initialSpeed > 0 && this.car.position.x > -170 && this.car.position.x < -169) ||
        (this.initialSpeed < 0 && this.car.position.x < 170 && this.car.position.x > 169)) {
        this.speed = 0;
        this.x = this.initialSpeed > 0 ? -169 : 169;
      }
    }

    if (this.car.position.x > 400) {
      this.x = -400;
      this.car.position.x = this.x;
      this.car.position.y = 0;
      this.car.rotation.z = 0;
    } else if (this.car.position.x < -400) {
      this.x = 400;
      this.car.position.x = this.x;
      this.car.position.y = 0;
      this.car.rotation.z = 0;
    } else if (this.car.position.x >= -128 && this.car.position.x <= 128) {
      this.car.position.y = -6;
      this.car.rotation.z = 0;
    } else if (this.car.position.x > -158 && this.car.position.x < -128) {
      this.car.position.y = (((this.car.position.x + 128) * -1) / 5) - 6;
      this.car.rotation.z = -0.2;
    } else if (this.car.position.x > 128 && this.car.position.x < 158) {
      this.car.position.y = ((this.car.position.x - 128) / 5) - 6;
      this.car.rotation.z = 0.2;
    } else {
      this.car.rotation.z = 0;
      this.car.position.y = 0;
    }
  }
}