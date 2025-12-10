import { ElementRef } from "@angular/core";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { World } from "./objects/world";

export class TunnelScene {
  private fov = 90;
  private container: ElementRef;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private scene: THREE.Scene;
  private world: World;
  private clock = new THREE.Clock();
  private animationSpeed = 4;
  private index: Number;

  private mediaRecorder!: MediaRecorder;
  private socket!: WebSocket;

  constructor(private elementRef: ElementRef, sharedScene: THREE.Scene, world: World, index: Number) {
    this.index = index;
    this.container = elementRef;
    this.scene = sharedScene;
    this.world = world;
  }

  initialize(highQuality = true): void {
    this.renderer = new THREE.WebGLRenderer({ antialias: highQuality });
    if (highQuality) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    this.renderer.setSize(this.container.nativeElement.clientWidth, this.container.nativeElement.clientHeight);
    this.container.nativeElement.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      this.container.nativeElement.clientWidth / this.container.nativeElement.clientHeight,
      0.1,
      1000
    );

    this.setCameraPosition(200, 20, -50);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.setLookAt(90, 0, 0);
    this.controls.update();

    // Start animation
    window.addEventListener('resize', this.onWindowResize.bind(this), false);

    this.animate();
  }

  public animate(): void {
    requestAnimationFrame(() => this.animate());
    const deltaTime = this.clock.getDelta();

    if (this.index === 0) {
      this.world.animate(deltaTime * this.animationSpeed);
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  setCameraPosition(x: number, y: number, z: number): void {
    this.camera.position.set(x, y, z);
  }

  setLookAt(x: number, y: number, z: number) {
    this.controls.target.set(x, y, z);
    this.controls.update();
  }

  private onWindowResize(): void {
    this.camera.aspect = this.container.nativeElement.clientWidth / this.container.nativeElement.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.nativeElement.clientWidth, this.container.nativeElement.clientHeight);
  }
}
