import { Injectable } from '@angular/core';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Injectable({
  providedIn: 'root'
})
export class ModelLoaderService {
  private modelCache: { [key: string]: THREE.Group } = {};

  constructor() {
    this.loadFbxModel("/assets/cars/Jeep_Renegade_2016_fbx/Jeep_Renegade_2016.fbx.jpg");
    this.loadGltfModel("/assets/shapespark-low-poly-plants-kit.gltf.jpg");
  }

  loadFbxModel(url: string): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
      if (this.modelCache[url]) {
        const cachedModel = this.modelCache[url].clone();
        this.cloneMaterials(cachedModel);
        resolve(cachedModel);
      } else {
        const loader = new FBXLoader();
        loader.load(url, (model) => {
          const clonedModel = model.clone();
          this.cloneMaterials(clonedModel);
          this.modelCache[url] = model;
          resolve(clonedModel);
        }, undefined, (error) => {
          reject(error);
        });
      }
    });
  }

  loadGltfModel(url: string): Promise<GLTF> {
    return new Promise((resolve, reject) => {
      if (this.modelCache[url]) {
        console.log("new gltf");
        resolve({ scene: this.modelCache[url].clone(), animations: [], materials: [] } as unknown as GLTF);
      } else {
        console.log("cached gltf");
        const loader = new GLTFLoader();
        loader.load(
          url,
          (gltf) => {
            this.modelCache[url] = gltf.scene; 
            resolve(gltf);
          },
          undefined,
          (error) => {
            reject(error);
          }
        );
      }
    });
  }

  cloneMaterials(model: THREE.Group) {
    model.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((mat: THREE.Material) => mat.clone());
        } else {
          mesh.material = mesh.material.clone();
        }
      }
    });
  }

}
