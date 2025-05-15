import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';

export function addReflectiveShell(scene) {
  const shellGeo = new THREE.SphereGeometry(2.05, 128, 128);

  const shellMat = new THREE.MeshPhysicalMaterial({
    transmission: 1.0,           // Let light pass through
    transparent: true,
    opacity: 0.12,
    roughness: 0.1,              // Micro scratches
    metalness: 0.4,
    reflectivity: 0.9,           // High surface reflection
    thickness: 1.2,              // Optical depth through shell
    clearcoat: 1.0,              // Add specular highlights
    clearcoatRoughness: 0.05,
    ior: 1.45,                   // Index of refraction (like glass/plasma)
    sheen: 0.3,                  // Subtle light scattering
    sheenColor: new THREE.Color('#88aaff'),
    color: new THREE.Color('#0e0e1a').convertSRGBToLinear()
  });

  const shell = new THREE.Mesh(shellGeo, shellMat);
  shell.renderOrder = 1;
  scene.add(shell);
}
