import mercury from '../assets/images/mercury.jpg';
import venus from '../assets/images/venus.jpg';
import earth from '../assets/images/earth_daymap.jpg';
import mars from '../assets/images/mars.jpg';
import jupiter from '../assets/images/jupiter.jpg';
import saturn from '../assets/images/saturn.jpg';
import saturnRings from '../assets/images/saturn_ring.png';
import uranus from '../assets/images/uranus.jpg';
import neptune from '../assets/images/neptune.jpg';

export const planetsData = [
    { 
        name: "Mercury", 
        color: 0xaaaaaa, 
        size: 0.3504, 
        distance: 1.39, 
        orbitSpeed: 0.04, 
        texturePath: mercury, 
        orbitColor: 0xaaaaaa,
        info: "Closest planet to the Sun"
    },
    { 
        name: "Venus", 
        color: 0xffd700, 
        size: 0.8691, 
        distance: 1.72, 
        orbitSpeed: 0.02, 
        texturePath: venus, 
        orbitColor: 0xffd700,
        info: "Hottest planet in our solar system"
    },
    { 
        name: "Earth", 
        color: 0x0000ff, 
        size: 0.9149, 
        distance: 2, 
        orbitSpeed: 0.01, 
        texturePath: earth, 
        orbitColor: 0x0000ff,
        info: "Our home planet"
    },
    { 
        name: "Mars", 
        color: 0xff4500, 
        size: 0.4868, 
        distance: 2.52, 
        orbitSpeed: 0.008, 
        texturePath: mars, 
        orbitColor: 0xff4500,
        info: "The Red Planet"
    },
    { 
        name: "Jupiter", 
        color: 0xffa500, 
        size: 5.0398, 
        distance: 6.3, 
        orbitSpeed: 0.004, 
        texturePath: jupiter, 
        orbitColor: 0xffa500,
        info: "Largest planet in our solar system"
    },
    { 
        name: "Saturn", 
        color: 0xf4c542, 
        size: 4.3626, 
        distance: 10.58, 
        orbitSpeed: 0.003, 
        texturePath: saturn, 
        orbitColor: 0xf4c542, 
        ringTexturePath: saturnRings,
        info: "Famous for its beautiful rings"
    },
    { 
        name: "Uranus", 
        color: 0x4169e1, 
        size: 1.6422, 
        distance: 20.22, 
        orbitSpeed: 0.002, 
        texturePath: uranus, 
        orbitColor: 0x4169e1,
        info: "Ice giant tilted on its side"
    },
    { 
        name: "Neptune", 
        color: 0x1e90ff, 
        size: 1.5359, 
        distance: 31.05, 
        orbitSpeed: 0.001, 
        texturePath: neptune, 
        orbitColor: 0x1e90ff,
        info: "Windiest planet in our solar system"
    }
];