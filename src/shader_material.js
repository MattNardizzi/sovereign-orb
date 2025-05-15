import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';

export const orbMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0.0 },
    glowColor: { value: new THREE.Color('#90f1ff') },
    coreColor: { value: new THREE.Color('#111125') },
    pulse: { value: 2.0 }
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPos;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 glowColor;
    uniform vec3 coreColor;
    uniform float pulse;
    varying vec3 vNormal;
    varying vec3 vPos;

    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
      float breathing = sin(time * 0.75 + vPos.y * 1.5) * 0.5 + 0.5;
      float angle = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
      float shimmer = noise(vPos.xy + time * 0.03) * 0.05;
      float intensity = clamp(angle * breathing * pulse + shimmer, 0.0, 1.0);
      vec3 color = mix(coreColor, glowColor, intensity);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});
