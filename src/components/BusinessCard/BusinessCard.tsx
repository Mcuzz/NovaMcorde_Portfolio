import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toPng } from "html-to-image";
import { profile } from "../../data/portfolio";
import { useIsMobile } from "../../hooks/useIsMobile";
import { CardFace } from "./CardFace";

type BusinessCardProps = {
  photoSrc: string;
  onClose: () => void;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vr: number;
  color: string;
  life: number;
};

const CONFETTI_COLORS = ["#7f77dd", "#e13734", "#47bfff", "#fdfaf5", "#ffb84d"];

function buildShareText() {
  return `${profile.name} — Programador Junior. Mira mi tarjeta de presentación:`;
}

function encodeCardData() {
  const data = { name: profile.name, role: "Programador Junior" };
  return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
}

function buildShareUrl() {
  const encoded = encodeCardData();
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}?card=${encoded}`;
}

export function BusinessCard({ photoSrc, onClose }: BusinessCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const [copyLabel, setCopyLabel] = useState("Copy link");
  const isMobile = useIsMobile();

  // ── confetti burst ──────────────────────────────────────────
  useEffect(() => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const particles: Particle[] = Array.from({ length: 140 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 9;
      return {
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 15 + Math.random() * 6,
        rotation: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        color:
          CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        life: 1,
      };
    });

    let raf: number;
    const gravity = 0.18;

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach((p) => {
        if (p.life <= 0) return;
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vr;
        p.life -= 0.011;

        if (p.life > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(p.life, 0);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          ctx.restore();
        }
      });

      if (alive) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ── escape to close ─────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // ── actions ──────────────────────────────────────────────────
  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = `${profile.name.replace(/\s+/g, "-").toLowerCase()}-card.png`;
    link.href = dataUrl;
    link.click();
  }, []);

  const handlePrint = useCallback(() => {
    document.body.classList.add("is-printing-card");
    window.print();
    setTimeout(() => document.body.classList.remove("is-printing-card"), 300);
  }, []);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(buildShareUrl());
      setCopyLabel("Copied!");
      setTimeout(() => setCopyLabel("Copy link"), 1800);
    } catch {
      setCopyLabel("Couldn't copy");
      setTimeout(() => setCopyLabel("Copy link"), 1800);
    }
  }, []);

  const handleCopyEmbed = useCallback(async () => {
    const url = buildShareUrl();
    const snippet = `<iframe src="${url}" width="560" height="340" style="border:0;border-radius:12px;" loading="lazy"></iframe>`;
    try {
      await navigator.clipboard.writeText(snippet);
      setCopyLabel("Embed copied!");
      setTimeout(() => setCopyLabel("Copy link"), 1800);
    } catch {
      /* silent */
    }
  }, []);

  const shareUrl = buildShareUrl();
  const shareText = buildShareText();

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(`${profile.name} — tarjeta de presentación`)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
    sms: `sms:?body=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
  };

return createPortal(
    <div className="business-card-overlay" role="dialog" aria-modal="true" aria-label="Tarjeta de presentación">
      <canvas ref={confettiCanvasRef} className="business-card-confetti" aria-hidden="true" />

      <button type="button" className="business-card-overlay__close" onClick={onClose} aria-label="Cerrar">
        ✕
      </button>

      <div className="business-card-stage">
        <CardFace ref={cardRef} photoSrc={photoSrc} />
      </div>

      <aside className="business-card-toolbar" aria-label="Compartir tarjeta">
        <button type="button" onClick={handleDownload} title="Download PNG">⬇</button>
        <button type="button" onClick={handlePrint} title="Print">🖨</button>
        <button type="button" onClick={handleCopyLink} title="Copy link">🔗</button>
        <button type="button" onClick={handleCopyEmbed} title="Embed code">{"</>"}</button>
        <a href={shareLinks.linkedin} target="_blank" rel="noreferrer" title="LinkedIn">in</a>

        {isMobile && (
          <>
            <a href={shareLinks.whatsapp} target="_blank" rel="noreferrer" title="WhatsApp">◐</a>
            <a href={shareLinks.facebook} target="_blank" rel="noreferrer" title="Facebook">f</a>
            <a href={shareLinks.x} target="_blank" rel="noreferrer" title="X">✕</a>
            <a href={shareLinks.email} title="Email">✉</a>
            <a href={shareLinks.sms} title="Message">💬</a>
          </>
        )}

        {copyLabel !== "Copy link" && (
          <span className="business-card-toolbar__toast">{copyLabel}</span>
        )}
      </aside>
    </div>,
    document.body,
  );
}