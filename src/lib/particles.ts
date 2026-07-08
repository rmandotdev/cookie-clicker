export interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
}

let nextId = 0;

function randn(): number {
  return (
    Math.sqrt(-2 * Math.log(Math.random())) *
    Math.cos(2 * Math.PI * Math.random())
  );
}

export function createParticle(
  clientX: number,
  clientY: number,
  element: Element,
): Particle {
  const rect = element.getBoundingClientRect();
  const angle = Math.random() * 2 * Math.PI;
  const r = Math.max(0, 20 + randn() * 6);
  return {
    id: nextId++,
    x: clientX - rect.left + Math.cos(angle) * r,
    y: clientY - rect.top + Math.sin(angle) * r,
    delay: Math.random() * 0.04,
  };
}

export const PARTICLE_LIFETIME = 800;
