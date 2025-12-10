import * as THREE from 'three';

export class Skybox {
  private scene!: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.scene.background = new THREE.Color(0xd1e0dd);
  }
}
