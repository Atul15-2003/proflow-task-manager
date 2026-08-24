import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Users,
  Shield,
  Zap,
  LayoutGrid,
  ArrowUpRight,
} from "lucide-react";

const Github = ({ size = 20, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);


/* ---------------------------------------------------------
   Design tokens
   ink    #0B1220  – deep navy, headline text / dark surfaces
   flow   #2F6FED  – primary brand blue
   current#22D3C8  – teal accent, represents motion / "flow"
   paper  #F6F7FB  – soft cool background
   mist   #8891A8  – secondary text
   amber  #F5A524  – "in progress" status accent
   Display: Space Grotesk | Body: Inter | Mono: JetBrains Mono
--------------------------------------------------------- */

const tokens = {
  ink: "#0B1220",
  flow: "#2F6FED",
  flowDark: "#1E4FC0",
  current: "#22D3C8",
  paper: "#F6F7FB",
  mist: "#8891A8",
  amber: "#F5A524",
  line: "#E4E7F0",
};

const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
    .ff-display { font-family: 'Space Grotesk', sans-serif; }
    .ff-body { font-family: 'Inter', sans-serif; }
    .ff-mono { font-family: 'JetBrains Mono', monospace; }

    @keyframes glideCard {
      0%   { transform: translateX(0); }
      28%  { transform: translateX(0); }
      45%  { transform: translateX(122px); }
      73%  { transform: translateX(122px); }
      90%  { transform: translateX(244px); }
      100% { transform: translateX(244px); }
    }
    @keyframes cardGhostIn {
      0% { opacity: 0; }
      3% { opacity: 1; }
      100% { opacity: 1; }
    }
    @keyframes pulseDot {
      0%, 100% { opacity: 0.35; }
      50% { opacity: 1; }
    }
    @keyframes floatChip {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-6px); }
    }
    .glide-card {
      animation: glideCard 6s cubic-bezier(.65,0,.35,1) infinite;
    }
    .pulse-dot { animation: pulseDot 1.8s ease-in-out infinite; }
    .float-chip { animation: floatChip 4s ease-in-out infinite; }

    @media (prefers-reduced-motion: reduce) {
      .glide-card, .pulse-dot, .float-chip { animation: none !important; }
    }
  `}</style>
);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

function Logo({ dark }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${tokens.flow}, ${tokens.current})` }}
      >
        <LayoutGrid size={16} color="#fff" strokeWidth={2.5} />
      </div>
      <span
        className="ff-display font-semibold text-lg tracking-tight"
        style={{ color: dark ? "#fff" : tokens.ink }}
      >
        ProFlow
      </span>
    </div>
  );
}

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className="sticky top-0 z-40 transition-all duration-300"
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        background: scrolled ? "rgba(246,247,251,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? `1px solid ${tokens.line}` : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8 ff-body text-sm font-medium" style={{ color: tokens.ink }}>
          <a href="#features" className="opacity-70 hover:opacity-100 transition-opacity">Features</a>
          <a href="#how" className="opacity-70 hover:opacity-100 transition-opacity">How it works</a>
          <Link to="/login" className="opacity-70 hover:opacity-100 transition-opacity">Sign in</Link>
        </nav>
        <Link
          to="/register"
          className="ff-body text-sm font-semibold px-4 py-2 rounded-lg text-white transition-transform hover:-translate-y-0.5"
          style={{ background: tokens.ink }}
        >
          Get started
        </Link>
      </div>
    </motion.header>
  );
}

