import React from "react";
import {
  X,
  FileText,
  Globe,
  Shield,
  Cpu,
  Database,
  Github,
  FileCheck,
  ExternalLink,
  Download,
} from "lucide-react";
import { PROFILE_CONFIG } from "../data/portfolioData";

export function ProjectModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="projectModalTitle"
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-tomb border border-crimson max-w-2xl w-full rounded-2xl shadow-2xl relative max-h-[92vh] overflow-hidden flex flex-col"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer le dossier technique"
          className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-void/60 border border-slateBorder hover:border-crimson text-parchmentDim hover:text-crimson"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="overflow-y-auto p-5 sm:p-7 flex-1">
          <div className="flex items-center justify-between pb-2 border-b border-slateBorder/50 mb-3 pr-8">
            <div className="flex items-center gap-2 text-crimson text-xs uppercase tracking-widest font-bold">
              <FileText className="w-4 h-4 text-crimson-light" />
              <span>DOSSIER TECHNIQUE // SPÉCIFICATIONS</span>
            </div>
            <span className="text-[10px] text-green-400 border border-green-900/50 px-2 py-0.5 rounded bg-green-950/20">
              CONFIDENTIEL
            </span>
          </div>

          <h4
            id="projectModalTitle"
            className="font-serifClassic text-xl sm:text-2xl text-parchment font-bold mb-2"
          >
            {project.title}
          </h4>
          <p className="text-xs text-parchmentDim leading-relaxed mb-5">
            {project.detailedDescription}
          </p>

          <div className="p-4 rounded-lg border border-dashed border-crimson/50 bg-void/90 mb-5">
            <div className="flex items-center justify-around gap-2 text-[10px] sm:text-xs text-parchment py-2">
              {[
                { Icon: Globe, label: "Client / Edge" },
                { Icon: Shield, label: "API Gateway" },
                { Icon: Cpu, label: "Microservices" },
                { Icon: Database, label: "Data & Cache" },
              ].map(({ Icon, label }, idx) => (
                <React.Fragment key={label}>
                  {idx > 0 && (
                    <span className="text-crimson font-bold">&rarr;</span>
                  )}
                  <div className="p-2 rounded bg-tomb border border-slateBorder flex flex-col items-center">
                    <Icon className="w-4 h-4 text-crimson mb-1" />
                    <span>{label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-3 border-t border-slateBorder/60">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 bg-crimson hover:bg-crimson-light text-white text-xs uppercase font-bold tracking-widest rounded-lg flex items-center justify-center gap-2"
              >
                <Github className="w-4 h-4" />
                <span>Dépôt Source GitHub</span>
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 border border-crimson/60 hover:border-crimson bg-crimson-dark/25 text-red-200 hover:text-white text-xs uppercase font-bold tracking-widest rounded-lg flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-crimson-light" />
                <span>Démo en Ligne</span>
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 border border-slateBorder text-parchmentDim text-xs uppercase font-bold rounded-lg"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
  DESIGN VERROUILLÉ (MODALE CV) :
  - Sans barre de défilement visible (.no-scrollbar).
  - 3 lignes empilées verticalement.
  - Bouton "Ouvrir sur Canva" avec icône collée au texte (whitespace-nowrap).
*/
export function CvModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cvModalTitle"
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-tomb border border-crimson max-w-xl w-full rounded-2xl shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la fenêtre CV"
          className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-void/60 border border-slateBorder hover:border-crimson text-parchmentDim hover:text-crimson"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="overflow-y-auto no-scrollbar p-5 sm:p-7 flex-1">
          <div className="flex items-center gap-2.5 text-crimson text-xs uppercase tracking-widest font-bold mb-2">
            <FileCheck className="w-4 h-4 text-crimson-light" />
            <span>ACCRÉDITATION OFFICIELLE // K-DOSSIER</span>
          </div>
          <h4
            id="cvModalTitle"
            className="font-serifClassic text-xl sm:text-2xl text-parchment font-bold mb-1 tracking-wider"
          >
            CURRICULUM VITÆ // PROFIL
          </h4>
          <p className="text-xs text-parchmentDim mb-5">
            {PROFILE_CONFIG.cv.subtitle}
          </p>

          <div className="p-3.5 bg-void border border-slateBorder rounded-lg mb-5">
            <span className="text-[10px] uppercase tracking-wider text-crimson-light font-bold block mb-2">
              // POSTES CIBLÉS EN ALTERNANCE :
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {PROFILE_CONFIG.cv.targetRoles.map((role) => (
                <div
                  key={role}
                  className="p-2 rounded bg-tomb border border-slateBorder/80 text-parchment text-center text-[11px] font-medium flex items-center justify-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-crimson" />
                  <span>{role}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slateBorder/40 text-xs mb-6 bg-black/40 px-4 sm:px-5 py-1.5 rounded-lg border border-slateBorder/60">
            {PROFILE_CONFIG.cv.details.map((item) => (
              <div key={item.label} className="flex flex-col gap-1.5 py-3">
                <span className="text-parchmentDim text-[11px] tracking-wide">
                  {item.label}
                </span>
                <span
                  className={`text-xs sm:text-sm ${item.highlight ? "text-crimson-light font-bold" : "text-white font-medium"}`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={PROFILE_CONFIG.cv.canvaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 bg-crimson hover:bg-crimson-light text-white text-xs uppercase font-bold tracking-wider rounded-lg shadow-crimsonGlow inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <ExternalLink className="w-4 h-4 shrink-0" />
              <span>Ouvrir sur Canva</span>
            </a>
            {PROFILE_CONFIG.cv.pdfFile && (
              <a
                href={`/${PROFILE_CONFIG.cv.pdfFile}`}
                download={PROFILE_CONFIG.cv.pdfFile}
                className="py-3 px-4 border border-crimson/60 hover:border-crimson bg-crimson-dark/25 text-red-200 text-xs uppercase font-bold tracking-wider rounded-lg inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
              >
                <Download className="w-4 h-4 text-crimson-light shrink-0" />
                <span>Format PDF</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
