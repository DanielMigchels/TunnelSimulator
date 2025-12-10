import { Car } from "../car";
import * as THREE from 'three';
import { ModelLoaderService } from "../../../../services/3dmodels/model-loader.service";

export class Jeep extends Car {

  constructor(private modelLoaderService: ModelLoaderService, scene: THREE.Scene, offset: number, x: number, speed: number = 2, color: string) {
    super(scene, offset, x, speed, color);
    this.loadCarModel();
  }

  loadCarModel() {
    this.modelLoaderService.loadFbxModel('/assets/cars/Jeep_Renegade_2016_fbx/Jeep_Renegade_2016.fbx.jpg')
      .then(fbx => {
        if (this.x > -163 && this.x < 163) {
          this.placeCar(fbx, this.x, -6, this.offset);
        } else {
          this.placeCar(fbx, this.x, 0, this.offset);
        }
      })
      .catch(error => {
        console.error(`Failed to load the car model: ${error}`);
      });
  }

  private placeCar(fbx: THREE.Group<THREE.Object3DEventMap>, x: number, y: number, z: number) {
    var jeep = fbx.clone();
    jeep.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (this.speed > 0) {
          child.rotation.y = Math.PI / 2;
        }
        else {
          child.rotation.y = Math.PI / -2;
        }
        
        child.scale.set(1, 1, 1);
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              this.adjustMaterial(mat)
            });
          } else {
            this.adjustMaterial(child.material);
          }
        }
      }
    });
    jeep.position.set(x, y, z);
    this.car = jeep;
    this.scene.add(this.car);
  }

  private adjustMaterial(material: THREE.Material) {
    if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshPhongMaterial) {
      material.color = new THREE.Color(this.color);
      material.needsUpdate = true;
    }
  }
}