function KanbanPreview() {
  return (
    <div
      className="relative rounded-2xl p-5 w-full max-w-sm"
      style={{ background: "#fff", border: `1px solid ${tokens.line}`, boxShadow: "0 24px 60px -20px rgba(11,18,32,0.25)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="ff-mono text-[11px] tracking-wide" style={{ color: tokens.mist }}>SPRINT-04 / BOARD</span>
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: tokens.current }} />
          <span className="w-2 h-2 rounded-full" style={{ background: tokens.flow }} />
          <span className="w-2 h-2 rounded-full" style={{ background: tokens.amber }} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 relative" style={{ minHeight: 176 }}>
        {["To do", "In progress", "Done"].map((col, i) => (
          <div key={col} className="flex flex-col gap-2">
            <span className="ff-body text-[11px] font-semibold uppercase tracking-wide" style={{ color: tokens.mist }}>
              {col}
            </span>
            <div className="rounded-lg h-14" style={{ background: tokens.paper, border: `1px dashed ${tokens.line}` }} />
            {i !== 1 && (
              <div className="rounded-lg h-10" style={{ background: tokens.paper, border: `1px dashed ${tokens.line}` }} />
            )}
          </div>
        ))}

        {/* The moving card — the signature element */}
        <div
          className="glide-card absolute top-[26px] left-0 w-[104px] rounded-lg px-2.5 py-2 z-10"
          style={{
            background: tokens.ink,
            boxShadow: "0 10px 24px -8px rgba(11,18,32,0.5)",
          }}
        >
          <div className="flex items-center gap-1 mb-1">
            <span className="pulse-dot w-1.5 h-1.5 rounded-full" style={{ background: tokens.current }} />
            <span className="ff-mono text-[9px] text-white/60">TSK-118</span>
          </div>
          <span className="ff-body text-[11px] text-white font-medium leading-tight block">
            Auth middleware
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: `1px solid ${tokens.line}` }}>
        <div className="flex -space-x-2">
          {[tokens.flow, tokens.current, tokens.amber].map((c, i) => (
            <div key={i} className="w-6 h-6 rounded-full border-2 border-white" style={{ background: c }} />
          ))}
        </div>
        <span className="ff-mono text-[11px]" style={{ color: tokens.mist }}>8/12 done</span>
      </div>
    </div>
  );
}

