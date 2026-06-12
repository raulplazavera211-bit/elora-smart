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
      // Ola de fondo grande y lenta — muy sutil sobre fondo claro
      { amplitude: 32, wavelength: 0.7, speed: 0.35, phase: 0,    color: "rgba(14,165,233,0.06)", yBase: 0.52 },
      // Ola media
      { amplitude: 22, wavelength: 1.1, speed: 0.55, phase: 1.2, color: "rgba(56,189,248,0.07)", yBase: 0.60 },
      // Ola rápida más pequeña
      { amplitude: 14, wavelength: 1.6, speed: 0.85, phase: 2.4, color: "rgba(125,211,252,0.06)", yBase: 0.67 },
      // Ola de espuma superior muy rápida
      { amplitude: 8,  wavelength: 2.2, speed: 1.3,  phase: 0.8, color: "rgba(186,230,253,0.05)", yBase: 0.73 },
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

      // Sin gradiente de fondo: el canvas es transparente para no tapar el bg-muted

      // Dibujar capas de olas de atrás hacia adelante
      layers.forEach((layer) => drawWave(layer, t, scrollProgress));

      // Shimmer muy sutil en la superficie
      const shimmerGrad = ctx.createLinearGradient(0, H * 0.45, W, H * 0.65);
      shimmerGrad.addColorStop(0, "rgba(125,211,252,0)");
      shimmerGrad.addColorStop(0.3 + Math.sin(t * 0.3) * 0.1, "rgba(125,211,252,0.03)");
      shimmerGrad.addColorStop(0.6 + Math.cos(t * 0.2) * 0.1, "rgba(56,189,248,0.02)");
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
