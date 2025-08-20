// src/components/collision/Particle.js
export default class Particle {
  constructor({ id, x, y, vx = 0, vy = 0, radius = 12, color = null }) {
    this.id = id ?? Math.random().toString(36).slice(2, 9); 
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.mass = Math.PI * radius * radius; // mass proportional to area 
    this.color = color || Particle.randomColor();
  }

  static randomColor() {
    // pastel-ish palette
    const palettes = [
      "#3b82f6", // blue
      "#ef4444", // red
      "#10b981", // green
      "#f59e0b", // amber
      "#8b5cf6", // purple
      "#06b6d4", // teal
    ];
    return palettes[Math.floor(Math.random() * palettes.length)];
  }

  speed() {
    return Math.hypot(this.vx, this.vy);
  }
}
