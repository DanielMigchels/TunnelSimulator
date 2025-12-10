import * as THREE from 'three';
import { RoadDirection } from '../../../services/websocket/models/road/road-direction';

export class Matrixboard {
  private scene!: THREE.Scene;
  private offset!: number;
  private direction!: RoadDirection;

  private cube!: THREE.Mesh;
  private cube2!: THREE.Mesh;

  constructor(scene: THREE.Scene, offset: number, direction: RoadDirection) {
    this.scene = scene;
    this.offset = offset;
    this.direction = direction;
    this.placeMatrixBoard();
  }

  placeMatrixBoard() {
    const textureLoader = new THREE.TextureLoader();
    const greenArrow = textureLoader.load('/assets/matrixbord/matrixbord-groene-pijl.jpg');
    greenArrow.wrapS = THREE.RepeatWrapping;
    greenArrow.wrapT = THREE.RepeatWrapping;
    greenArrow.repeat.set(1, 1);
    const cross = textureLoader.load('/assets/matrixbord/matrixbord-kruis.jpg');
    cross.wrapS = THREE.RepeatWrapping;
    cross.wrapT = THREE.RepeatWrapping;
    cross.repeat.set(1, 1);

    var gemoetry = new THREE.BoxGeometry(0.1, 1.2, 1.2);
    var greenArrowFrontMaterial = new THREE.MeshStandardMaterial({ map: greenArrow, side: THREE.DoubleSide });
    var crossFrontMaterial = new THREE.MeshStandardMaterial({ map: cross, side: THREE.DoubleSide });
    const otherMaterial = new THREE.MeshBasicMaterial({ color: 0x1E1E1C, side: THREE.DoubleSide });

    const materials = [
      crossFrontMaterial, // Left side
      greenArrowFrontMaterial, // Right side
      otherMaterial, // Top side
      otherMaterial, // Bottom side
      otherMaterial, // Front side
      otherMaterial  // Back side
    ];
    
    if (this.direction === RoadDirection.Backward) {
      this.cube = new THREE.Mesh(gemoetry, materials);
      this.cube.position.set(160.3, 5, this.offset - 2);
      this.cube.rotation.y = Math.PI;
      this.scene.add(this.cube);
  
      this.cube2 = new THREE.Mesh(gemoetry, materials);
      this.cube2.position.set(160.3, 5, this.offset + 2);
      this.cube2.rotation.y = Math.PI;
      this.scene.add(this.cube2);
    }
    else {
      this.cube = new THREE.Mesh(gemoetry, materials);
      this.cube.position.set(-160.3, 5, this.offset - 2);
      this.scene.add(this.cube);
  
      this.cube2 = new THREE.Mesh(gemoetry, materials);
      this.cube2.position.set(-160.3, 5, this.offset + 2);
      this.scene.add(this.cube2);
    }

    this.setGreenArrow();
  }

  setCross() {
    if (this.direction === RoadDirection.Backward) {
      this.cube.rotation.y = 0;
      this.cube2.rotation.y = 0;
    }
    else {
      this.cube.rotation.y = Math.PI;
      this.cube2.rotation.y = Math.PI;
    }
  }

  setGreenArrow() {
    if (this.direction === RoadDirection.Backward) {
      this.cube.rotation.y = Math.PI;
      this.cube2.rotation.y = Math.PI;
    }
    else {
      this.cube.rotation.y = 0;
      this.cube2.rotation.y = 0;
    }
  }
}
