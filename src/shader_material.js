import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';

export const orbMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time:         { value: 0.0 },
    glowColor:    { value: new THREE.Color('#90f1ff') },
    coreColor:    { value: new THREE.Color('#111125') },
    pulse:        { value: 1.0 },
    emotionState: { value: 0.0 },
    driftFactor:  { value: 0.0 }
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
    uniform float emotionState;
    uniform float driftFactor;

    varying vec3 vNormal;
    varying vec3 vPos;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      // Directional rim lighting
      float rim = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);

      // Multi-layer breath distortion
      float breathFreq = mix(0.9, 2.0, emotionState);
      float breathA = sin(time * 0.2 + vPos.y * 1.5);
      float breathB = noise(vPos.xy * 3.0 + time * 0.25);
      float breath = (0.5 + 0.3 * breathA + 0.2 * breathB);

      // Subsurface shimmer
      float shimmer = noise(vPos.xy * 4.0 + time * 0.5 + driftFactor) * 0.06;

      // Pulse wave
      float pulseWave = sin(time * breathFreq + length(vPos.xy)) * 0.5 + 0.5;

      // Inner core modulation
      float coreFog = smoothstep(1.2, 0.0, length(vPos)) * (0.4 + emotionState * 0.4);

      // Flicker variation
      float flicker = 0.02 * sin(dot(vPos.xy, vec2(12.0, 4.0)) + time * 3.0);

      // Final composite intensity
      float intensity = clamp(
        rim * pulseWave * breath +
        shimmer +
        coreFog +
        flicker,
        0.0, 1.0
      );

      // Slight chromatic shift with emotionState
      vec3 shift = vec3(0.05 * emotionState, -0.02 * emotionState, 0.03 * emotionState);
      vec3 finalColor = mix(coreColor, glowColor + shift, intensity);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});
