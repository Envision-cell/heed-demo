
// /* ─────────────────────────────────────────────
//    Jetboard.js  (Create-React-App / Webpack)
// ───────────────────────────────────────────── */
// import React, {
//   useLayoutEffect,
//   useRef,
//   useState,
//   forwardRef
// } from "react";

// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useNavigate } from "react-router-dom";
// import { killSectionScrollTriggers } from "../helpers/gsap-utils";

// import "../components/JetBoard.css";
// import lineImg from "../assets/line.gif";

// gsap.registerPlugin(ScrollTrigger);

// /* ───────── ❶  GLOBAL CACHE (lives entire tab) ───────── */
// const cachedFrames = [];         // will hold 103 Image objects
// let   framesReady  = false;

// /* ───────── ❷  CONSTANTS ───────── */
// const FRAME_COUNT        = 103;
// const SCROLL_DISTANCE    = 6500;
// const BASE_DAMPING       = 0.3;
// const framePath = (i) =>
//   `/images/jetframes/heed0001${String(i).padStart(3, "0")}.png`;

// /* ───────── ❸  COMPONENT ───────── */
// const Jetboard = forwardRef((props, outerRef) => {
//   const containerRef = useRef(null);
//   const canvasRef    = useRef(null);
//   const overlayRef   = useRef(null);
//   const images       = useRef([]);
//   const navigate     = useNavigate();

//   const [loaded,  setLoaded]  = useState(false);
//   const [closed,  setClosed]  = useState(false);

//   /* ─── preload PNG frames (one-time per tab) ─── */
//   useLayoutEffect(() => {
//     /* Skip network if already in cache */
//     if (framesReady) {
//       images.current = cachedFrames;
//       setLoaded(true);
//       return;
//     }

//     /* First visit – actually load */
//     let mounted = true;
//     const load = (idx) =>
//       new Promise((res) => {
//         const img = new Image();
//         img.onload  = () => { if (mounted) images.current[idx] = img; res(); };
//         img.onerror = res;
//         img.decoding = "async";
//         img.src     = framePath(idx);
//       });

//     (async () => {
//       for (let i = 0; i < FRAME_COUNT; i += 20) {
//         await Promise.all(
//           Array.from({ length: 20 }, (_, k) =>
//             i + k < FRAME_COUNT ? load(i + k) : null
//           )
//         );
//       }
//       if (!mounted) return;

//       /* copy into module cache for later visits */
//       framesReady = true;
//       cachedFrames.length = FRAME_COUNT;
//       for (let i = 0; i < FRAME_COUNT; i++) cachedFrames[i] = images.current[i];

//       setLoaded(true);
//     })();

//     return () => { mounted = false; };
//   }, []);

//   /* ─── GSAP: canvas scrub + overlay fade ─── */
//   useLayoutEffect(() => {
//     if (!loaded || closed) return;

//     const ctxScope = gsap.context(() => {
//       const canvas = canvasRef.current;
//       const ctx2d  = canvas.getContext("2d");

//       /* draw helper */
//       const draw = (idx) => {
//         const img = images.current[idx % FRAME_COUNT];
//         if (!img) return;

//         const dpr = window.devicePixelRatio || 1;
//         const cw  = containerRef.current.offsetWidth;
//         const ch  = containerRef.current.offsetHeight;

//         canvas.width  = cw * dpr;
//         canvas.height = ch * dpr;
//         canvas.style.width  = `${cw}px`;
//         canvas.style.height = `${ch}px`;
//         ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);

//         const scale = Math.min(cw / img.width, ch / img.height);
//         const x = (cw - img.width  * scale) / 2;
//         const y = (ch - img.height * scale) / 2;

//         ctx2d.clearRect(0, 0, cw, ch);
//         ctx2d.drawImage(img, x, y, img.width * scale, img.height * scale);
//       };

//       /* initial resize */
//       const onResize = () => draw(0);
//       window.addEventListener("resize", onResize);
//       onResize();

