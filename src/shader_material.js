import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';

export const orbMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0.0 },
    glowColor: { value: new THREE.Color('#3ee8ff') },
    coreColor: { value: new THREE.Color('#12131b') },
    pulse: { value: 1.0 },
    breath: { value: 0.0 },
    noiseStrength: { value: 0.5 }
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;

    uniform float time;
    uniform float pulse;
    uniform float breath;
    uniform float noiseStrength;
    uniform vec3 glowColor;
    uniform vec3 coreColor;

    varying vec3 vNormal;
    varying vec3 vPosition;

    // Noise (simple hash)
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
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      float intensity = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
      
      // Breathing core effect
      float breathGlow = 0.3 + 0.3 * sin(time * 1.5 + breath * 6.2831);
      
      // Noise for subtle turbulence
      float n = noise(vPosition.xy * 2.0 + time * 0.2);

      // Core and shell glow blend
      vec3 color = mix(coreColor, glowColor, intensity + breathGlow + n * noiseStrength);

      // Subtle flicker/pulse
      float flicker = sin(time * 10.0 + length(vPosition)) * 0.03;

      gl_FragColor = vec4(color + flicker, 1.0);
    }
  `,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});
