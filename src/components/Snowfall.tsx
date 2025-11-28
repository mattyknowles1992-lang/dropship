"use client";

import { useEffect, useRef } from "react";

export function Snowfall() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const flakes: { x: number; y: number; r: number; s: number }[] = [];
    const FLAKE_COUNT = 120;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < FLAKE_COUNT; i++) {
      flakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 1 + Math.random() * 2.5,
        s: 0.5 + Math.random() * 1.5,
      });
    }

    const update = () => {
      for (const f of flakes) {
        f.y += f.s;
        if (f.y > canvas.height) {
          f.y = -5;
          f.x = Math.random() * canvas.width;
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath();
      for (const f of flakes) {
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      }
      ctx.fill();
      update();
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-30"
      aria-hidden="true"
    />
  );
}
