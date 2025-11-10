import * as THREE from 'three';
import { Cat } from './Cat.js';
import { Controls } from './Controls.js';

class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#c'), antialias: true });
        this.clock = new THREE.Clock();

        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.scene.background = new THREE.Color(0x87ceeb);

        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(5, 10, 7.5);
        this.scene.add(directionalLight);

        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
            new THREE.MeshStandardMaterial({ color: 0x228B22 })
        );
        ground.rotation.x = -Math.PI / 2;
        this.scene.add(ground);

        this.cat = new Cat(this.scene);
        this.controls = new Controls();

        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.animate();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const deltaTime = this.clock.getDelta();
        
        if (this.cat && this.cat.isLoaded) {
            const moveDirection = this.controls.getDirection();
            this.cat.update(deltaTime, moveDirection);
        }

        this.renderer.render(this.scene, this.camera);
    }
}

new Game();

