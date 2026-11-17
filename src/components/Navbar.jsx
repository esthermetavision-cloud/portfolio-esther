import React from "react";
import { ScanLine, ShieldAlert, Menu, X } from "lucide-react";
import { PROFILE_CONFIG } from "../data/portfolioData";
import { SocialLinksRow } from "./SocialLinksRow";

/*
  DESIGN VERROUILLÉ (BARRE DE NAVIGATION) :
  - Logo libre sans encadrement.
  - Bascule synchronisée sous xl: (1280px) pour que "ARCHIVES // PROTOCOL", les liens et "CONTACT"
    disparaissent proprement sans jamais se chevaucher ou être coupés.
  - Hauteur strictement unifiée à h-9 (36px) pour tous les boutons d'action.
*/
export function Navbar({
  piano,
  crtOn,
  onToggleCrt,
  onOpenCv,
  mobileMenuOpen,
  setMobileMenuOpen,
}) {
  const drawerItemClass =
    "w-full flex items-center p-3 text-sm uppercase tracking-widest text-parchment hover:text-crimson-light transition-colors duration-200 ease-out font-medium text-left select-none";

  return (
    <>
      <header className="border-b border-slateBorder/60 bg-tomb/90 backdrop-blur-md sticky top-0 z-30 w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          <a
            href="#"
            className="flex items-center gap-3 group shrink-0"
            aria-label="Retour à l'accueil"
          >
            <span className="font-gothic text-3xl text-crimson-light group-hover:text-red-400 transition-colors duration-200">
              {PROFILE_CONFIG.monogram}
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-parchmentDim font-serifClassic border-l border-slateBorder pl-3 whitespace-nowrap hidden xl:inline-block">
              {PROFILE_CONFIG.protocolLabel}
            </span>
          </a>

          <nav
            aria-label="Navigation principale"
            className="hidden xl:flex items-center gap-7 text-xs uppercase tracking-wider text-parchmentDim shrink-0"
          >
            <a
              href="#dossiers"
              className="hover:text-crimson-light transition-colors duration-200 py-1 border-b border-transparent hover:border-crimson"
            >
              Projets
            </a>
            <a
              href="#credentials"
              className="hover:text-crimson-light transition-colors duration-200 py-1 border-b border-transparent hover:border-crimson"
            >
              Accréditations
            </a>
            <a
              href="#arsenal"
              className="hover:text-crimson-light transition-colors duration-200 py-1 border-b border-transparent hover:border-crimson"
            >
              Arsenal
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Bouton icône fréquence audio (5 barres d'égaliseur, sans texte) */}
            <button
              type="button"
              onClick={piano.toggle}
              title="Activer / Couper la fréquence audio"
              aria-label="Contrôle fréquence audio"
              aria-pressed={piano.isPlaying}
              className={`h-9 w-9 border rounded inline-flex items-center justify-center bg-black/40 transition-colors duration-200 ${
                piano.isPlaying
                  ? "border-crimson/60 audio-playing"
                  : "border-slateBorder audio-muted"
              }`}
            >
              <span
                className="flex items-center justify-center gap-[2.5px] h-4 pointer-events-none"
                aria-hidden="true"
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className="audio-bar" />
                ))}
              </span>
            </button>

            {/* Bouton icône mode CRT (sans texte, voyant lumineux carmin quand activé) */}
            <button
              type="button"
              onClick={onToggleCrt}
              title={crtOn ? "Filtre CRT : activé" : "Filtre CRT : désactivé"}
              aria-label="Activer ou désactiver le filtre CRT"
              aria-pressed={crtOn}
              className={`h-9 w-9 border rounded inline-flex items-center justify-center transition-colors duration-200 ${
                crtOn
                  ? "border-crimson/60 bg-crimson-dark/20 text-crimson-light shadow-[0_0_12px_rgba(220,38,38,0.45)]"
                  : "border-slateBorder bg-black/40 text-zinc-500 hover:border-crimson/60 hover:text-parchmentDim"
              }`}
            >
              <ScanLine
                className={`w-4 h-4 pointer-events-none transition-colors duration-200 ${
                  crtOn
                    ? "text-crimson-light drop-shadow-[0_0_6px_rgba(239,68,68,0.85)]"
                    : "text-zinc-500"
                }`}
                aria-hidden="true"
              />
            </button>

            <a
              href="#transmission"
              className="h-9 px-4 text-xs font-semibold uppercase tracking-wider bg-crimson hover:bg-crimson-light text-white rounded transition-colors duration-200 shadow-crimsonGlow hidden xl:inline-flex items-center gap-1.5"
            >
              <ShieldAlert
                className="w-4 h-4 pointer-events-none"
                aria-hidden="true"
              />
              <span>Contact</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Ouvrir le menu de navigation"
              aria-expanded={mobileMenuOpen}
              className="h-9 w-9 xl:hidden text-parchmentDim hover:text-crimson-light border border-slateBorder hover:border-crimson bg-black/50 rounded inline-flex items-center justify-center transition-colors duration-200"
            >
              <Menu
                className="w-4 h-4 pointer-events-none"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Menu tiroir latéral défilable (Mobile / Tablette / Demi-fenêtre) */}
      {mobileMenuOpen && (
        <>
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
            className="fixed inset-y-0 right-0 w-80 max-w-[85vw] h-[100dvh] bg-void/95 backdrop-blur-xl border-l border-crimson/50 z-50 flex flex-col overflow-y-auto overscroll-contain shadow-2xl transform-gpu"
          >
            {/* En-tête sticky pour garder le bouton fermer toujours accessible au scroll */}
            <div className="sticky top-0 z-10 px-6 py-4 bg-void/95 backdrop-blur-md border-b border-slateBorder/60 flex items-center justify-between shrink-0">
              <span className="font-gothic text-2xl text-crimson-light select-none">
                {PROFILE_CONFIG.monogram}
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Fermer le menu"
                className="p-1.5 text-parchmentDim hover:text-crimson border border-slateBorder hover:border-crimson rounded transition-colors duration-200"
              >
                <X className="w-5 h-5 pointer-events-none" aria-hidden="true" />
              </button>
            </div>

            {/* Liens de navigation (extensible librement dans le futur) */}
            <nav
              aria-label="Navigation mobile"
              className="px-6 py-4 space-y-1.5 font-serifClassic flex-1"
            >
              {[
                { href: "#dossiers", label: "Projets" },
                { href: "#credentials", label: "Accréditations" },
                { href: "#arsenal", label: "Arsenal" },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={drawerItemClass}
                >
                  <span className="pointer-events-none">{label}</span>
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCv();
                }}
                className={drawerItemClass}
              >
                <span className="pointer-events-none">Curriculum Vitæ</span>
              </button>
            </nav>

            {/* Pied du menu */}
            <div className="mt-auto p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] border-t border-slateBorder/60 space-y-3.5 bg-tomb/50 shrink-0">
              <a
                href="#transmission"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 bg-crimson hover:bg-crimson-light text-white text-xs uppercase font-bold tracking-widest rounded shadow-crimsonGlow flex items-center justify-center gap-2 transition-colors duration-200"
              >
                <ShieldAlert
                  className="w-4 h-4 shrink-0 pointer-events-none"
                  aria-hidden="true"
                />
                <span className="pointer-events-none">Initialiser Contact</span>
              </a>
              <div className="pt-1">
                <SocialLinksRow compact />
              </div>
              <p className="text-[10px] text-center text-parchmentDim/60 uppercase tracking-wider">
                Protocole de défense v3.0 // Sécurisé
              </p>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
