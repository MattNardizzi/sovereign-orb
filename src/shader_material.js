import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';

export const orbMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0.0 },
    glowColor: { value: new THREE.Color('#3ee8ff') },
    coreColor: { value: new THREE.Color('#12131b') },
    pulse: { value: 1.0 },
    breath: { value: 0.0 }
  },
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;

    uniform float time;
    uniform float pulse;
    uniform float breath;
    uniform vec3 glowColor;
    uniform vec3 coreColor;

    varying vec3 vNormal;

    void main() {
      float angle = dot(vNormal, vec3(0.0, 0.0, 1.0));
      float intensity = pow(1.0 - angle, 2.0);
      float breathGlow = 0.3 + 0.3 * sin(time * 1.5 + breath * 6.2831);
      vec3 color = mix(coreColor, glowColor, intensity + breathGlow);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});
