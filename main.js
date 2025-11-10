import * as THREE from 'three';
import { Cat } from './Cat.js';
import { Controls } from './Controls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#c'), antialias: true });
        this.clock = new THREE.Clock();
        this.orbitControls = null;

        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.scene.background = new THREE.Color(0x87ceeb);

        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);

        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 0.05;
        this.orbitControls.screenSpacePanning = false;
        this.orbitControls.minDistance = 5;
        this.orbitControls.maxDistance = 20;
        this.orbitControls.maxPolarAngle = Math.PI / 2 - 0.05; // prevent camera from going below the ground

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

        this.cat.loadPromise.then(() => {
            this.setupGUI();
            this.orbitControls.target.copy(this.cat.base.position);
            this.orbitControls.update();
        });


        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.animate();
    }

    setupGUI() {
        const gui = new GUI();
        const catFolder = gui.addFolder('Cat');
        const catScaleFolder = catFolder.addFolder('Scale');
        catScaleFolder.add(this.cat.model.scale, 'x', 0.1, 2).name('X');
        catScaleFolder.add(this.cat.model.scale, 'y', 0.1, 2).name('Y');
        catScaleFolder.add(this.cat.model.scale, 'z', 0.1, 2).name('Z');

        const catRotationFolder = catFolder.addFolder('Rotation');
        catRotationFolder.add(this.cat.base.rotation, 'x', 0, Math.PI * 2).name('X');
        catRotationFolder.add(this.cat.base.rotation, 'y', 0, Math.PI * 2).name('Y');
        catRotationFolder.add(this.cat.base.rotation, 'z', 0, Math.PI * 2).name('Z');
        catFolder.open();
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

            // Store position before update
            const oldPosition = this.cat.base.position.clone();

            this.cat.update(deltaTime, moveDirection);

            // Camera follow logic
            const newPosition = this.cat.base.position;
            const delta = new THREE.Vector3().subVectors(newPosition, oldPosition);

            // Move camera by the same amount the cat moved
            this.camera.position.add(delta);

            // Update orbit controls target to the cat's new position
            this.orbitControls.target.copy(newPosition);
        }
        
        if (this.orbitControls) {
            this.orbitControls.update();
        }

        this.renderer.render(this.scene, this.camera);
    }
}

new Game();