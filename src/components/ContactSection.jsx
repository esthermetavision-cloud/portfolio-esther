import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, ChevronDown, Check, ShieldAlert, Loader2 } from 'lucide-react';
import { MISSION_TYPES, PROFILE_CONFIG } from '../data/portfolioData';
import { SocialLinksRow } from './SocialLinksRow';

const MAX_MESSAGE_LENGTH = 3000;

/*
  ====================================================================================
  FORMULAIRE DE CONTACT RÉEL CÂBLÉ SUR WEB3FORMS (DURCI APPSEC) :
  - Reçoit les messages directement sur esthermetavision@gmail.com sans backend.
  - Protections intégrées :
    1) Clé publique isolée dans .env (VITE_WEB3FORMS_ACCESS_KEY)
    2) Champ piège invisible Honeypot ("botcheck") contre les robots spammeurs
    3) Cooldown anti-flood de 15 secondes entre deux envois réussis
    4) Validation stricte des longueurs, format email RFC et assainissement des entrées
  ====================================================================================
*/
export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'recruitment',
    message: '',
    botcheck: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle', text: '', senderName: '' });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [lastSentAt, setLastSentAt] = useState(0);
  const dropdownRef = useRef(null);

  const selectedMissionLabel = MISSION_TYPES.find((m) => m.value === formData.type)?.label || '';

  // Ferme le menu déroulant personnalisé au clic extérieur
  useEffect(() => {
    if (!dropdownOpen) return;
    const onPointerDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [dropdownOpen]);

  const sanitizeInput = (str) =>
    str.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    // 1. Protection anti-spam Honeypot
    if (formData.botcheck) {
      setStatus({ state: 'success', text: 'Transmission consignée.', senderName: '' });
      return;
    }

    // 2. Protection anti-flood (15 secondes minimum entre deux envois)
    if (Date.now() - lastSentAt < 15000) {
      setStatus({
        state: 'error',
        text: 'PROTECTION ANTI-FLOOD : Veuillez patienter quelques secondes avant une nouvelle transmission.',
        senderName: '',
      });
      return;
    }

    // 3. Validation stricte des champs
    const cleanName = sanitizeInput(formData.name);
    const cleanEmail = sanitizeInput(formData.email).toLowerCase();
    const cleanMessage = sanitizeInput(formData.message);

    const errs = {};
    if (cleanName.length < 2 || cleanName.length > 100) errs.name = '2 À 100 CARACTÈRES';
    if (
      !cleanEmail ||
      cleanEmail.length > 150 ||
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(cleanEmail)
    ) {
      errs.email = 'EMAIL INVALIDE';
    }
    if (cleanMessage.length < 10 || cleanMessage.length > MAX_MESSAGE_LENGTH) {
      errs.message = `10 À ${MAX_MESSAGE_LENGTH} CARACTÈRES`;
    }
    setFormErrors(errs);

    if (Object.keys(errs).length > 0) {
      setStatus({
        state: 'error',
        text: 'ALERTE SYSTÈME : Données invalides ou incomplètes (vérifiez le nom, l’adresse email et la longueur du message).',
        senderName: '',
      });
      return;
    }

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    if (!accessKey || accessKey === 'COLLE_TA_CLE_WEB3FORMS_ICI') {
      setStatus({
        state: 'error',
        text: 'CONFIGURATION REQUISE : Ajoute ta clé Web3Forms dans le fichier .env (VITE_WEB3FORMS_ACCESS_KEY) puis redémarre "npm run dev".',
        senderName: '',
      });
      return;
    }

    setStatus({ state: 'sending', text: '', senderName: '' });

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `[PORTFOLIO ${PROFILE_CONFIG.brandTitle.toUpperCase()}] ${selectedMissionLabel} — ${cleanName}`,
          from_name: `${PROFILE_CONFIG.protocolLabel} — ${PROFILE_CONFIG.brandTitle}`,
          name: cleanName,
          email: cleanEmail,
          mission_type: selectedMissionLabel,
          message: cleanMessage,
          botcheck: false,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setLastSentAt(Date.now());
        setStatus({
          state: 'success',
          text: '',
          senderName: cleanName,
        });
        setFormData({ name: '', email: '', type: 'recruitment', message: '', botcheck: '' });
      } else {
        setStatus({
          state: 'error',
          text: result.message || 'Échec de la transmission réseau. Vérifie ta clé Web3Forms dans .env.',
          senderName: '',
        });
      }
    } catch {
      setStatus({
        state: 'error',
        text: 'ERREUR RÉSEAU : Impossible de joindre le relais chiffré Web3Forms. Vérifie ta connexion.',
        senderName: '',
      });
    }
  };

  return (
    <section id="transmission" className="py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h3 className="font-serifClassic text-2xl sm:text-3xl text-parchment font-bold tracking-wider mb-2">
            TRANSMISSION // ME CONTACTER
          </h3>
          <p className="text-xs text-parchmentDim leading-relaxed max-w-2xl mx-auto">
            Pour une collaboration, une opportunité technique ou un audit de sécurité, transmettez vos coordonnées ci-dessous.
          </p>
        </div>

        <div className="border border-slateBorder bg-tomb p-4 sm:p-8 rounded shadow-crimsonInset overflow-hidden">
          <form onSubmit={handleContactSubmit} noValidate className="space-y-5">
            {/* Honeypot invisible anti-spam */}
            <input
              type="text"
              name="botcheck"
              value={formData.botcheck}
              onChange={(e) => setFormData({ ...formData, botcheck: e.target.value })}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  {/* DESIGN VERROUILLÉ : Libellé "Nom :" uniquement */}
                  <label htmlFor="senderName" className="text-xs uppercase tracking-wider text-parchmentDim">
                    Nom :
                  </label>
                  {formErrors.name && (
                    <span className="text-[10px] text-red-400 flex items-center gap-1 shrink-0">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.name}
                    </span>
                  )}
                </div>
                <input
                  id="senderName"
                  type="text"
                  maxLength={100}
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setFormErrors({ ...formErrors, name: '' });
                  }}
                  placeholder="ex: Jean Dupont / Entreprise"
                  aria-invalid={Boolean(formErrors.name)}
                  className={`w-full bg-void border ${
                    formErrors.name ? 'border-crimson-light shadow-crimsonGlow' : 'border-slateBorder'
                  } focus:border-crimson text-parchment px-3.5 sm:px-4 py-2.5 text-xs rounded outline-none transition`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <label htmlFor="senderEmail" className="text-xs uppercase tracking-wider text-parchmentDim">
                    EMAIL :
                  </label>
                  {formErrors.email && (
                    <span className="text-[10px] text-red-400 flex items-center gap-1 shrink-0">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.email}
                    </span>
                  )}
                </div>
                <input
                  id="senderEmail"
                  type="email"
                  maxLength={150}
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setFormErrors({ ...formErrors, email: '' });
                  }}
                  placeholder="contact@domaine.com"
                  aria-invalid={Boolean(formErrors.email)}
                  className={`w-full bg-void border ${
                    formErrors.email ? 'border-crimson-light shadow-crimsonGlow' : 'border-slateBorder'
                  } focus:border-crimson text-parchment px-3.5 sm:px-4 py-2.5 text-xs rounded outline-none transition`}
                />
              </div>
            </div>

            <div className="relative" ref={dropdownRef}>
              <label id="missionTypeLabel" className="block text-xs uppercase tracking-wider text-parchmentDim mb-2">
                Type de mission :
              </label>
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen}
                aria-labelledby="missionTypeLabel"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`w-full bg-void border ${
                  dropdownOpen ? 'border-crimson' : 'border-slateBorder'
                } text-parchment px-3.5 sm:px-4 py-2.5 text-xs rounded flex items-center justify-between gap-2`}
              >
                <span className="truncate">{selectedMissionLabel}</span>
                <ChevronDown
                  className={`w-4 h-4 text-parchmentDim shrink-0 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {dropdownOpen && (
                <div
                  role="listbox"
                  aria-labelledby="missionTypeLabel"
                  className="absolute left-0 right-0 top-full mt-1.5 bg-tomb/95 backdrop-blur-md border border-crimson/50 rounded shadow-2xl z-30 py-1 text-xs"
                >
                  {MISSION_TYPES.map((opt) => (
                    <div
                      key={opt.value}
                      role="option"
                      aria-selected={formData.type === opt.value}
                      onClick={() => {
                        setFormData({ ...formData, type: opt.value });
                        setDropdownOpen(false);
                      }}
                      className={`px-3.5 sm:px-4 py-2.5 cursor-pointer flex items-center justify-between gap-2 transition ${
                        formData.type === opt.value
                          ? 'bg-crimson/15 text-red-200'
                          : 'text-parchmentDim hover:bg-crimson/20 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span className={`font-bold shrink-0 ${formData.type === opt.value ? 'text-crimson' : 'text-transparent'}`}>
                          &gt;
                        </span>
                        <span className="truncate">{opt.label}</span>
                      </span>
                      {formData.type === opt.value && <Check className="w-3.5 h-3.5 text-crimson shrink-0" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <label htmlFor="messageContent" className="text-xs uppercase tracking-wider text-parchmentDim">
                  Message à inscrire :
                </label>
                <div className="flex items-center gap-2 shrink-0">
                  {formErrors.message && (
                    <span className="text-[10px] text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.message}
                    </span>
                  )}
                  <span className="text-[10px] text-parchmentDim/60">
                    {formData.message.length}/{MAX_MESSAGE_LENGTH}
                  </span>
                </div>
              </div>
              <textarea
                id="messageContent"
                rows={4}
                maxLength={MAX_MESSAGE_LENGTH}
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                  setFormErrors({ ...formErrors, message: '' });
                }}
                placeholder="Détaillez votre requête ici..."
                aria-invalid={Boolean(formErrors.message)}
                className={`w-full bg-void border ${
                  formErrors.message ? 'border-crimson-light shadow-crimsonGlow' : 'border-slateBorder'
                } focus:border-crimson text-parchment px-3.5 sm:px-4 py-2.5 text-xs leading-relaxed rounded outline-none transition`}
              />
            </div>

            <button
              type="submit"
              disabled={status.state === 'sending'}
              className="deathnote-btn w-full py-3.5 sm:py-4 px-4 sm:px-6 text-white text-xs sm:text-sm uppercase font-bold tracking-wider rounded group cursor-pointer disabled:opacity-60"
            >
              {status.state === 'sending' ? (
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-crimson-light shrink-0" />
                  <span>Chiffrement &amp; envoi en cours...</span>
                </div>
              ) : (
                <>
                  <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center sm:gap-1.5">
                    <span>Envoyer la transmission</span>
                    <span>chiffrée</span>
                  </div>
                  <div className="relative z-10 flex items-center justify-center gap-2 text-[10px] text-red-200/70 tracking-[0.25em] uppercase mt-1">
                    <span className="font-serifClassic text-crimson-light text-sm">†</span>
                    <span>// SCELLER LE PACTE</span>
                    <span className="font-serifClassic text-crimson-light text-sm">†</span>
                  </div>
                </>
              )}
            </button>
          </form>

          {status.state === 'error' && (
            <div
              role="alert"
              className="mt-4 p-3.5 rounded text-xs leading-relaxed border border-crimson bg-crimson-dark/40 text-red-200 w-full overflow-hidden"
            >
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-crimson-light shrink-0 mt-0.5" />
                <p className="min-w-0 flex-1 break-words">{status.text}</p>
              </div>
            </div>
          )}

          {status.state === 'success' && (
            <div
              role="status"
              className="mt-4 p-3.5 rounded text-xs leading-relaxed border border-green-800 bg-green-950/40 text-green-200 w-full overflow-hidden"
            >
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-green-400 shrink-0 mt-1.5" />
                <p className="min-w-0 flex-1 break-words">
                  <strong className="text-green-100">TRANSMISSION RÉUSSIE :</strong>{' '}
                  {status.senderName ? (
                    <>
                      Le message de <span className="font-medium text-white break-words">{status.senderName}</span> a été transmis
                      directement vers{' '}
                      <span className="font-medium text-green-100 break-all">{PROFILE_CONFIG.brandTitle}</span>.
                    </>
                  ) : (
                    status.text
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Liens directs GitHub, LinkedIn & Email sous le formulaire */}
        <div className="mt-8">
          <SocialLinksRow />
        </div>
      </div>
    </section>
  );
}
