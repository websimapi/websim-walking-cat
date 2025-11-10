import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class Cat {
    constructor(scene) {
        this.scene = scene;
        this.model = null;
        this.mixer = null;
        this.animations = {};
        this.currentAction = null;
        this.isLoaded = false;
        this.speed = 2.5;

        this.loadPromise = this.load();
    }

    load() {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load('/rigged_black_cat_one.glb', (gltf) => {
                this.model = gltf.scene;
                this.model.scale.set(0.5, 0.5, 0.5);
                this.scene.add(this.model);

                this.mixer = new THREE.AnimationMixer(this.model);
                
                if (gltf.animations.length > 0) {
                    const walkAnimation = gltf.animations[0]; 
                    this.animations.walk = this.mixer.clipAction(walkAnimation);
                }

                this.isLoaded = true;
                resolve();
            }, undefined, (error) => {
                console.error(error);
                reject(error);
            });
        });
    }

    update(deltaTime, moveDirection) {
        if (!this.isLoaded) return;

        const isMoving = moveDirection.length() > 0;

        if (isMoving) {
            if (this.currentAction !== 'walk') {
                this.playAnimation('walk');
            }

            // Calculate rotation
            const angle = Math.atan2(moveDirection.x, moveDirection.z);
            const targetQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
            this.model.quaternion.slerp(targetQuaternion, 0.1);
            
            // Move model
            const moveVector = moveDirection.clone().multiplyScalar(this.speed * deltaTime);
            this.model.position.add(moveVector);

        } else {
            if (this.currentAction === 'walk') {
                this.stopAnimation('walk');
            }
        }

        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
    }

    playAnimation(name) {
        if (this.animations[name]) {
            if(this.currentAction && this.animations[this.currentAction]) {
                this.animations[this.currentAction].fadeOut(0.2);
            }
            this.animations[name].reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(0.2).play();
            this.currentAction = name;
        }
    }

    stopAnimation(name) {
        if (this.animations[name]) {
            this.animations[name].fadeOut(0.2);
            this.currentAction = null;
        }
    }
}