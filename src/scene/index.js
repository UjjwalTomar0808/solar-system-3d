import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import stars from '../assets/images/stars.jpg';

let scene, camera, renderer, controls, asteroidBelt;

function createScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const highestPlanetY = 100;
    camera.position.set(0, highestPlanetY, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;

    addStarBackground();

    // Initialize OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxDistance = 500;
    controls.minDistance = 1;

    // Swap the mouse buttons for rotate and pan
    controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
    };

    asteroidBelt = createAsteroidBelt();
    
    return renderer.domElement;
}

function addStarBackground() {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(stars);
    const geometry = new THREE.SphereGeometry(500, 64, 64);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
        color: 0x111111,
    });
    const starBackground = new THREE.Mesh(geometry, material);

    scene.add(starBackground);
}

function createAsteroidBelt() {
    const asteroidBelt = new THREE.Object3D();
    const innerBeltRadius = 2.52 * 10 + 2;
    const outerBeltRadius = 6.2 * 10 - 10;
    const asteroidSize = 0.05;

    for (let i = 0; i < 1500; i++) {
        const asteroidGeometry = new THREE.SphereGeometry(asteroidSize, 6, 6);
        const asteroidMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
        const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

        const theta = Math.random() * 2 * Math.PI;
        const distance = THREE.MathUtils.lerp(innerBeltRadius, outerBeltRadius, Math.random());
        asteroid.position.x = distance * Math.cos(theta);
        asteroid.position.z = distance * Math.sin(theta);
        asteroid.position.y = (Math.random() - 0.5) * 2;

        asteroid.castShadow = true;
        asteroid.receiveShadow = true;
        asteroidBelt.add(asteroid);
    }

    scene.add(asteroidBelt);
    return asteroidBelt;
}

export { scene, camera, renderer, controls, createScene };