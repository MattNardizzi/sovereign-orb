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

    // Hash for pseudo-random noise
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    // 2D Perlin-style noise
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) +
             (c - a)* u.y * (1.0 - u.x) +
             (d - b) * u.x * u.y;
    }

    void main() {
      // Core breathing based on vertical position and time
      float breath = sin(time * 0.8 + vPos.y * 2.0) * 0.5 + 0.5;

      // Angle-based glow (center → edge)
      float angle = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.5);

      // Radial core pulse based on position & time
      float corePulse = sin(length(vPos.xy) * 8.0 - time * 2.0) * 0.3 + 0.7;

      // Deep shimmer using time-based 2D noise
      float shimmer = noise(vPos.xy * 4.5 + time * 0.2) * 0.08;

      // Surface diffraction
      float halo = smoothstep(0.0, 1.0, pow(length(vPos.xy), 4.0));

      // Total energy intensity
      float intensity = clamp(angle * breath * corePulse * pulse + shimmer, 0.0, 1.0);

      vec3 glow = mix(coreColor, glowColor, intensity);
      glow += halo * 0.1;

      gl_FragColor = vec4(glow, 1.0);
    }
  `,
  transparent: false,
  depthWrite: true,
  side: THREE.FrontSide
});
