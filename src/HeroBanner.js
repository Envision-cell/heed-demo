import React, { useRef, useEffect, useLayoutEffect, useState } from "react";
import "./HeroBanner.css";

import bgVideo       from "./assets/heed_Logo.mp4";
import introVideo    from "./assets/heed_Logo.mp4";
import overlayFooter from "./assets/overlay-footer.mp4";

import Header from "./components/Header";
import Footer from "./components/Footer";

import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";

export default function HeroBanner() {
  const introRef   = useRef();
  const videoRef   = useRef();
  const heroRef    = useRef();
  const footerRef  = useRef();
  const lineRef    = useRef();
  const btnJetRef  = useRef();
  const btnEJetRef = useRef();
  const overlayRef = useRef();

  const navigate    = useNavigate();
  const [showIntro, setShowIntro]   = useState(() =>
    sessionStorage.getItem("heroIntroSeen") !== "true"
  );
  const [section, setSection]       = useState(() =>
    sessionStorage.getItem("heroSection") || "hero"
  );
  const [navLoading, setNavLoading] = useState(false);

  // Play intro once
  useEffect(() => {
    if (!showIntro) return;
    const v = introRef.current;
    v.muted = true; v.playsInline = true;
    v.play().catch(() => {});
    const done = () => {
      setShowIntro(false);
      sessionStorage.setItem("heroIntroSeen", "true");
    };
    v.addEventListener("ended", done);
    return () => v.removeEventListener("ended", done);
  }, [showIntro]);

  // Loop background video
  useEffect(() => {
    if (showIntro) return;
    const v = videoRef.current;
    if (!v) return;
    v.loop = true; v.muted = true; v.playsInline = true;
    v.play().catch(() => {});
  }, [showIntro]);

  // Scroll-snap
  useEffect(() => {
    let locked = false;
    const onWheel = e => {
      if (locked || Math.abs(e.deltaY) < 20) return;
      if (section === "hero" && e.deltaY > 0) {
        e.preventDefault(); locked = true;
        footerRef.current.scrollIntoView({ behavior: "smooth" });
        setSection("footer");
      } else if (section === "footer" && e.deltaY < 0) {
        e.preventDefault(); locked = true;
        heroRef.current.scrollIntoView({ behavior: "smooth" });
        setSection("hero");
      }
      setTimeout(() => (locked = false), 600);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [section]);

  // Persist section
  useEffect(() => sessionStorage.setItem("heroSection", section), [section]);
  useEffect(() => {
    if (section === "footer") footerRef.current?.scrollIntoView({ behavior: "auto" });
  }, []);

  // Sweep-line + button pop
  useLayoutEffect(() => {
    if (showIntro) return;
    const line = lineRef.current;
    const btns = [btnJetRef.current, btnEJetRef.current];
    if (!line || !btns.every(Boolean)) return;

    const holder = line.parentElement.getBoundingClientRect();
    const W      = holder.width;
    const D      = 3;
    const LW     = line.offsetWidth || 0;

    const tl = gsap.timeline({ repeat: -1 });
    tl.set(line, { x: -W });
    tl.to(line, { x: W + LW, duration: D, ease: "none" }, 0);

    btns.forEach(btn => {
      const r     = btn.getBoundingClientRect();
      const start = ((r.left  - holder.left - LW) / W) * D;
      const end   = ((r.right - holder.left)       / W) * D;
      tl.to(btn, { opacity: 1, duration: 0.15 }, start);
      tl.to(btn, { opacity: 0,    duration: 0.15 }, end);
    });

    return () => tl.kill();
  }, [showIntro]);

  // Fade seam‐overlay in/out
  useEffect(() => {
    if (!overlayRef.current) return;
    gsap.to(overlayRef.current, {
      opacity: section === "footer" ? 1 : 0,
      duration: 0.5,
      ease: "power1.out",
    });
  }, [section]);

  const scrollToFooter = () => {
    footerRef.current?.scrollIntoView({ behavior: "smooth" });
    setSection("footer");
  };
  const handleNavigate = path => {
    setNavLoading(true);
    setTimeout(() => navigate(path), 300);
  };

  // Intro / Loading
  if (showIntro || navLoading) {
    return (
      <section ref={heroRef} className="hero-banner">
        <div className="video-banner">
          <video
            ref={showIntro ? introRef : videoRef}
            className="background-video"
            src={showIntro ? introVideo : bgVideo}
            autoPlay muted loop={!showIntro} playsInline
          />
        </div>
        {navLoading && (
          <div className="loading-screen"><div className="spinner"/></div>
        )}
      </section>
    );
  }

  // Main
  return (
    <div className="hero-page-wrapper">
      <Header />

      <section ref={heroRef} className="hero-banner">
        <div className="video-banner">
          <video
            ref={videoRef}
            className="background-video"
            src={bgVideo}
            autoPlay muted loop playsInline
          />
        </div>

        <div className="banner-overlay">
          <div ref={lineRef} className="sweep-line"/>

          <div className="banner-buttons">
            <button
              ref={btnJetRef}
              className="cta-button"
              onClick={() => handleNavigate("/jetboard")}
            >
              JETBOARD
            </button>
            <button
              ref={btnEJetRef}
              className="cta-button"
              onClick={() => handleNavigate("/ejet")}
            >
              E-JET
            </button>
          </div>

          <div className="hero-fade"/>
          <button className="scroll-down" onClick={scrollToFooter}>↓</button>
        </div>
      </section>

      <div className="seam-overlay" ref={overlayRef}>
        <video
          className="seam-overlay__video"
          src={overlayFooter}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      <div ref={footerRef} className="footer-wrapper">
        <Footer />
      </div>
    </div>
  );
}