function StatChip() {
  return (
    <div
      className="float-chip absolute -right-4 -bottom-6 rounded-xl px-3.5 py-2.5 hidden sm:block"
      style={{ background: "#fff", border: `1px solid ${tokens.line}`, boxShadow: "0 16px 40px -16px rgba(11,18,32,0.3)" }}
    >
      <div className="flex items-center gap-2">
        <CheckCircle2 size={16} color={tokens.current} />
        <div className="leading-none">
          <div className="ff-display font-semibold text-sm" style={{ color: tokens.ink }}>+20 endpoints</div>
          <div className="ff-body text-[10px]" style={{ color: tokens.mist }}>shipped this sprint</div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: tokens.paper }}>
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `radial-gradient(${tokens.line} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          maskImage: "linear-gradient(to bottom, black, transparent 70%)",
        }}
      />
      <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32 grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 ff-mono text-[11px] px-3 py-1 rounded-full mb-6"
            style={{ background: "rgba(47,111,237,0.08)", color: tokens.flowDark }}
          >
            <span className="pulse-dot w-1.5 h-1.5 rounded-full" style={{ background: tokens.flow }} />
            BUILT FOR SMALL, FAST-MOVING TEAMS
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="ff-display font-semibold text-[2.6rem] leading-[1.08] md:text-[3.4rem] tracking-tight mb-6"
            style={{ color: tokens.ink }}
          >
            Work has a shape.
            <br />
            <span style={{ color: tokens.flow }}>ProFlow</span> keeps it visible.
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="ff-body text-lg leading-relaxed mb-9 max-w-md"
            style={{ color: tokens.mist }}
          >
            One board for every project — who's doing what, what's stuck, and what
            shipped. No status meetings required.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              to="/register"
              className="ff-body inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-3 rounded-xl transition-transform hover:-translate-y-0.5"
              style={{ background: tokens.ink }}
            >
              Create your first board
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="ff-body inline-flex items-center gap-2 text-sm font-semibold px-5 py-3 rounded-xl transition-colors hover:bg-white"
              style={{ color: tokens.ink, border: `1px solid ${tokens.line}` }}
            >
              Sign in
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative flex justify-center md:justify-end"
          initial={{ opacity: 0, x: 40, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.35, type: "spring", bounce: 0.15 }}
        >
          <KanbanPreview />
          <StatChip />
        </motion.div>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: LayoutGrid,
    title: "Boards that update themselves",
    body: "Drag a task to Done and the dashboard, the assignee's list, and the project stats all update — nobody has to report status by hand.",
  },
  {
    icon: Shield,
    title: "Roles that actually restrict",
    body: "Admins manage projects and members; everyone else sees and edits exactly what they're assigned. Enforced with JWT on every request, not just hidden in the UI.",
  },
  {
    icon: Zap,
    title: "Built on a real REST API",
    body: "20+ documented endpoints power the app end to end, so anything you can do on the board, you can also automate or integrate.",
  },
  {
    icon: Users,
    title: "One view per person, per project",
    body: "Each teammate opens ProFlow to their own workload — not a shared spreadsheet where everyone's tasks blur together.",
  },
];

function Features() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-24">
      <motion.div
        className="max-w-lg mb-14"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <span className="ff-mono text-[11px] tracking-wide" style={{ color: tokens.flow }}>FEATURES</span>
        <h2 className="ff-display font-semibold text-3xl md:text-[2.2rem] tracking-tight mt-3" style={{ color: tokens.ink }}>
          Less coordinating. More building.
        </h2>
      </motion.div>
      <motion.div
        className="grid sm:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <motion.div
            key={title}
            variants={itemVariants}
            className="rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            style={{ background: "#fff", border: `1px solid ${tokens.line}` }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
              style={{ background: tokens.paper }}
            >
              <Icon size={18} color={tokens.flow} />
            </div>
            <h3 className="ff-display font-semibold text-base mb-2" style={{ color: tokens.ink }}>{title}</h3>
            <p className="ff-body text-sm leading-relaxed" style={{ color: tokens.mist }}>{body}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

const STEPS = [
  { n: "01", title: "Create a project", body: "Name it, invite your team, pick who's admin. Takes under a minute." },
  { n: "02", title: "Assign the work", body: "Break it into tasks, drop them on the board, assign an owner to each." },
  { n: "03", title: "Watch it move", body: "Cards travel from To do to Done. The dashboard tracks the rest." },
];

function HowItWorks() {
  return (
    <section id="how" className="py-24" style={{ background: tokens.ink }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="max-w-lg mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="ff-mono text-[11px] tracking-wide" style={{ color: tokens.current }}>HOW IT WORKS</span>
          <h2 className="ff-display font-semibold text-3xl md:text-[2.2rem] tracking-tight mt-3 text-white">
            Three steps. No onboarding call.
          </h2>
        </motion.div>
        <motion.div
          className="grid md:grid-cols-3 gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {STEPS.map((s, i) => (
            <motion.div key={s.n} className="relative" variants={itemVariants}>
              <span className="ff-mono text-sm" style={{ color: tokens.current }}>{s.n}</span>
              <h3 className="ff-display font-semibold text-xl text-white mt-3 mb-2">{s.title}</h3>
              <p className="ff-body text-sm leading-relaxed" style={{ color: "#9AA3B8" }}>{s.body}</p>
              {i < STEPS.length - 1 && (
                <motion.div
                  className="hidden md:block absolute top-2 -right-5 w-10 h-px"
                  style={{ background: "linear-gradient(to right, rgba(255,255,255,0.2), transparent)" }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <motion.div
        className="rounded-3xl px-8 py-16 md:px-16 md:py-20 text-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${tokens.flow}, ${tokens.flowDark})` }}
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
      >
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-30"
          style={{ background: tokens.current, filter: "blur(60px)" }}
        />
        <h2 className="ff-display font-semibold text-3xl md:text-4xl tracking-tight text-white mb-4 relative">
          Stop asking "where's that task at?"
        </h2>
        <p className="ff-body text-white/80 mb-9 max-w-md mx-auto relative">
          Set up your first board in the time it takes to read this sentence twice.
        </p>
        <Link
          to="/register"
          className="ff-body inline-flex items-center gap-2 text-sm font-semibold px-6 py-3.5 rounded-xl relative transition-transform hover:-translate-y-0.5"
          style={{ background: "#fff", color: tokens.flowDark }}
        >
          Join ProFlow — it's free
          <ArrowUpRight size={16} />
        </Link>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${tokens.line}` }}>
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Logo />
        <div className="flex items-center gap-6 ff-body text-sm" style={{ color: tokens.mist }}>
          <span>Built by Atul Kumar Maurya</span>
          <a href="#" className="inline-flex items-center gap-1.5 hover:opacity-70 transition-opacity" style={{ color: tokens.ink }}>
            <Github size={15} />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function ProflowLanding() {
  return (
    <div className="ff-body" style={{ background: tokens.paper }}>
      <FontStyles />
      <NavBar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}
