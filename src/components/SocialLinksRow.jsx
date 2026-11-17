import React, { memo } from 'react';
import { Mail } from 'lucide-react';
import { PROFILE_CONFIG } from '../data/portfolioData';

/*
  DESIGN VERROUILLÉ (BADGES RÉSEAUX SOCIAUX : GITHUB, LINKEDIN, EMAIL DIRECT) :
  Présents à la fois dans le menu tiroir latéral ET sous le formulaire de contact.
*/
export const SocialLinksRow = memo(function SocialLinksRow({ compact = false }) {
  const btnClass = compact
    ? 'flex-1 py-2 px-2.5 rounded border border-slateBorder/80 bg-black/50 hover:bg-crimson/10 hover:border-crimson text-parchmentDim hover:text-white transition-all duration-300 inline-flex items-center justify-center gap-1.5 text-[11px] group'
    : 'w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded border border-slateBorder/80 bg-black/50 hover:bg-crimson/10 hover:border-crimson text-parchmentDim hover:text-white transition-all duration-300 inline-flex items-center justify-center gap-2 text-xs group shadow-sm';

  return (
    <div
      className={
        compact
          ? 'flex flex-wrap items-center justify-center gap-2'
          : 'grid grid-cols-1 sm:flex sm:flex-wrap items-center justify-center gap-2.5 sm:gap-4'
      }
    >
      <a href={PROFILE_CONFIG.socials.github} target="_blank" rel="noopener noreferrer" className={btnClass}>
        <svg className="w-4 h-4 fill-current text-parchmentDim group-hover:text-crimson-light transition-colors shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
        <span>GitHub</span>
      </a>

      <a href={PROFILE_CONFIG.socials.linkedin} target="_blank" rel="noopener noreferrer" className={btnClass}>
        <svg className="w-4 h-4 fill-current text-parchmentDim group-hover:text-crimson-light transition-colors shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3z" />
        </svg>
        <span>LinkedIn</span>
      </a>

      <a href={PROFILE_CONFIG.socials.email} className={btnClass}>
        <Mail className="w-4 h-4 text-parchmentDim group-hover:text-crimson-light transition-colors shrink-0" />
        <span>{compact ? 'Email' : 'Email Direct'}</span>
      </a>
    </div>
  );
});
