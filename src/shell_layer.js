import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';

export function addReflectiveShell(scene) {
  const shellGeo = new THREE.SphereGeometry(2.03, 128, 128);
  const shellMat = new THREE.MeshPhysicalMaterial({
    transparent: true,
    opacity: 0.15,
    roughness: 0.05,
    metalness: 0.8,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    transmission: 1.0,
    reflectivity: 1.0,
    thickness: 0.6
  });

  const shell = new THREE.Mesh(shellGeo, shellMat);
  scene.add(shell);
}
