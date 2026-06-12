/**
 * WaveCanvas — Animación de olas de agua multicapa con canvas
 * Diseño: fondo oscuro con olas azul-agua semitransparentes
 * Reacciona al scroll para efecto parallax
 */
import { useEffect, useRef } from "react";

interface WaveLayer {
  amplitude: number;
  wavelength: number;
  speed: number;
  phase: number;
  color: string;
  yBase: number; // 0-1 relativo a la altura del canvas
}

export function WaveCanvas({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const layers: WaveLayer[] = [
      // Ola de fondo grande y lenta
      { amplitude: 38, wavelength: 0.7, speed: 0.4, phase: 0,    color: "rgba(14,165,233,0.10)", yBase: 0.55 },
      // Ola media
      { amplitude: 28, wavelength: 1.1, speed: 0.65, phase: 1.2, color: "rgba(56,189,248,0.13)", yBase: 0.62 },
      // Ola rápida más pequeña
      { amplitude: 18, wavelength: 1.6, speed: 1.0,  phase: 2.4, color: "rgba(125,211,252,0.10)", yBase: 0.68 },
      // Ola de espuma superior muy rápida
      { amplitude: 10, wavelength: 2.2, speed: 1.5,  phase: 0.8, color: "rgba(186,230,253,0.08)", yBase: 0.72 },
    ];

    let running = true;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    resize();
    window.addEventListener("resize", resize);

    function drawWave(layer: WaveLayer, t: number, parallax: number) {
      if (!canvas || !ctx) return;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      const baseY = H * (layer.yBase + parallax * 0.08);

      ctx.beginPath();
      ctx.moveTo(0, H);

      for (let x = 0; x <= W; x += 2) {
        const y =
          baseY +
          Math.sin((x / W) * Math.PI * 2 * layer.wavelength + t * layer.speed + layer.phase) * layer.amplitude +
          Math.sin((x / W) * Math.PI * 4 * layer.wavelength + t * layer.speed * 0.7 + layer.phase * 1.3) * (layer.amplitude * 0.4);
        ctx.lineTo(x, y);
      }

      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fillStyle = layer.color;
      ctx.fill();
    }

    function animate(ts: number) {
      if (!running || !canvas || !ctx) return;
      timeRef.current = ts / 1000;
      const t = timeRef.current;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;

      ctx.clearRect(0, 0, W, H);

      // Gradiente de fondo oscuro (agua profunda)
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "rgba(2,8,23,0)");
      grad.addColorStop(0.4, "rgba(3,15,35,0.55)");
      grad.addColorStop(1, "rgba(2,12,28,0.85)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Dibujar capas de olas de atrás hacia adelante
      layers.forEach((layer) => drawWave(layer, t, scrollProgress));

      // Brillo de luz en la superficie (shimmer)
      const shimmerGrad = ctx.createLinearGradient(0, H * 0.45, W, H * 0.65);
      shimmerGrad.addColorStop(0, "rgba(125,211,252,0)");
      shimmerGrad.addColorStop(0.3 + Math.sin(t * 0.3) * 0.1, "rgba(125,211,252,0.06)");
      shimmerGrad.addColorStop(0.6 + Math.cos(t * 0.2) * 0.1, "rgba(56,189,248,0.04)");
      shimmerGrad.addColorStop(1, "rgba(125,211,252,0)");
      ctx.fillStyle = shimmerGrad;
      ctx.fillRect(0, 0, W, H);

      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [scrollProgress]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: "normal" }}
    />
  );
}
