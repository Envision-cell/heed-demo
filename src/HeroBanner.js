


/* ─────────────────────────────────────────────
   HeroBanner.js – CRA / Webpack version
───────────────────────────────────────────── */
import React, { useRef, useEffect, useState } from "react";
import "./HeroBanner.css";

import introVideo  from "./assets/heed_Logo.mp4";
import bgVideo     from "./assets/heed_Logo.mp4";
import seamBridge  from "./assets/seamBridge.webm";
import lineImg     from "./assets/line.gif";
import Footer      from "./components/Footer";
import { useNavigate } from "react-router-dom";
import RotatePrompt from "./components/RotatePrompt";

/* ─────────────────────────────────────────────
   1.  Persist flag: “have we already cached?”
   (sessionStorage survives route changes in SPA)
───────────────────────────────────────────── */
const heroAssetsCached =
  sessionStorage.getItem("heroAssetsCached") === "true";

/* ─────────────────────────────────────────────
   2.  Pre-loader hook
───────────────────────────────────────────── */
function usePreload(list = []) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (heroAssetsCached) { setReady(true); return; }    // skip on revisit

    let mounted = true;

    const load = (src) =>
      new Promise((res) => {
        if (/\.(mp4|webm|ogg|png|jpe?g|gif)$/i.test(src)) {
          const el = /\.(mp4|webm|ogg)$/i.test(src)
            ? document.createElement("video")
            : new Image();
          el.onload = el.oncanplaythrough = res;
          el.onerror = res;
          el.src = src;
          return;
        }
        if (/\.(woff2?|ttf|otf)$/i.test(src)) {
          const ff = new FontFace(src, `url(${src})`);
          ff.load().catch(() => {}).finally(() => {
            try { document.fonts.add(ff); } catch {}
            res();
          });
          return;
        }
        res();
      });

    (async () => {
      await Promise.all(list.map(load));
      if (mounted) setReady(true);
      sessionStorage.setItem("heroAssetsCached", "true"); // remember
    })();

    return () => { mounted = false; };
  }, [list]);

  return ready;
}

/* ─────────────────────────────────────────────
   3.  Gather every asset URL with require.context
───────────────────────────────────────────── */
const ctx = require.context(
  "./assets",
  true,
  /\.(png|jpe?g|gif|webm|mp4|woff2?|ttf|otf)$/i
);
const preloadList = ctx.keys().map((k) => {
  const mod = ctx(k);
  return typeof mod === "string" ? mod : mod.default || mod;
});

/* ─────────────────────────────────────────────
   4.  Component
───────────────────────────────────────────── */
export default function HeroBanner() {
  const heroRef  = useRef(null);
  const introRef = useRef(null);
  const videoRef = useRef(null);
  const footerRef = useRef(null);

  const navigate = useNavigate();

  const [showIntro, setShowIntro]   = useState(
    sessionStorage.getItem("heroIntroSeen") !== "true"
  );
  const [navLoading, setNavLoading] = useState(false);
  const [section, setSection]       = useState("hero");

  /* preload everything (skipped if cached already) */
  const allReady = usePreload(preloadList);

  /* play intro once */
  useEffect(() => {
    if (!showIntro) return;
    const v = introRef.current;
    v.muted = true; v.playsInline = true; v.play().catch(() => {});
    const done = () => {
      setShowIntro(false);
      sessionStorage.setItem("heroIntroSeen", "true");
    };
    v.addEventListener("ended", done);
    return () => v.removeEventListener("ended", done);
  }, [showIntro]);

  /* loop bg video after intro */
  useEffect(() => {
    if (showIntro) return;
    const v = videoRef.current;
    v.loop = true; v.muted = true; v.playsInline = true; v.play().catch(() => {});
  }, [showIntro]);

  /* wheel snap hero ⇄ footer */
  useEffect(() => {
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) < 20) return;
      if (section === "hero" && e.deltaY > 0) {
        e.preventDefault();
        footerRef.current.scrollIntoView({ behavior: "smooth" });
        setSection("footer");
      } else if (section === "footer" && e.deltaY < 0) {
        e.preventDefault();
        heroRef.current.scrollIntoView({ behavior: "smooth" });
        setSection("hero");
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [section]);

  const nav = (p) => { setNavLoading(true); setTimeout(() => navigate(p), 300); };

  /* ─── show spinner only on very first visit ─── */
  if (showIntro || navLoading || !allReady) {
    return (
      <section ref={heroRef} className="hero-banner">
        <div className="video-banner">
          <video
            ref={showIntro ? introRef : videoRef}
            className="background-video"
            src={showIntro ? introVideo : bgVideo}
            autoPlay
            muted
            playsInline
          />
        </div>
        <div className="loading-screen"><div className="spinner" /></div>
      </section>
    );
  }

  /* ─── fully ready & cached ─── */
  return (
    <>
     <RotatePrompt /> {/* Overlay added here */}
      <section ref={heroRef} className="hero-banner ready">
        {/* loop video */}
        <div className="video-banner">
          <video
            ref={videoRef}
            className="background-video"
            src={bgVideo}
            autoPlay
            muted
            loop
            playsInline
          />
        </div>

        {/* seam bridge */}
        <video
          src={seamBridge}
          autoPlay
          loop
          muted
          playsInline
          className="seam-bridge seam-bridge--bottom"
        />

        {/* blue bars */}
        <div className="progress-overlay">
          <img src={lineImg} alt="" />
        </div>
        <div className="progress-overlay-right">
          <img src={lineImg} alt="" />
        </div>

        {/* labels */}
        <div className="banner-overlay">
          <div className="banner-labels">
            <span className="cta-label" onClick={() => nav("/jetboard")}>
              JETBOARD
            </span>
            <span className="cta-label" onClick={() => nav("/ejet")}>
              E-JET
            </span>
          </div>
        </div>
      </section>

      <div ref={footerRef}><Footer /></div>
    </>
  );
}