//       /* scroll-scrub */
//       let cur = 0, lastT = 0, lastY = 0, vel = 0;
//       gsap.to({ t: 0 }, {
//         t: 1,
//         ease: "none",
//         scrollTrigger: {
//           trigger : containerRef.current,
//           start   : "top top",
//           end     : `+=${SCROLL_DISTANCE}`,
//           scrub   : true,
//           pin     : true,
//           onUpdate(self) {
//             const now = performance.now();
//             if (lastT) {
//               const dt = (now - lastT) / 1000;
//               const dy = self.scroll() - lastY;
//               vel = vel * 0.8 + (dy / dt) * 0.2;
//             }
//             lastT = now; lastY = self.scroll();

//             const damp   = Math.min(0.5, BASE_DAMPING + Math.abs(vel) / 2000);
//             const target = self.progress * FRAME_COUNT;
//             cur += (target - cur) * damp;
//             if (Math.abs(target - cur) < 0.5) cur = target;
//             draw(Math.round(cur));
//           }
//         }
//       });

//       /* overlay fade in first 250 px */
//       ScrollTrigger.create({
//         start: 0,
//         end: 250,
//         scrub: true,
//         onUpdate: (self) =>
//           gsap.set(overlayRef.current, { autoAlpha: 1 - self.progress })
//       });

//       return () => window.removeEventListener("resize", onResize);
//     }, containerRef);

//     return () => ctxScope.revert();
//   }, [loaded, closed]);

//   /* ─── Handlers ─── */
//   const handleClose = () => {
//     killSectionScrollTriggers(containerRef.current);
//     gsap.set(containerRef.current, { clearProps: "all" });
//     setClosed(true);
//     navigate("/");
//   };

//   /* ─── Loader on first visit only ─── */
//   if (!loaded) return <div className="frame-loader" />;
//   if (closed)   return null;

//   /* ─── JSX ─── */
//   return (
//     <>
//       <div
//         ref={(el) => {
//           containerRef.current = el;
//           if (outerRef) outerRef.current = el;
//         }}
//         className="heed-ejet-section"
//       >
//         <button className="close-button-ejet" onClick={handleClose}>✕</button>

//         {/* left vertical bar */}
//         <div className="progress-overlay-ejet">
//           <img src={lineImg} alt="" />
//         </div>

//         {/* scroll label */}
//         <div ref={overlayRef} className="intro-overlay">
//           <span className="intro-text" style={{ fontFamily: "Ethnocentric" }}>
//             SCROLL
//           </span>
//         </div>

//         <canvas ref={canvasRef} />
//       </div>

//       {/* DATA SHEET SECTION */}
//       <section className="data-sheet-section">
//         <h2 style={{ marginBottom: "30px" }}>DATA&nbsp;SHEET</h2>

//         <div className="progress-overlay-under-ejet">
//           <img src={lineImg} alt="" />
//         </div>

//         <div
//           style={{
//             width: "100%",
//             display: "flex",
//             justifyContent: "center",
//             marginBottom: "20px"
//           }}
//         >
//           <p
//             style={{
//               fontFamily: "Meiryo, sans-serif",
//               fontSize: "12px",
//               whiteSpace: "nowrap",
//               margin: 0,
//               marginLeft: "-200px"
//             }}
//           >
//             ACCESS THE TECHNICAL SPEC PDF. SUBMIT YOUR EMAIL BELOW AND WE’LL
//             SEND THE COMPLETE TECHNICAL DOCUMENT STRAIGHT TO YOUR INBOX.
//           </p>
//         </div>

//         <form
//           className="newsletter-form"
//           onSubmit={async (e) => {
//             e.preventDefault();
//             const email = e.target.email.value;
//             try {
//               const rsp = await fetch("http://heedjetboards.com:3000/users", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email })
//               });
//               const js = await rsp.json();
//               alert(
//                 js.success
//                   ? "Check your inbox!"
//                   : js.error || "Please try again"
//               );
//               if (js.success) e.target.reset();
//             } catch {
//               alert("Something went wrong, please retry.");
//             }
//           }}
//         >
//           <input
//             type="email"
//             name="email"
//             placeholder="YOUR EMAIL"
//             required
//             style={{
//               padding: "10px 14px",
//               fontSize: "14px",
//               fontFamily: "Meiryo, sans-serif",
//               boxShadow: "0 2px 6px rgba(0,0,0,.15)",
//               border: "1px solid #ccc",
//               borderRadius: "6px",
//               outline: "none"
//             }}
//           />
//           <button
//             type="submit"
//             style={{ fontFamily: "OCTA, sans-serif", color: "white" }}
//           >
//             Send&nbsp;PDF
//           </button>
//         </form>
//       </section>
//     </>
//   );
// });

