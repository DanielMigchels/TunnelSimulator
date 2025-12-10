import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TreeType } from './tree-type';
import { ModelLoaderService } from '../../../services/3dmodels/model-loader.service';

export class Forest {
  private scene!: THREE.Scene;

  constructor(scene: THREE.Scene, private modelLoaderService: ModelLoaderService) {
    this.scene = scene;
    this.loadTreeModel();
  }

  public loadTreeModel(): void {
    this.modelLoaderService.loadGltfModel("/assets/shapespark-low-poly-plants-kit.gltf.jpg").then(gltf => {
      const treeTypes = [TreeType.Tree01_1, TreeType.Tree02_1, TreeType.Tree03_1];
      const ranges = [
        { xMin: -400, xMax: -100, zMin: -400, zMax: -20, count: 25 },
        { xMin: -400, xMax: -100, zMin: 20, zMax: 350, count: 25 },
        { xMin: 80, xMax: 350, zMin: -400, zMax: -20, count: 25 },
        { xMin: 80, xMax: 350, zMin: 20, zMax: 350, count: 25 },
      ];

      for (const range of ranges) {
        for (let i = 0; i < range.count; i++) {
          for (const treeType of treeTypes) {
            this.placeTree(
              gltf,
              treeType,
              this.getRandomInt(range.xMin, range.xMax),
              0,
              this.getRandomInt(range.zMin, range.zMax)
            );
          }
        }
      }
    });
  }

  placeTree(gltf: GLTF, treeType: TreeType, x: number, y: number, z: number): void {
    const targetPlant = gltf.scene.getObjectByName(treeType);
    if (targetPlant) {
      const clonedPlant = targetPlant.clone();
      
      clonedPlant.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.position.x = x;
          child.position.y = y;
          child.position.z = z;
          child.castShadow = true;
          child.scale.set(child.scale.x * 1.5, child.scale.y * 1.5, child.scale.z * 1.5);
        }
      });
      this.scene.add(clonedPlant);
    }
  }

  private seed: number = 543362;
  private getRandomInt(min: number, max: number): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    const rnd = this.seed / 233280;
    return Math.floor(min + rnd * (max - min + 1));
  }
}
