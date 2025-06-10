import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { scene, camera, renderer, controls, createScene } from '../scene/index.js';
import { planetsData } from '../data/planets.js';
import { moonsData } from '../data/moons.js';
import sunTexture from '../assets/images/sun.jpg';
import { createPlanet, createMoon } from '../utils/index.js';

const SolarSystem = ({ planetSpeeds, isPaused }) => {
  const mountRef = useRef(null);
  const planetsRef = useRef({});
  const sunRef = useRef(null);
  const frameRef = useRef(null);
  const SGmaterialRef = useRef(null);

  // Refs to keep track of latest props inside animation loop
  const planetSpeedsRef = useRef(planetSpeeds);
  const isPausedRef = useRef(isPaused);

  // Update refs on prop change
  useEffect(() => {
    planetSpeedsRef.current = planetSpeeds;
  }, [planetSpeeds]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    if (!mountRef.current) return;

    const rendererElement = createScene();
    mountRef.current.appendChild(rendererElement);

    // Add Sun
    const textureLoader = new THREE.TextureLoader();
    const sunGeometry = new THREE.SphereGeometry(8, 64, 64);
    const sunMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load(sunTexture) });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);
    sunRef.current = sun;

    // Add glow effect
    const vertexShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    
    const fragmentShader = `
      uniform vec3 cameraPos;
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vec3 viewVector = normalize(cameraPos - vPosition);
        float intensity = pow(0.5 - dot(vNormal, viewVector), 5.0);
        gl_FragColor = vec4(1.0, 0.9, 0.5, intensity);
      }
    `;
    const SGmaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        cameraPos: { value: camera.position }
      },
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      side: THREE.BackSide
    });
    SGmaterialRef.current = SGmaterial;
    const glowMesh = new THREE.Mesh(sun.geometry.clone(), SGmaterial);
    glowMesh.scale.multiplyScalar(1.1);
    sun.add(glowMesh);

    // Lighting
    const sunLight = new THREE.PointLight(0xffffff, 2000, 200);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    scene.add(sunLight);
    scene.add(new THREE.AmbientLight(0x444444));

    // Planets
    const planets = {};
    planetsData.forEach((planetData) => {
      const planet = createPlanet(scene, planetData);
      planets[planetData.name] = planet;
      createOrbit(planetData.distance, planetData.orbitColor);
    });
    planetsRef.current = planets;

    // Moon
    const earth = planets["Earth"];
    if (earth) {
      const moon = createMoon(earth, moonsData[0]);
      earth.moon = moon;
    }

    camera.position.z = 120;

    // Animation
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      if (SGmaterialRef.current) {
        SGmaterialRef.current.uniforms.cameraPos.value.copy(camera.position);
      }

      controls.update();

      if (!isPausedRef.current) {
        const now = Date.now();

        for (const planetName in planetsRef.current) {
          const planetData = planetsData.find(p => p.name === planetName);
          const planetIndex = planetsData.findIndex(p => p.name === planetName);
          const speedMultiplier = planetSpeedsRef.current[planetIndex] || 1;
          const angle = planetData.orbitSpeed * speedMultiplier * now * 0.001;

          const planet = planetsRef.current[planetName];
          planet.mesh.position.x = Math.cos(angle) * planetData.distance * 10;
          planet.mesh.position.z = Math.sin(angle) * planetData.distance * 10;

          const distance = camera.position.distanceTo(planet.mesh.position);
          const scale = THREE.MathUtils.clamp(distance / 5, 5, 50);
          planet.label.scale.set(scale, scale / 2, 1);

          updatePlanetRotation(planet.mesh, sunRef.current.position);
        }

        const earth = planetsRef.current["Earth"];
        if (earth?.moon) {
          earth.moon.pivot.rotation.y += moonsData[0].orbitSpeed;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleResize);
      if (renderer && mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      if (renderer) renderer.dispose();
    };
  }, []);

  function updatePlanetRotation(planetMesh, sunPosition) {
    const directionToSun = new THREE.Vector3().subVectors(sunPosition, planetMesh.position);
    planetMesh.rotation.y = Math.atan2(directionToSun.x, directionToSun.z);
  }

  function createOrbit(distanceFromSun, color) {
    const orbitRadius = distanceFromSun * 10;
    const orbitThickness = 0.03;
    const orbitSegments = 128;

    const orbitGeometry = new THREE.RingGeometry(orbitRadius, orbitRadius + orbitThickness, orbitSegments);
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);
  }

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default SolarSystem;
