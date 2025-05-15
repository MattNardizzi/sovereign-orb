import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';

export const orbMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0.0 },
    glowColor: { value: new THREE.Color('#90f1ff') },   // Emotion-linked
    coreColor: { value: new THREE.Color('#111125') },   // Dark intelligence base
    pulse: { value: 2.0 }                                // Mic + mood input
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

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) +
             (c - a) * u.y * (1.0 - u.x) +
             (d - b) * u.x * u.y;
    }

    void main() {
      // Respiration: rhythmic internal glow
      float breath = sin(time * 0.75 + vPos.y * 2.0) * 0.5 + 0.5;

      // Center brightness boost
      float centerGlow = 1.0 - length(vPos.xy) * 0.8;

      // Angular light falloff (front-facing normal = bright)
      float edgeGlow = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);

      // Flickering shimmer from time-based noise
      float shimmer = noise(vPos.xy * 5.0 + time * 0.3) * 0.1;

      // Combined visible energy
      float intensity = clamp((centerGlow + edgeGlow) * breath * pulse + shimmer, 0.0, 1.0);

      // Final glow color
      vec3 color = mix(coreColor, glowColor, intensity);

      gl_FragColor = vec4(color, 1.0);
    }
  `,
  transparent: false,
  depthWrite: true,
  side: THREE.FrontSide
});
