import { useState } from "react";
import { Users, Zap, Heart, TrendingUp, ExternalLink, Clock, Radio, Star, Shield, ChevronRight, X, UserPlus, ListPlus, Rocket } from "lucide-react";
import { BeeLogo } from "./components/brand/BeeLogo";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Streamer {
  id: number;
  name: string;
  game: string;
  viewers: number;
  language: string;
  avatar: string;
  tags: string[];
  status: "looking" | "streaming" | "ready";
  description: string;
  followers: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const STREAMERS: Streamer[] = [
  {
    id: 1,
    name: "MielSilvestreTv",
    game: "Minecraft",
    viewers: 12,
    language: "ES",
    avatar: "MS",
    tags: ["Chill", "Survival", "Family"],
    status: "looking",
    description: "Construyendo mi primera granja de abejas en survival. ¡Buenas vibras!",
    followers: 241,
  },
  {
    id: 2,
    name: "ZumbidoGamer",
    game: "Valorant",
    viewers: 8,
    language: "ES",
    avatar: "ZG",
    tags: ["FPS", "Ranked", "Táctico"],
    status: "ready",
    description: "Subiendo de rango en Platinum. Acepto raids mientras juego.",
    followers: 118,
  },
  {
    id: 3,
    name: "AbejitaRPG",
    game: "Final Fantasy XVI",
    viewers: 19,
    language: "ES",
    avatar: "AR",
    tags: ["RPG", "Historia", "Story"],
    status: "looking",
    description: "Primera run del juego, sin spoilers por favor. Open raids welcome!",
    followers: 387,
  },
  {
    id: 4,
    name: "NectarCode",
    game: "Just Chatting",
    viewers: 5,
    language: "ES/EN",
    avatar: "NC",
    tags: ["Dev", "Coding", "Programación"],
    status: "looking",
    description: "Live coding una app en React. Buscando comunidad tech en Twitch.",
    followers: 94,
  },
  {
    id: 5,
    name: "PolenPlays",
    game: "League of Legends",
    viewers: 14,
    language: "ES",
    avatar: "PP",
    tags: ["MOBA", "Diamond", "Competitivo"],
    status: "ready",
    description: "Partidas ranked Diamond. Contenido serio pero entretenido.",
    followers: 512,
  },
  {
    id: 6,
    name: "ColmenaRetro",
    game: "The Legend of Zelda: OoT",
    viewers: 7,
    language: "ES",
    avatar: "CR",
    tags: ["Retro", "Speedrun", "Nostalgia"],
    status: "looking",
    description: "Speedrun cualquier% de OoT. Canal de retro gaming puro.",
    followers: 163,
  },
];

const STATS = [
  { label: "Raids hoy", value: "47", icon: Zap },
  { label: "Canales ayudados", value: "312", icon: Heart },
  { label: "Viewers enviados", value: "2.8K", icon: Users },
  { label: "Raids este mes", value: "1.4K", icon: TrendingUp },
];

// ─── Hexagon SVG Background ───────────────────────────────────────────────────

function HexGrid() {
  const hexes = [];
  const cols = 12;
  const rows = 8;
  const size = 48;
  const w = size * 2;
  const h = Math.sqrt(3) * size;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * w * 0.75 + w / 2;
      const y = r * h + (c % 2 === 0 ? h / 2 : 0) + h / 2;
      const points = Array.from({ length: 6 }, (_, i) => {
        const angle = (Math.PI / 180) * (60 * i - 30);
        return `${x + size * 0.9 * Math.cos(angle)},${y + size * 0.9 * Math.sin(angle)}`;
      }).join(" ");
      hexes.push(<polygon key={`${r}-${c}`} points={points} />);
    }
  }

  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ fill: "none", stroke: "#F59E0B", strokeWidth: 1 }}
    >
      {hexes}
    </svg>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Streamer["status"] }) {
  const map = {
    looking: { label: "Buscando Raid", color: "bg-amber-400/20 text-amber-400 border-amber-400/30" },
    ready: { label: "Listo para recibir", color: "bg-emerald-400/20 text-emerald-400 border-emerald-400/30" },
    streaming: { label: "En vivo", color: "bg-red-400/20 text-red-400 border-red-400/30" },
  };
  const { label, color } = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      <span className="size-1.5 rounded-full bg-current animate-pulse" />
      {label}
    </span>
  );
}

