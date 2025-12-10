import * as THREE from 'three';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader.js';
import { RoadDirection } from '../../../services/websocket/models/road/road-direction';

export class Barrier {
  private scene!: THREE.Scene;
  private offset: number;
  private direction!: RoadDirection;
  private group!: THREE.Group<THREE.Object3DEventMap>;

  constructor(scene: THREE.Scene, offset: number, direction: RoadDirection) {
    this.scene = scene;
    this.offset = offset;
    this.direction = direction;
    this.loadBarrierModel();
  }

  loadBarrierModel() {
    this.group = new THREE.Group();

    const loader = new ThreeMFLoader();

    loader.load("/assets/barrier/barrier_closed.3mf.jpg", (model) => {
      var barrier = model.clone();

      barrier.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.scale.set(0.02, 0.02, 0.02);
          child.rotation.x = Math.PI / 2 * -1;
          if (this.direction === RoadDirection.Backward) {
            child.rotation.z = Math.PI / 2;
          }
          else {
            child.rotation.z = Math.PI * 1.5;
          }
        }
      });
      if (this.direction === RoadDirection.Backward) {
        barrier.position.set(163, 0, this.offset - 4.5);
      }
      else {
        barrier.position.set(-163, 0, this.offset + 4.5);
      }

      this.group.add(barrier);

      var barrier2 = model.clone();

      barrier2.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.scale.set(0.02, 0.02, 0.02);
          child.rotation.x = Math.PI / 2 * -1;
          if (this.direction === RoadDirection.Backward) {
            child.rotation.z = Math.PI / 2 * -1;
          }
          else {
            child.rotation.z = Math.PI * 1.5 * -1;
          }
        }
      });

      barrier2.scale.x *= -1;

      if (this.direction === RoadDirection.Backward) {
        barrier2.position.set(163, 0, this.offset + 4.5);
      }
      else {
        barrier2.position.set(-163, 0, this.offset - 4.5);
      }

      this.group.add(barrier2);

      loader.load("/assets/barrier/barrier_open.3mf.jpg", (model) => {
        var barrier = model.clone();

        barrier.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.scale.set(0.02, 0.02, 0.02);
            child.rotation.x = Math.PI / 2 * -1;
            child.position.y += 1;
            if (this.direction === RoadDirection.Backward) {
              child.rotation.z = Math.PI / 2;
            }
            else {
              child.rotation.z = Math.PI * 1.5;;
            }
          }
        });
        barrier.rotation.x = Math.PI / 2 / 0.5;
        if (this.direction === RoadDirection.Backward) {
          barrier.position.set(163, 0, this.offset - 4.5);
        }
        else {
          barrier.position.set(-163, 0, this.offset + 4.5);
        }

        this.group.add(barrier);

        var barrier2 = model.clone();

        barrier2.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.scale.set(0.02, 0.02, 0.02);
            child.rotation.x = Math.PI / 2 * -1;
            child.position.y += 1;
            child.position.z += this.direction === RoadDirection.Backward ? -1.6 : 1.6;
            if (this.direction === RoadDirection.Backward) {
              child.rotation.z = Math.PI / 2 * -1;
            }
            else {
              child.rotation.z = Math.PI * 1.5 * -1;
            }
          }
        });

        barrier2.scale.x *= -1;
        barrier2.rotation.x = Math.PI / 2 / 0.5;

        if (this.direction === RoadDirection.Backward) {
          barrier2.position.set(163, 0, this.offset + 4.5);
        }
        else {
          barrier2.position.set(-163, 0, this.offset - 4.5);
        }
        this.group.add(barrier2);
        this.toggleBarrier(true);
        this.scene.add(this.group);
      }, undefined, (error) => {
        console.error("Error loading model:", error);
      });

    }, undefined, (error) => {
      console.error("Error loading model:", error);
    });
  }

  toggleBarrier(isOpen: boolean) {
    if (!isOpen) {
      this.group.rotation.x = 0;
      this.group.position.y = 0;
      this.group.position.z = 0;
    }
    else {
      this.group.position.y = -1;
      this.group.rotation.x = Math.PI * -1;
      this.group.position.z = this.direction === RoadDirection.Backward ? -12.2 : 12.2;
    }    
  }
}
