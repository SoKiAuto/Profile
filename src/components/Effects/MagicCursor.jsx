import React, { useRef, useEffect } from "react";

const COLORS = [
  "#050A1A",  // very dark navy almost black
  "#0B1B3F",  // deep navy blue
  "#112A60",  // rich medium-dark blue
  "#1B3B8A",  // stronger blue
  "#274CBB",  // deep royal blue
];

// FluidBlob class, enhanced for spill and blast effect
class FluidBlob {
  constructor(x, y, color, vx = null, vy = null, size = null) {
    this.x = x;
    this.y = y;
    this.size = size || Math.random() * 25 + 25;
    this.color = color;
    this.life = 90;
    // velocity: if given use it (for blast), else random slow spill velocities
    this.vx = vx !== null ? vx : (Math.random() - 0.5) * 0.6;
    this.vy = vy !== null ? vy : Math.random() * 1.8 + 0.7;
    this.alpha = 1;
    this.angle = Math.random() * Math.PI * 2;
    this.angleSpeed = (Math.random() - 0.5) * 0.06;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    this.alpha = this.life / 90;

    this.angle += this.angleSpeed;

    // Morph size for more fluid, spill-like shape
    this.morphSizeX = this.size * (1 + 0.6 * Math.sin(this.angle));
    this.morphSizeY = this.size * (1.8 + 0.8 * Math.cos(this.angle));
  }

  draw(ctx) {
    const rgbaCenter = hexToRgba(this.color, this.alpha * 0.9);
    const rgbaEdge = hexToRgba(this.color, 0);

    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      this.morphSizeX * 0.1,
      this.x,
      this.y,
      this.morphSizeX
    );
    gradient.addColorStop(0, rgbaCenter);
    gradient.addColorStop(1, rgbaEdge);

    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.ellipse(
      this.x,
      this.y,
      this.morphSizeX,
      this.morphSizeY,
      Math.PI / 6, // tilted 30deg downward for spill look
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.restore();
  }

  isAlive() {
    return this.life > 0 && this.alpha > 0;
  }
}

function hexToRgba(hex, alpha) {
  const cleanHex = hex.replace("#", "");
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const MagicCursor = () => {
  const canvasRef = useRef(null);
  const blobs = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", resize);

    let mouseX = width / 2;
    let mouseY = height / 2;

    // Spawn blobs around the cursor, randomly spread to create wider spill area
    const spawnBlobs = (x, y, count = 5) => {
      for (let i = 0; i < count; i++) {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        // Add some randomness around cursor for wider effect
        const offsetX = (Math.random() - 0.5) * 40; // spread 40px horizontally
        const offsetY = (Math.random() - 0.5) * 40; // spread 40px vertically
        blobs.current.push(new FluidBlob(x + offsetX, y + offsetY, color));
      }
    };

    // Mouse move: spawn fluid blobs with wider spread and random colors
    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      spawnBlobs(mouseX, mouseY, 6);
    };

    // Mouse click: create a blast — many blobs shooting outward fast!
    const onClick = (e) => {
      const blastCount = 25;
      for (let i = 0; i < blastCount; i++) {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        // Random angle for explosion
        const angle = Math.random() * 2 * Math.PI;
        // Velocity magnitude for blast (bigger than normal vx, vy)
        const speed = Math.random() * 6 + 4;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        blobs.current.push(new FluidBlob(e.clientX, e.clientY, color, vx, vy, 40));
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      blobs.current = blobs.current.filter((blob) => blob.isAlive());
      blobs.current.forEach((blob) => {
        blob.update();
        blob.draw(ctx);
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
        cursor: "none",
        backgroundColor: "transparent",
      }}
    />
  );
};

export default MagicCursor;
