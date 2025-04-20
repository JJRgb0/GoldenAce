import * as THREE from 'three'

export const silverMaterial = new THREE.MeshPhysicalMaterial({
    color: '#C0C0C0',
    metalness: 0.7,
    roughness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    reflectivity: 0.9,
    envMapIntensity: 1,
})

export const grayPlasticMaterial = new THREE.MeshPhysicalMaterial({
    color: '#333333',
    metalness: 0,
    roughness: 0.5,
    clearcoat: 0.3,
    clearcoatRoughness: 0.2,
    envMapIntensity: 0.3,
    side: THREE.DoubleSide,
});

export const redPlasticMaterial = new THREE.MeshPhysicalMaterial({
    color: '#C8102E',
    metalness: 0,
    roughness: 0.4,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1,
    envMapIntensity: 0.5,
    side: THREE.DoubleSide,
});

export const darkPlasticMaterial = new THREE.MeshPhysicalMaterial({
    color: '#1C2526',
    metalness: 0,
    roughness: 0.6,
    clearcoat: 0.3,
    clearcoatRoughness: 0.2,
    envMapIntensity: 0.4,
});

export const screenMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x0a0a0e),
    metalness: 0.2,
    roughness: 0.2,
    reflectivity: 0.8,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    transmission: 0.05,
    opacity: 0.98,
    envMapIntensity: 0.7
});

export const neonOffMaterial = new THREE.MeshStandardMaterial({
    color: '#1A1A1A',
    emissiveIntensity: 4,
    metalness: 0,
    roughness: 0.5,
});