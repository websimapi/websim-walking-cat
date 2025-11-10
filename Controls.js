import * as THREE from 'three';

export class Controls {
    constructor() {
        this.keys = {
            'w': false,
            'a': false,
            's': false,
            'd': false
        };
        this.direction = new THREE.Vector3();
        this.addEventListeners();
    }

    addEventListeners() {
        window.addEventListener('keydown', (event) => this.onKeyChange(event.key.toLowerCase(), true));
        window.addEventListener('keyup', (event) => this.onKeyChange(event.key.toLowerCase(), false));
    }

    onKeyChange(key, isPressed) {
        if (this.keys.hasOwnProperty(key)) {
            this.keys[key] = isPressed;
        }
    }

    getDirection() {
        this.direction.set(0, 0, 0);

        if (this.keys.w) this.direction.z -= 1;
        if (this.keys.s) this.direction.z += 1;
        if (this.keys.a) this.direction.x -= 1;
        if (this.keys.d) this.direction.x += 1;

        if (this.direction.length() > 0) {
            this.direction.normalize();
        }

        return this.direction;
    }
}

