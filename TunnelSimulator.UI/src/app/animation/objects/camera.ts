import * as THREE from 'three';
import { ThreeMFLoader  } from 'three/examples/jsm/loaders/3MFLoader.js';

export class Camera {
  private scene!: THREE.Scene;
  private offset: number;

  constructor(scene: THREE.Scene, offset: number) {
    this.scene = scene;
    this.offset = offset;
    this.loadCameraModel();
  }

  loadCameraModel() {
    const loader = new ThreeMFLoader();

    loader.load("/assets/camera/dahua.3mf.jpg", (camera) => {
      camera.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // child.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Temporary material
          child.position.x = -7;
          // child.position.y = 5.5;
          child.position.z = -0;
          child.scale.set(0.005, 0.005, 0.005);
          child.rotation.x = Math.PI / 2;
        }
      });
      camera.position.set(160, 4, this.offset);
      this.scene.add(camera);
    }, undefined, (error) => {
      console.error("Error loading model:", error);
    });
    
  }
}
