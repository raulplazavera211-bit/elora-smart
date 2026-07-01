import { useEffect, useRef, useState } from "react";

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number; // ms per character
  delay?: number; // ms before starting
  tag?: "h1" | "h2" | "h3" | "p" | "span";
  cursor?: boolean;
}

export function TypewriterText({
  text,
  className = "",
  speed = 35,
  delay = 0,
  tag: Tag = "h2",
  cursor = true,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLElement>(null);
  // Track previous text to detect changes (e.g. language switch or i18n init)
  const prevTextRef = useRef(text);

  // When text changes (language switch / i18n ready), reset and re-trigger
  useEffect(() => {
    if (prevTextRef.current !== text) {
      prevTextRef.current = text;
      setStarted(false);
      setDisplayed("");
      setDone(false);
    }
  }, [text]);

  // Trigger when element enters viewport (re-runs when started resets to false)
  useEffect(() => {
    if (started) return; // already running, no need to re-observe
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          setTimeout(() => setStarted(true), delay);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, started]);

  // Typewriter effect
  useEffect(() => {
    if (!started) return;
    let i = 0;
    setDisplayed("");
    setDone(false);
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed]);

  return (
    <Tag ref={ref as any} className={className}>
      {displayed}
      {cursor && !done && (
        <span
          className="inline-block w-[2px] h-[0.85em] bg-current align-middle ml-[2px] animate-pulse"
          aria-hidden="true"
        />
      )}
    </Tag>
  );
}
