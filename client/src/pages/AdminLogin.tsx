import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Lock, Eye, EyeOff, ArrowRight, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663455453024/WejihdAdoNhfTwYK.png";

// ─── CAPTCHA matemático ────────────────────────────────────────────────────────
function generateCaptcha() {
  const ops = ["+", "-", "×"] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number;
  if (op === "+") {
    a = Math.floor(Math.random() * 12) + 1;
    b = Math.floor(Math.random() * 12) + 1;
    answer = a + b;
  } else if (op === "-") {
    a = Math.floor(Math.random() * 12) + 5;
    b = Math.floor(Math.random() * a) + 1;
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * 9) + 2;
    b = Math.floor(Math.random() * 5) + 2;
    answer = a * b;
  }
  return { question: `${a} ${op} ${b}`, answer };
}

function FloatingOrb({ className }: { className?: string }) {
  return (
    <div className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`} />
  );
}

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
  }, []);

  const loginMutation = trpc.auth.adminLogin.useMutation({
    onSuccess: () => {
      setSuccess(true);
      // Hard redirect so the admin session cookie is picked up correctly
      setTimeout(() => { window.location.href = "/admin"; }, 700);
    },
    onError: (err) => {
      setError(err.message || "Credenciales incorrectas");
      refreshCaptcha();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validar CAPTCHA
    const captchaAnswer = parseInt(captchaInput.trim(), 10);
    if (isNaN(captchaAnswer) || captchaAnswer !== captcha.answer) {
      setError("La respuesta al CAPTCHA no es correcta");
      refreshCaptcha();
      return;
    }

    loginMutation.mutate({ email: email.trim(), password, rememberMe });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
      {/* Fondo decorativo */}
      <FloatingOrb className="w-96 h-96 bg-[#c9a96e] -top-32 -right-32" />
      <FloatingOrb className="w-64 h-64 bg-[#c9a96e] bottom-0 -left-20" />
      <FloatingOrb className="w-48 h-48 bg-white top-1/2 left-1/4" />

      {/* Grid sutil de fondo */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Tarjeta de login */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Borde dorado sutil */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#c9a96e]/30 via-transparent to-[#c9a96e]/10 p-px">
          <div className="absolute inset-0 rounded-2xl bg-[#111111]" />
        </div>

        <div className="relative rounded-2xl bg-[#111111] border border-white/8 overflow-hidden">
          {/* Franja dorada superior */}
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#c9a96e] to-transparent" />

          <div className="px-8 py-10">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col items-center mb-8"
            >
              <img
                src={LOGO_URL}
                alt="Elora Smart"
                className="h-14 w-auto mb-4"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              <div className="flex items-center gap-1.5 mt-1">
                <div className="h-px w-12 bg-white/10" />
                <p className="font-body text-[9px] uppercase tracking-[0.5em] text-white/25">
                  Panel de administración
                </p>
                <div className="h-px w-12 bg-white/10" />
              </div>
            </motion.div>

            {/* Título */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="text-center mb-8"
            >
              <h1 className="font-display text-2xl uppercase tracking-wide text-white mb-2">
                Acceso seguro
              </h1>
              <p className="font-body text-sm text-white/40 leading-relaxed">
                Introduce tus credenciales de administrador para continuar.
              </p>
            </motion.div>

            {/* Indicadores de seguridad */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="flex items-center justify-center gap-6 mb-8"
            >
              <div className="flex items-center gap-1.5 text-white/25">
                <Shield className="w-3.5 h-3.5 text-[#c9a96e]/60" />
                <span className="font-body text-[10px] uppercase tracking-widest">Cifrado</span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1.5 text-white/25">
                <Lock className="w-3.5 h-3.5 text-[#c9a96e]/60" />
                <span className="font-body text-[10px] uppercase tracking-widest">SSL</span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1.5 text-white/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 inline-block" />
                <span className="font-body text-[10px] uppercase tracking-widest">Seguro</span>
              </div>
            </motion.div>

            {/* Formulario */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col gap-4"
            >
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[10px] uppercase tracking-[0.3em] text-white/40">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="admin@elorasmart.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c9a96e]/50 focus:bg-white/8 transition-all duration-200"
                />
              </div>

              {/* Contraseña */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-[10px] uppercase tracking-[0.3em] text-white/40">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-12 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c9a96e]/50 focus:bg-white/8 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Recordar sesión */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRememberMe(v => !v)}
                  className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ${
                    rememberMe ? "bg-[#c9a96e]" : "bg-white/10"
                  }`}
                  aria-checked={rememberMe}
                  role="switch"
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                      rememberMe ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="font-body text-xs text-white/40 select-none">
                  Recordar inicio de sesión
                  <span className="block text-[10px] text-white/20">
                    {rememberMe ? "Sesión activa 30 días" : "Sesión activa 8 horas"}
                  </span>
                </span>
              </div>

              {/* CAPTCHA matemático */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-body text-[10px] uppercase tracking-[0.3em] text-white/40">
                    Verificación
                  </label>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="flex items-center gap-1 text-white/25 hover:text-white/50 transition-colors outline-none"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span className="font-body text-[9px] uppercase tracking-widest">Nueva</span>
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 bg-white/5 border border-white/10 rounded-lg px-5 py-3 font-display text-lg text-[#c9a96e] tracking-wide select-none">
                    {captcha.question} = ?
                  </div>
                  <input
                    type="number"
                    value={captchaInput}
                    onChange={e => setCaptchaInput(e.target.value)}
                    required
                    placeholder="?"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c9a96e]/50 focus:bg-white/8 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="font-body text-xs text-red-400">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Botón de acceso */}
              <button
                type="submit"
                disabled={loginMutation.isPending || success}
                className="group relative overflow-hidden rounded-xl py-4 px-6 font-body text-sm uppercase tracking-[0.3em] transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                style={{
                  background: success
                    ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                    : "linear-gradient(135deg, #d4a96a 0%, #b8935a 50%, #c9a96e 100%)",
                  boxShadow: "0 8px 32px rgba(201,169,110,0.35), 0 2px 8px rgba(0,0,0,0.4)",
                }}
              >
                {/* Shimmer */}
                {!loginMutation.isPending && !success && (
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                )}
                <span className="relative flex items-center justify-center gap-3 text-white font-semibold">
                  {success ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Acceso concedido
                    </>
                  ) : loginMutation.isPending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      Acceder al panel
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </span>
              </button>
            </motion.form>

            {/* Nota de seguridad */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-center font-body text-[10px] text-white/20 mt-6 leading-relaxed"
            >
              Solo usuarios autorizados pueden acceder a este panel.
              <br />
              La sesión se cierra automáticamente tras 7 días.
            </motion.p>
          </div>

          {/* Franja dorada inferior */}
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#c9a96e]/40 to-transparent" />
        </div>
      </motion.div>

      {/* Volver a la web */}
      <motion.a
        href="/"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 font-body text-[10px] uppercase tracking-[0.4em] text-white/20 hover:text-white/40 transition-colors"
      >
        ← Volver a la web
      </motion.a>
    </div>
  );
}
