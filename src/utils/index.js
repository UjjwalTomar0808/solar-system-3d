import * as THREE from 'three';

export function createPlanet(scene, planetData) {
    const texture = new THREE.TextureLoader().load(planetData.texturePath, (tex) => {
        tex.encoding = THREE.sRGBEncoding;
    });

    let material = new THREE.MeshPhongMaterial({
        map: texture
    });

    let geometry = new THREE.SphereGeometry(planetData.size, 64, 64);
    let planet = new THREE.Mesh(geometry, material);
    planet.position.x = planetData.distance * 10;
    planet.castShadow = true;
    planet.receiveShadow = true;
    scene.add(planet);

    if (planetData.ringTexturePath) {
        addRingsToSaturn(planet, planetData);
    }

    // Create and add the label
    const label = createLabel(planetData.name, planetData.size);
    label.position.y = planetData.size * 2;
    planet.add(label);

    return { mesh: planet, label: label };
}

export function createMoon(planet, moonData) {
    const moonTexture = new THREE.TextureLoader().load(moonData.texturePath);
    const moonMaterial = new THREE.MeshPhongMaterial({ map: moonTexture });
    const moonGeometry = new THREE.SphereGeometry(moonData.size, 32, 32);
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);

    // Create a pivot at the Earth's position
    const moonPivot = new THREE.Object3D();

    // Set the Moon's position relative to the Earth
    moonMesh.position.set(moonData.distanceFromPlanet, 0, 0);

    // Add the Moon mesh to the pivot
    moonPivot.add(moonMesh);

    // Add the pivot as a child of the Earth mesh so that it follows the Earth
    planet.mesh.add(moonPivot);

    return { mesh: moonMesh, pivot: moonPivot };
}

function createLabel(name, planetSize) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '16px Arial';
    context.fillStyle = 'white';
    context.fillText(name, 10, 20);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(planetSize * 5, planetSize * 2.5, 1);

    return sprite;
}

function addRingsToSaturn(planetMesh, planetData) {
    const numberOfRings = 50;
    const ringInnerSize = planetData.size * 1.1;
    const ringOuterSize = planetData.size * 2;
    const ringThickness = (ringOuterSize - ringInnerSize) / numberOfRings;

    // Define the gaps - these are the ranges where rings will not be created
    const gapRanges = [
        { start: 0.3, end: 0.32 },
        { start: 0.5, end: 0.53 },
        { start: 0.55, end: 0.58 },
    ];

    for (let i = 0; i < numberOfRings; i++) {
        const distanceFromSaturn = (i / numberOfRings);

        // Check if the current ring is within a gap range
        if (gapRanges.some(gap => distanceFromSaturn >= gap.start && distanceFromSaturn <= gap.end)) {
            continue; // Skip this iteration to create a gap
        }

        const innerRadius = ringInnerSize + ringThickness * i;
        const outerRadius = innerRadius + ringThickness;

        const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64, 1);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(`hsl(0, 0%, ${20 + distanceFromSaturn * 50}%)`),
            transparent: true,
            opacity: 0.5 - distanceFromSaturn * 0.4,
            side: THREE.DoubleSide
        });
        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        ringMesh.rotation.x = Math.PI / 2;

        planetMesh.add(ringMesh);
    }
}