// ─── Streamer Card ────────────────────────────────────────────────────────────

function StreamerCard({ streamer, onRaid }: { streamer: Streamer; onRaid: (s: Streamer) => void }) {
  return (
    <div className="group relative bg-card border border-border rounded-2xl p-5 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_24px_rgba(245,158,11,0.12)] flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-900 font-bold text-sm font-mono flex-shrink-0 shadow-lg shadow-amber-500/20">
            {streamer.avatar}
          </div>
          <div>
            <h3 className="font-semibold text-foreground leading-tight" style={{ fontFamily: "Fredoka, sans-serif" }}>
              {streamer.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{streamer.game}</p>
          </div>
        </div>
        <StatusBadge status={streamer.status} />
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">{streamer.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {streamer.tags.map((tag) => (
          <span key={tag} className="px-2 py-0.5 bg-secondary rounded-md text-xs text-accent border border-border">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-border">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="size-3" />
            {streamer.viewers} viewers
          </span>
          <span className="flex items-center gap-1">
            <Star className="size-3" />
            {streamer.followers} seguidores
          </span>
          <span className="font-mono text-[10px] bg-secondary px-1.5 py-0.5 rounded border border-border">
            {streamer.language}
          </span>
        </div>
      </div>

      <button
        onClick={() => onRaid(streamer)}
        className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-accent transition-colors duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-amber-500/20"
        style={{ fontFamily: "Fredoka, sans-serif" }}
      >
        <Zap className="size-4" />
        Hacer Raid
      </button>
    </div>
  );
}

// ─── Raid Modal ───────────────────────────────────────────────────────────────

function RaidModal({ streamer, onClose }: { streamer: Streamer; onClose: () => void }) {
  const [sent, setSent] = useState(false);

  function handleConfirm() {
    setSent(true);
    setTimeout(onClose, 2200);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-amber-500/10 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <X className="size-5" />
        </button>

        {sent ? (
          <div className="text-center py-4">
            <div className="flex justify-center mb-4">
              <BeeLogo size={56} />
            </div>
            <h3 className="text-2xl font-bold text-accent mb-2" style={{ fontFamily: "Fredoka, sans-serif" }}>
              ¡Raid enviado!
            </h3>
            <p className="text-muted-foreground text-sm">La colmena está en camino hacia <strong className="text-foreground">{streamer.name}</strong>. ¡Gracias por ayudar a crecer!</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6">
              <div className="size-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-900 font-bold font-mono text-lg shadow-lg shadow-amber-500/20">
                {streamer.avatar}
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "Fredoka, sans-serif" }}>
                  Raiding {streamer.name}
                </h3>
                <p className="text-sm text-muted-foreground">{streamer.game} · {streamer.viewers} viewers ahora</p>
              </div>
            </div>

            <div className="bg-secondary rounded-xl p-4 mb-6 border border-border">
              <p className="text-sm text-foreground leading-relaxed">&ldquo;{streamer.description}&rdquo;</p>
            </div>

            <div className="text-sm text-muted-foreground mb-6 flex items-start gap-2">
              <Shield className="size-4 text-primary flex-shrink-0 mt-0.5" />
              <span>Al hacer raid, envías a tu comunidad a apoyar un canal pequeño. Recuerda copiar el comando <code className="bg-muted px-1 rounded text-accent font-mono text-xs">/raid {streamer.name}</code> en tu chat de Twitch.</span>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:bg-accent transition-colors flex items-center justify-center gap-2"
              style={{ fontFamily: "Fredoka, sans-serif" }}
            >
              <Zap className="size-5" />
              Confirmar Raid — ¡Polenizar!
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Join Queue Modal ─────────────────────────────────────────────────────────

function JoinModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ channel: "", game: "", description: "", tags: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep(2);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-3xl p-8 max-w-lg w-full shadow-2xl shadow-amber-500/10 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <X className="size-5" />
        </button>

        {step === 2 ? (
          <div className="text-center py-4">
            <div className="flex justify-center mb-4">
            <BeeLogo size={56} />
            </div>
            <h3 className="text-2xl font-bold text-accent mb-2" style={{ fontFamily: "Fredoka, sans-serif" }}>
              ¡Bienvenido a BeeRaid!
            </h3>
            <p className="text-muted-foreground text-sm mb-6">Tu canal <strong className="text-foreground">/{form.channel}</strong> está en la cola. Otros streamers pronto vendrán a apoyarte.</p>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-accent transition-colors" style={{ fontFamily: "Fredoka, sans-serif" }}>
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-foreground mb-1" style={{ fontFamily: "Fredoka, sans-serif" }}>
              Unirme a la cola de raids
            </h3>
            <p className="text-sm text-muted-foreground mb-6">Comparte tu canal y recibe raids de otros streamers de la colmena.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Nombre de canal en Twitch</label>
                <input
                  required
                  value={form.channel}
                  onChange={e => setForm({ ...form, channel: e.target.value })}
                  placeholder="tu_canal"
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Juego o categoría</label>
                <input
                  required
                  value={form.game}
                  onChange={e => setForm({ ...form, game: e.target.value })}
                  placeholder="Minecraft, Just Chatting..."
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Descripción breve de tu stream</label>
                <textarea
                  required
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Cuéntale a la colmena qué estás haciendo hoy..."
                  rows={3}
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:bg-accent transition-colors flex items-center justify-center gap-2"
                style={{ fontFamily: "Fredoka, sans-serif" }}
              >
                <Heart className="size-5" />
                Entrar a la Colmena
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [raidTarget, setRaidTarget] = useState<Streamer | null>(null);
  const [showJoin, setShowJoin] = useState(false);
  const [filter, setFilter] = useState<"all" | "looking" | "ready">("all");

  const filtered = filter === "all" ? STREAMERS : STREAMERS.filter(s => s.status === filter);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden" style={{ fontFamily: "DM Sans, sans-serif" }}>

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BeeLogo size={28} />
            <span className="text-lg font-bold text-foreground" style={{ fontFamily: "Fredoka, sans-serif" }}>
              BeeRaid
            </span>
            <span className="hidden sm:block text-[10px] font-mono text-muted-foreground border border-border rounded px-1.5 py-0.5 ml-1">
              RAID MATCH
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#como-funciona" className="hover:text-foreground transition-colors">Cómo funciona</a>
            <a href="#streamers" className="hover:text-foreground transition-colors">Streamers</a>
            <a href="#stats" className="hover:text-foreground transition-colors">Estadísticas</a>
          </nav>

          <button
            onClick={() => setShowJoin(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-accent transition-colors shadow-lg shadow-amber-500/20"
            style={{ fontFamily: "Fredoka, sans-serif" }}
          >
            <Radio className="size-4" />
            <span>Unirme</span>
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <HexGrid />
        {/* glow blobs */}
        <div className="absolute top-1/3 left-1/4 size-96 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 size-64 bg-amber-400/6 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-secondary border border-border rounded-full px-4 py-1.5 text-sm text-accent mb-8">
              <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
              47 raids completados hoy · Comunidad activa
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold text-foreground leading-[1.05] mb-6" style={{ fontFamily: "Fredoka, sans-serif" }}>
              Pequeños canales,<br />
              <span className="text-primary">gran colmena.</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl">
              Conectamos streamers que empiezan su camino en Twitch para hacerse raids mutuamente y crecer juntos. Como abejas: solos somos pequeños, juntos somos imparables.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowJoin(true)}
                className="flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-accent transition-colors shadow-xl shadow-amber-500/25 text-base"
                style={{ fontFamily: "Fredoka, sans-serif" }}
              >
                <Heart className="size-5" />
                Unirme a la Colmena
              </button>
              <a
                href="#streamers"
                className="flex items-center gap-2 px-6 py-3.5 bg-secondary border border-border text-foreground rounded-xl font-semibold hover:border-primary/50 transition-colors text-base"
                style={{ fontFamily: "Fredoka, sans-serif" }}
              >
                Ver streamers
                <ChevronRight className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section id="stats" className="border-y border-border bg-secondary/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center justify-center py-7 gap-1 px-4">
                <div className="flex items-center gap-2 text-3xl font-bold text-primary" style={{ fontFamily: "Fredoka, sans-serif" }}>
                  <Icon className="size-5 text-muted-foreground" />
                  {value}
                </div>
                <p className="text-xs text-muted-foreground text-center">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section id="como-funciona" className="py-20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <p className="text-xs font-mono text-primary tracking-widest mb-3">CÓMO FUNCIONA</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground" style={{ fontFamily: "Fredoka, sans-serif" }}>
              Tres pasos. Un propósito.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
  {
    num: "01",
    icon: UserPlus,
    title: "Regístrate en la colmena",
    body: "Añade tu canal de Twitch, tu categoría y una breve descripción de tu stream. En menos de un minuto estás listo.",
  },
  {
    num: "02",
    icon: ListPlus,
    title: "Entra a la cola de raids",
    body: "Cuando termines tu stream, pon tu canal en modo disponible. Verás otros streamers haciendo lo mismo.",
  },
  {
    num: "03",
    icon: Rocket,
    title: "Recibe y da raids",
    body: "Haz raid a quien mejor encaje con tu audiencia. Gana visibilidad genuina y haz crecer toda la comunidad.",
  },
].map(({ num, icon: StepIcon, title, body }) => (
  <div key={num} className="relative bg-card border border-border rounded-2xl p-7 hover:border-primary/40 transition-all duration-300 group">
    <div className="absolute top-5 right-5 font-mono text-4xl font-bold text-border group-hover:text-primary/20 transition-colors select-none">
      {num}
    </div>
    <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
      <StepIcon className="size-6 text-primary" />
    </div>
    <h3 className="text-lg font-bold text-foreground mb-2" style={{ fontFamily: "Fredoka, sans-serif" }}>
      {title}
    </h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
  </div>
))}
          </div>
        </div>
      </section>

      {/* ── Streamers Queue ── */}
      <section id="streamers" className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-mono text-primary tracking-widest mb-3">COLA EN VIVO</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground" style={{ fontFamily: "Fredoka, sans-serif" }}>
                Streamers disponibles
              </h2>
              <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1.5">
                <Clock className="size-3.5" />
                Actualizado hace 2 minutos · {STREAMERS.length} streamers activos
              </p>
            </div>

            <div className="flex items-center gap-2 bg-secondary border border-border rounded-xl p-1">
              {(["all", "looking", "ready"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filter === f
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f === "all" ? "Todos" : f === "looking" ? "Buscan raid" : "Listos"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((s) => (
              <StreamerCard key={s.id} streamer={s} onRaid={setRaidTarget} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => setShowJoin(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary border border-border rounded-xl text-sm font-semibold text-foreground hover:border-primary/50 transition-colors"
              style={{ fontFamily: "Fredoka, sans-serif" }}
            >
              <ExternalLink className="size-4 text-muted-foreground" />
              ¿No ves tu categoría? Únete tú también
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <HexGrid />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/8 via-transparent to-amber-500/8 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex justify-center mb-6">
            <BeeLogo size={64} />
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: "Fredoka, sans-serif" }}>
            La colmena te espera.
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
            No importa cuántos seguidores tengas. Aquí todos empezamos desde cero y crecemos juntos. Cada abeja importa.
          </p>
          <button
            onClick={() => setShowJoin(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-accent transition-colors shadow-2xl shadow-amber-500/30"
            style={{ fontFamily: "Fredoka, sans-serif" }}
          >
            <Zap className="size-5" />
            Empezar gratis — Sin requisitos
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BeeLogo size={20} />
            <span className="font-bold text-foreground" style={{ fontFamily: "Fredoka, sans-serif" }}>BeeRaid</span>
            <span className="text-xs text-muted-foreground">· Hecho con amor por la comunidad</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <span>Comunidad de streamers / Twitch</span>
            <span className="font-mono bg-secondary px-2 py-1 rounded border border-border text-accent">v1.0</span>
          </div>
        </div>
      </footer>

      {/* ── Modals ── */}
      {raidTarget && <RaidModal streamer={raidTarget} onClose={() => setRaidTarget(null)} />}
      {showJoin && <JoinModal onClose={() => setShowJoin(false)} />}
    </div>
  );
}
