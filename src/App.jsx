import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import {
  FileCode, Github, ExternalLink, Lock, ShieldCheck, GraduationCap, Shield,
  Cloud, PlusCircle, FlaskConical, Code, Server, ShieldAlert, Cpu, Terminal, ArrowUp, Globe
} from 'lucide-react';
import {
  PROFILE_CONFIG, PROJECTS_DATA, CREDENTIALS_DATA, LABS_DATA, ARSENAL_DATA
} from './data/portfolioData';
import { usePianoAudio } from './hooks/usePianoAudio';
import { Navbar } from './components/Navbar';
import { HeroTacticalCanvas } from './components/HeroTacticalCanvas';
import { TiltCard } from './components/TiltCard';
import { ContactSection } from './components/ContactSection';

// Chargement différé (Code Splitting) des modales non critiques au premier affichage
const ProjectModal = lazy(() =>
  import('./components/Modals').then((module) => ({ default: module.ProjectModal }))
);
const CvModal = lazy(() =>
  import('./components/Modals').then((module) => ({ default: module.CvModal }))
);

const ICON_MAP = {
  'graduation-cap': GraduationCap,
  shield: Shield,
  cloud: Cloud,
  'plus-circle': PlusCircle,
  code: Code,
  server: Server,
  'shield-alert': ShieldAlert,
  cpu: Cpu,
};

