import { useEffect, useState } from "react";

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663455453024/WejihdAdoNhfTwYK.png";

export function Loader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'enter' | 'loading' | 'exit'>('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('loading'), 100);
    const t2 = setTimeout(() => setPhase('exit'), 1200);
    const t3 = setTimeout(() => onComplete(), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        phase === 'exit' ? 'opacity-0 -translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="relative flex flex-col items-center">
        <div className={`relative transition-all duration-1000 ease-out ${
          phase === 'enter' ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'
        }`}>
          <img src={LOGO_URL} alt="" className="h-10 md:h-12 w-auto opacity-10 saturate-0" />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              clipPath: phase === 'loading' ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
              transition: 'clip-path 2s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: '300ms'
            }}
          >
            <img src={LOGO_URL} alt="Elora Smart" className="h-10 md:h-12 w-auto object-cover object-bottom" />
          </div>
        </div>

        <div className={`mt-10 overflow-hidden h-px w-32 bg-border/50 relative transition-opacity duration-500 delay-200 ${
          phase === 'exit' ? 'opacity-0' : 'opacity-100'
        }`}>
          <div className={`absolute top-0 bottom-0 left-0 w-full bg-foreground/60 transform origin-left scale-x-0 ${
            phase !== 'enter' ? 'animate-[fillBar_2.2s_cubic-bezier(0.16,1,0.3,1)_forwards]' : ''
          }`} />
        </div>

        <p className={`mt-6 font-body text-[10px] uppercase tracking-[0.2em] text-foreground/40 transition-all duration-700 delay-300 ${
          phase === 'enter' ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
        }`}>
          Preparando confort
        </p>
      </div>
    </div>
  );
}
