'use client';

import { useRef, useEffect } from 'react';

// === CONFETTI ANIMATION ===
export default function Confetti() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const confettiCount = 120;
    const gravity = 0.4;
    const colors = ['#f02d9c', '#8acfd1', '#fbe2a7', '#ff6b9d', '#4ecdc4'];
    const confettiPieces = Array.from({ length: confettiCount }, () => ({
      x: Math.random() * canvas.width,
      y: -10,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 6,
      speedY: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
    }));
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let stillFalling = false;
      confettiPieces.forEach((piece) => {
        piece.y += piece.speedY;
        piece.x += piece.speedX;
        piece.speedY += gravity;
        piece.rotation += piece.rotationSpeed;
        if (piece.y < canvas.height) stillFalling = true;
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate((piece.rotation * Math.PI) / 180);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
        ctx.restore();
      });
      if (stillFalling) animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);
  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]" />;
};