export default function App() {
  const piano = usePianoAudio();
  const [crtOn, setCrtOn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [showTopBtn, setShowTopBtn] = useState(false);

  const [typedText, setTypedText] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [inspectedProject, setInspectedProject] = useState(null);
  const [cvOpen, setCvOpen] = useState(false);

  const mouseRef = useRef({ x: 0, y: 0 });

  // Animation machine à écrire du Hero
  useEffect(() => {
    let pIdx = 0, cIdx = 0, deleting = false, timer;
    const phrases = PROFILE_CONFIG.typewriterPhrases;
    const loop = () => {
      const cur = phrases[pIdx];
      setTypedText(cur.substring(0, deleting ? cIdx - 1 : cIdx + 1));
      cIdx += deleting ? -1 : 1;
      let speed = deleting ? 30 : 60;
      if (!deleting && cIdx === cur.length) { speed = 2200; deleting = true; }
      else if (deleting && cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; speed = 400; }
      timer = setTimeout(loop, speed);
    };
    loop();
    return () => clearTimeout(timer);
  }, []);

  // Barre de progression et bouton retour en haut
  useEffect(() => {
    const onScroll = () => {
      const top = window.scrollY;
      const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollPct(max > 0 ? (top / max) * 100 : 0);
      setShowTopBtn(top > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Touche Échap ferme les modales et menus ouverts
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setInspectedProject(null);
        setCvOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Verrouillage du défilement arrière-plan lorsqu'une modale ou le tiroir mobile est ouvert
  useEffect(() => {
    const hasOverlay = Boolean(mobileMenuOpen || inspectedProject || cvOpen);
    document.body.style.overflow = hasOverlay ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, inspectedProject, cvOpen]);

  const filteredProjects = PROJECTS_DATA.filter((p) => activeFilter === 'all' || p.category === activeFilter);

  return (
    <div>
      {/* Lien d'évitement pour la navigation clavier */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-crimson focus:text-white focus:text-xs focus:rounded"
      >
        Aller au contenu principal
      </a>

      {/* Overlay Scanlines CRT */}
      <div className={`fixed inset-0 scanlines z-40 transition-opacity duration-300 pointer-events-none ${crtOn ? 'opacity-100' : 'opacity-0'}`} />

      {/* Barre de navigation & menu tiroir mobile */}
      <Navbar
        piano={piano}
        crtOn={crtOn}
        onToggleCrt={() => setCrtOn(!crtOn)}
        onOpenCv={() => setCvOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Ligne de progression de lecture */}
      <div
        aria-hidden="true"
        className="fixed top-16 left-0 h-[2.5px] bg-gradient-to-r from-crimson via-red-500 to-crimson-light z-40 pointer-events-none"
        style={{ width: `${scrollPct}%` }}
      />

      {/* HERO SECTION AVEC ANIMATION 3D MW2/MW3 */}
      <section
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mouseRef.current = { x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 };
        }}
        onPointerLeave={() => { mouseRef.current = { x: 0, y: 0 }; }}
        className="relative w-full min-h-[550px] sm:min-h-[620px] flex items-center justify-center py-20 md:py-28 border-b border-slateBorder/50 overflow-hidden bg-void z-10"
      >
        <HeroTacticalCanvas mouseRef={mouseRef} />
        <div className="absolute inset-0 hero-readability-vignette pointer-events-none z-[1]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-void to-transparent pointer-events-none z-[1]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-crimson/50 bg-void/80 backdrop-blur-sm text-xs text-red-300 mb-6">
            <span className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full border border-crimson/80 bg-crimson-dark/60">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-crimson-light opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-crimson-light" />
            </span>
            <span className="tracking-wider">{PROFILE_CONFIG.systemId}</span>
          </div>

          <h1 className="font-gothic text-7xl sm:text-8xl md:text-9xl text-crimson-light kira-glow select-none mb-2">
            {PROFILE_CONFIG.brandTitle}
          </h1>
          <h2 className="font-serifClassic text-lg sm:text-2xl text-parchment uppercase tracking-[0.3em] font-bold mb-4">
            {PROFILE_CONFIG.roleTitle}
          </h2>
          <p className="text-parchmentDim text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8 font-light">
            {PROFILE_CONFIG.quote}
            <br />
            {PROFILE_CONFIG.subtitle}
          </p>

          <div className="p-3 bg-void/85 backdrop-blur-md border border-slateBorder/90 rounded max-w-xl mx-auto text-xs text-left flex items-start gap-3 shadow-lg">
            <span className="text-crimson font-bold select-none" aria-hidden="true">&gt;</span>
            <p className="text-red-200/90 min-h-[20px]">{typedText}</p>
          </div>
        </div>
      </section>

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 noise-bg">
        {/* DOSSIERS TECHNIQUES // PROJETS */}
        <section id="dossiers" className="py-16 border-b border-slateBorder/50">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-crimson text-xs uppercase tracking-widest font-bold mb-1">
                <FileCode className="w-4 h-4" />
                <span>Classified Executions</span>
              </div>
              <h3 className="font-serifClassic text-2xl sm:text-3xl text-parchment font-bold tracking-wider">
                DOSSIERS TECHNIQUES // PROJETS
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 text-xs" role="group" aria-label="Filtrer les projets par catégorie">
              {[
                { id: 'all', label: 'Tous' },
                { id: 'security', label: 'Sécurité & Réseaux' },
                { id: 'fullstack', label: 'Fullstack / Web' },
                { id: 'backend', label: 'Backend & APIs' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={activeFilter === f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3 py-1.5 rounded border transition ${
                    activeFilter === f.id
                      ? 'border-crimson bg-crimson/20 text-white font-medium'
                      : 'border-slateBorder hover:border-crimson/60 text-parchmentDim hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <TiltCard
                key={project.id}
                className={`project-card p-6 rounded transition-all duration-300 ${
                  project.locked
                    ? 'border border-dashed border-slateBorder/70 bg-void/50'
                    : 'border border-slateBorder bg-tomb/80 hover:bg-tomb group hover:border-crimson hover:shadow-dossier'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-slateBorder/40 pb-3">
                    <span className={`text-[11px] font-bold ${project.locked ? 'text-parchmentDim' : 'text-crimson-light'}`}>
                      {project.code}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] uppercase rounded border ${
                        project.statusVariant === 'crimson'
                          ? 'bg-crimson/20 text-red-300 border-crimson/40'
                          : project.statusVariant === 'blue'
                          ? 'bg-blue-900/20 text-blue-300 border-blue-800/40'
                          : project.statusVariant === 'green'
                          ? 'bg-green-900/20 text-green-300 border-green-800/40'
                          : 'bg-yellow-900/20 text-yellow-300 border-yellow-800/40'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <h4
                    className={`font-serifClassic font-bold mb-2 ${
                      project.locked
                        ? 'text-base text-parchmentDim'
                        : 'text-base text-parchment group-hover:text-red-300 transition-colors'
                    }`}
                  >
                    {project.title}
                  </h4>
                  <p className={`text-xs leading-relaxed mb-5 ${project.locked ? 'text-parchmentDim/70' : 'text-parchmentDim'}`}>
                    {project.summary}
                  </p>
                  {project.stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.stack.map((tech) => (
                        <span key={tech} className="text-[10px] px-2 py-0.5 rounded bg-black/60 border border-slateBorder text-parchmentDim">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {project.locked ? (
                  <div className="text-[11px] text-crimson flex items-center gap-2 mt-auto pt-3 border-t border-slateBorder/30">
                    <Lock className="w-3.5 h-3.5" />
                    <span>En attente de consignation dans le carnet</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2 text-xs pt-3 border-t border-slateBorder/40 mt-auto">
                    <div className="flex items-center gap-3">
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-parchmentDim hover:text-crimson-light transition"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Dépôt</span>
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-parchmentDim hover:text-crimson-light transition"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Démo</span>
                        </a>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setInspectedProject(project)}
                      className="text-crimson hover:text-red-400 font-bold flex items-center gap-1 ml-auto"
                    >
                      <span>Inspecter</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </TiltCard>
            ))}
          </div>
        </section>

        {/* ACCRÉDITATIONS & LABS */}
        <section id="credentials" className="py-16 border-b border-slateBorder/50">
          <div className="flex items-center gap-2 text-crimson text-xs uppercase tracking-widest font-bold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Cryptographic Proofs</span>
          </div>
          <h3 className="font-serifClassic text-2xl sm:text-3xl text-parchment font-bold tracking-wider mb-2">
            ACCRÉDITATIONS &amp; TITRES OFFICIELS
          </h3>
          <p className="text-xs text-parchmentDim max-w-2xl mb-8">
            Diplômes académiques, certifications industrielles et compétences validées par des autorités reconnues.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ perspective: '1200px' }}>
            {CREDENTIALS_DATA.map((cred) => {
              const IconComp = ICON_MAP[cred.icon] || Shield;
              return (
                <TiltCard
                  key={cred.title}
                  className="border border-slateBorder bg-tomb/70 p-6 rounded group hover:border-crimson transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="w-10 h-10 rounded bg-crimson/20 border border-crimson/50 flex items-center justify-center shrink-0">
                        <IconComp className="w-5 h-5 text-crimson-light" />
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded border ${
                          cred.badgeVariant === 'green'
                            ? 'text-green-400 border-green-900/50 bg-green-950/20'
                            : cred.badgeVariant === 'yellow'
                            ? 'text-yellow-400 border-yellow-900/50 bg-yellow-950/20'
                            : 'text-parchmentDim border-slateBorder'
                        }`}
                      >
                        {cred.badge}
                      </span>
                    </div>
                    <h4 className="font-serifClassic text-base font-bold text-parchment mb-1">{cred.title}</h4>
                    <p className="text-xs text-crimson font-medium mb-3">{cred.subtitle}</p>
                    <p className="text-xs text-parchmentDim leading-relaxed mb-4">{cred.description}</p>
                  </div>
                  {cred.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {cred.tags.map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-black/50 border border-slateBorder/60 text-parchmentDim">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-parchmentDim/60 italic">{cred.footerNote}</span>
                  )}
                </TiltCard>
              );
            })}
          </div>

          {/* LABS TECHNIQUES & VEILLE ACTIVE — Aligné à l'échelle typographique des cartes Accréditations */}
          <div className="mt-10 border border-slateBorder/80 bg-tomb/60 rounded-lg p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slateBorder/50 gap-2 mb-6">
              <div className="flex items-center gap-2.5">
                <FlaskConical className="w-4 h-4 text-crimson-light shrink-0" />
                <span className="font-serifClassic text-base font-bold text-parchment uppercase tracking-wider">
                  LABS TECHNIQUES &amp; VEILLE ACTIVE // R&amp;D
                </span>
              </div>
              <span className="text-[10px] text-crimson border border-crimson/40 px-2 py-0.5 rounded bg-crimson-dark/20 w-fit">
                SYNCHRONISATION HEBDOMADAIRE
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ perspective: '1200px' }}>
              {LABS_DATA.map((lab) => (
                <TiltCard
                  key={lab.code}
                  className="p-6 rounded bg-void/80 border border-slateBorder/60 hover:border-crimson transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] text-crimson-light font-bold tracking-wider">{lab.code}</span>
                      <span className={`w-2 h-2 rounded-full ${lab.dotColor}`} />
                    </div>
                    <h5 className="font-serifClassic text-base font-bold text-parchment mb-2">{lab.title}</h5>
                    <p className="text-xs text-parchmentDim leading-relaxed mb-4">{lab.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slateBorder/40">
                    {lab.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded bg-black/60 border border-slateBorder/60 text-parchmentDim"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>

        {/* ARSENAL TECHNIQUE — Grille 2 colonnes et typographie harmonisées avec les cartes Accréditations */}
        <section id="arsenal" className="py-16 border-b border-slateBorder/50">
          <div className="flex items-center gap-2 text-crimson text-xs uppercase tracking-widest font-bold mb-1">
            <Terminal className="w-4 h-4" />
            <span>Tactical Capabilities</span>
          </div>
          <h3 className="font-serifClassic text-2xl sm:text-3xl text-parchment font-bold tracking-wider mb-8">
            ARSENAL TECHNIQUE // STACK
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ perspective: '1200px' }}>
            {ARSENAL_DATA.map((group) => {
              const IconComp = ICON_MAP[group.icon] || Code;
              return (
                <TiltCard
                  key={group.category}
                  className="border border-slateBorder bg-tomb/70 p-6 rounded group hover:border-crimson transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 border-b border-slateBorder/60 pb-3 mb-4">
                      <div className="w-9 h-9 rounded bg-crimson/20 border border-crimson/50 flex items-center justify-center shrink-0">
                        <IconComp className="w-4 h-4 text-crimson-light" />
                      </div>
                      <h4 className="font-serifClassic text-base font-bold text-parchment">{group.category}</h4>
                    </div>
                    <ul className="space-y-3.5 text-xs text-parchmentDim">
                      {group.skills.map((s) => {
                        const rating =
                          typeof s.rating === 'number'
                            ? Math.max(1, Math.min(5, s.rating))
                            : s.tier === 'top'
                            ? 5
                            : s.tier === 'high'
                            ? 4
                            : 3;
                        return (
                          <li key={s.name} className="flex items-center justify-between gap-4">
                            <span className="text-parchment font-medium leading-snug">{s.name}</span>
                            <div
                              role="img"
                              aria-label={`Niveau ${rating} sur 5`}
                              title={`Niveau ${rating}/5`}
                              className="w-20 shrink-0 grid grid-cols-5 gap-1"
                            >
                              {[1, 2, 3, 4, 5].map((step) => {
                                const filled = step <= rating;
                                return (
                                  <span
                                    key={step}
                                    aria-hidden="true"
                                    className={`h-1.5 rounded-[1px] border transition-colors ${
                                      filled
                                        ? rating === 5
                                          ? 'bg-crimson-light border-crimson-light/80 shadow-[0_0_6px_rgba(220,38,38,0.55)]'
                                          : rating === 4
                                          ? 'bg-crimson border-crimson-light/60'
                                          : 'bg-crimson/75 border-crimson/70'
                                        : 'bg-void border-slateBorder/80'
                                    }`}
                                  />
                                );
                              })}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </section>

        {/* TRANSMISSION / FORMULAIRE WEB3FORMS */}
        <ContactSection />
      </main>

      {/* Modales chargées à la demande via React.lazy() + Suspense */}
      <Suspense fallback={null}>
        {inspectedProject && (
          <ProjectModal project={inspectedProject} onClose={() => setInspectedProject(null)} />
        )}
        {cvOpen && <CvModal open={cvOpen} onClose={() => setCvOpen(false)} />}
      </Suspense>

      {/* Bouton retour en haut discret */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Retour en haut de page"
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 p-2.5 rounded-lg border border-crimson/50 bg-void/90 hover:bg-crimson text-parchmentDim hover:text-white transition-all z-40 shadow-lg ${
          showTopBtn ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      <footer className="border-t border-slateBorder/50 pt-8 pb-16 sm:pb-8 text-center text-xs text-parchmentDim relative z-10 bg-black px-4">
        <p className="font-serifClassic tracking-widest uppercase mb-1">
          © {new Date().getFullYear()} // {PROFILE_CONFIG.brandTitle.toUpperCase()} — {PROFILE_CONFIG.protocolLabel} • TOUS DROITS RÉSERVÉS
        </p>
        <p className="text-[10px] text-parchmentDim/60">« The human whose name is written in this note shall code. »</p>
      </footer>
    </div>
  );
}