// export default Jetboard;


/* Jetboard.js — updated so animation resumes where it left off */
import React, { useLayoutEffect, useRef, useState, forwardRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import { killSectionScrollTriggers } from "../helpers/gsap-utils";

import "../components/JetBoard.css";
import lineImg from "../assets/line.gif";

gsap.registerPlugin(ScrollTrigger);

/* GLOBAL PNG‑frame cache */
const cachedFrames = [];
let   framesReady  = false;

/* CONSTANTS */
const FRAME_COUNT     = 103;
const SCROLL_DISTANCE = 6500;
const BASE_DAMPING    = 0.3;
const framePath = i => `/images/jetframes/heed0001${String(i).padStart(3,"0")}.png`;

const Jetboard = forwardRef((props, outerRef) => {
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);
  const overlayRef   = useRef(null);
  const progressRef  = useRef(null);
  const images       = useRef([]);
  const navigate     = useNavigate();

  const [loaded, setLoaded] = useState(false);
  const [closed, setClosed] = useState(false);

  /* preload frames once per tab */
  useLayoutEffect(() => {
    if (framesReady) { images.current = cachedFrames; setLoaded(true); return; }

    let mounted = true;
    const load = idx => new Promise(res => {
      const img = new Image();
      img.onload  = () => { if (mounted) images.current[idx] = img; res(); };
      img.onerror = res;
      img.decoding = "async";
      img.src = framePath(idx);
    });

    (async () => {
      for (let i = 0; i < FRAME_COUNT; i += 20) {
        await Promise.all(
          Array.from({ length: 20 }, (_, k) => i+k < FRAME_COUNT ? load(i+k) : null)
        );
      }
      if (!mounted) return;
      framesReady = true;
      cachedFrames.length = FRAME_COUNT;
      for (let i = 0; i < FRAME_COUNT; i++) cachedFrames[i] = images.current[i];
      setLoaded(true);
    })();

    return () => { mounted = false; };
  }, []);

  /* GSAP scroll animation */
  useLayoutEffect(() => {
    if (!loaded || closed) return;

    const ctxScope = gsap.context(() => {
      const canvas = canvasRef.current;
      const ctx2d  = canvas.getContext("2d");

      /* draw helper */
      const draw = idx => {
        const img = images.current[idx % FRAME_COUNT];
        if (!img) return;

        const dpr = window.devicePixelRatio || 1;
        const cw  = containerRef.current.offsetWidth;
        const ch  = containerRef.current.offsetHeight;

        canvas.width  = cw * dpr;
        canvas.height = ch * dpr;
        canvas.style.width  = `${cw}px`;
        canvas.style.height = `${ch}px`;
        ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);

        const scale = Math.min(cw / img.width, ch / img.height);
        const x = (cw - img.width  * scale) / 2;
        const y = (ch - img.height * scale) / 2;

        ctx2d.clearRect(0, 0, cw, ch);
        ctx2d.drawImage(img, x, y, img.width * scale, img.height * scale);
      };

      /* keep a reference to the ScrollTrigger */
      let st;                       // NEW
      /* redraw current frame on resize (instead of frame 0) */
      const onResize = () => {
        if (st) draw(Math.round(st.progress * FRAME_COUNT));
      };
      window.addEventListener("resize", onResize);

      /* scroll‑scrubbed animation */
      let cur = 0, lastT = 0, lastY = 0, vel = 0;
      const tween = gsap.to({ t: 0 }, {
        t: 1,
        ease: "none",
        scrollTrigger: {
          trigger : containerRef.current,
          start   : "top top",
          end     : `+=${SCROLL_DISTANCE}`,
          scrub   : true,
          pin     : true,
          onLeave: () => {
            containerRef.current.classList.add("hidden-white");
            gsap.set(
              [canvasRef.current, overlayRef.current, progressRef.current],
              { autoAlpha: 0 }
            );
            gsap.set(containerRef.current, { pointerEvents: "none" });
          },
          onEnterBack: () => {
            containerRef.current.classList.remove("hidden-white");
            gsap.set(
              [canvasRef.current, overlayRef.current, progressRef.current],
              { autoAlpha: 1 }
            );
            /* make “SCROLL” label opacity match current progress instantly */
            gsap.set(overlayRef.current, { autoAlpha: 1 - st.progress });
            gsap.set(containerRef.current, { pointerEvents: "auto" });
          },
          onUpdate(self) {
            const now = performance.now();
            if (lastT) {
              const dt = (now - lastT) / 1000;
              const dy = self.scroll() - lastY;
              vel = vel * 0.8 + (dy / dt) * 0.2;
            }
            lastT = now; lastY = self.scroll();

            const damp   = Math.min(0.5, BASE_DAMPING + Math.abs(vel) / 2000);
            const target = self.progress * FRAME_COUNT;
            cur += (target - cur) * damp;
            if (Math.abs(target - cur) < 0.5) cur = target;
            draw(Math.round(cur));
          }
        }
      });

      st = tween.scrollTrigger;     // NEW (after tween is created)
      draw(Math.round(st.progress * FRAME_COUNT)); // initial draw at correct frame

      /* fade “SCROLL” label only for first 250 px */
      ScrollTrigger.create({
        start: 0,
        end: 250,
        scrub: true,
        onUpdate: self =>
          gsap.set(overlayRef.current, { autoAlpha: 1 - self.progress })
      });

      return () => {
        window.removeEventListener("resize", onResize);
      };
    }, containerRef);

    return () => ctxScope.revert();
  }, [loaded, closed]);

  /* close handler */
  const handleClose = () => {
    killSectionScrollTriggers(containerRef.current);
    gsap.set(containerRef.current, { clearProps: "all" });
    setClosed(true);
    navigate("/");
  };

  if (!loaded) return <div className="frame-loader" />;
  if (closed)   return null;

  return (
    <>
      <div
        ref={el => {
          containerRef.current = el;
          if (outerRef) outerRef.current = el;
        }}
        className="heed-ejet-section"
      >
        <button className="close-button-ejet" onClick={handleClose}>✕</button>

        {/* progress bar */}
        <div className="progress-overlay-ejet" ref={progressRef}>
          <img src={lineImg} alt="" />
        </div>

        {/* scroll label */}
        <div ref={overlayRef} className="intro-overlay">
          <span className="intro-text" style={{ fontFamily: "Ethnocentric" }}>
            SCROLL
          </span>
        </div>

        <canvas ref={canvasRef} />
      </div>

      {/* DATA SHEET SECTION */}
      <section className="data-sheet-section">
            <h2 style={{ marginBottom: "30px" }}>DATA&nbsp;SHEET</h2>

         <div className="progress-overlay-under-ejet">
           <img src={lineImg} alt="" />
         </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px"
          }}
        >
          <p
            style={{
              fontFamily: "Meiryo, sans-serif",
            }}
          >
            ACCESS THE TECHNICAL SPEC PDF. SUBMIT YOUR EMAIL BELOW AND WE’LL
            SEND THE COMPLETE TECHNICAL DOCUMENT STRAIGHT TO YOUR INBOX.
          </p>
        </div>

        <form
          className="newsletter-form"
          onSubmit={async (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            try {
              const rsp = await fetch("http://localhost:5000/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email ,type: 'Data-sheet'})
              });
              const js = await rsp.json();
            
              alert(
                rsp.ok && js.id
                  ? "Check your inbox!"
                  : js.error || "Please try again"
              );
              if (js.success) e.target.reset();
            } catch {
              alert("Something went wrong, please retry.");
            }
          }}
        >
          <input
            type="email"
            name="email"
            placeholder="YOUR EMAIL"
            required
            style={{
              padding: "10px 14px",
              fontSize: "14px",
              fontFamily: "Meiryo, sans-serif",
              boxShadow: "0 2px 6px rgba(0,0,0,.15)",
              border: "1px solid #ccc",
              borderRadius: "6px",
              outline: "none"
            }}
          />
          <button
            type="submit"
            style={{ fontFamily: "OCTA, sans-serif", color: "white" }}
          >
            Send&nbsp;PDF
          </button>
        </form>
      </section>
    </>
  );
});

export default Jetboard;
