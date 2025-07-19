

// /* ─────────────────────────────────────────────
//    EjetSection.js   (Create-React-App / Webpack)
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

// import "./EjetSection.css";
// import lineImg from "../assets/line.gif";

// gsap.registerPlugin(ScrollTrigger);

// /* ─────────────────────────────────────────────
//    1.  Global PNG-frame cache (lives as long as tab)
// ───────────────────────────────────────────── */
// const cachedFrames = [];     // will hold Image instances
// let   framesReady  = false;  // flip true after first load

// /* ─────────────────────────────────────────────
//    2.  Constants
// ───────────────────────────────────────────── */
// const FRAME_COUNT     = 100;
// const SCROLL_DISTANCE = 4500;     // px of pin duration
// const BASE_DAMPING    = 0.3;
// const framePath = (i) =>
//   `/images/frames/heed${String(100 + i).padStart(6, "0")}.png`;

// /* ─────────────────────────────────────────────
//    3.  Component
// ───────────────────────────────────────────── */
// const EjetSection = forwardRef((props, outerRef) => {
//   /* refs */
//   const containerRef  = useRef(null);
//   const canvasRef     = useRef(null);
//   const overlayRef    = useRef(null);
//   const progressRef   = useRef(null);
//   const images        = useRef([]);

//   const navigate = useNavigate();

//   /* state */
//   const [loaded, setLoaded] = useState(false);
//   const [closed, setClosed] = useState(false);

//   /* ─── preload PNG frames (once per tab) ─── */
//   useLayoutEffect(() => {
//     /* 1️⃣  subsequent visit – skip network */
//     if (framesReady) {
//       images.current = cachedFrames;   // reuse
//       setLoaded(true);
//       return;
//     }

//     /* 2️⃣  first visit – actually load */
//     let mounted = true;
//     const load = (idx) =>
//       new Promise((res) => {
//         const img = new Image();
//         img.onload  = () => {
//           if (mounted) images.current[idx] = img;
//           res();
//         };
//         img.onerror = res;
//         img.decoding = "async";
//         img.src = framePath(idx);
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

//       /* save to cache for future mounts */
//       framesReady = true;
//       cachedFrames.length = FRAME_COUNT;
//       for (let i = 0; i < FRAME_COUNT; i++) cachedFrames[i] = images.current[i];

//       setLoaded(true);
//     })();

//     return () => { mounted = false; };
//   }, []);

//   /* ─── GSAP canvas + overlay logic ─── */
//   useLayoutEffect(() => {
//     if (!loaded || closed) return;

//     const ctxScope = gsap.context(() => {
//       const canvas  = canvasRef.current;
//       const ctx2d   = canvas.getContext("2d");
//       const overlay = overlayRef.current;

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

//       /* redraw first frame on resize */
//       const onResize = () => draw(0);
//       window.addEventListener("resize", onResize);
//       onResize();

//       /* scroll-scrubbed animation */
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
//           onUpdate: self => {
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

//       /* fade overlay in first 250 px */
//       if (overlay) {
//         ScrollTrigger.create({
//           start: 0,
//           end: 250,
//           scrub: true,
//           onUpdate: self => gsap.set(overlay, { autoAlpha: 1 - self.progress })
//         });
//       }

//       return () => window.removeEventListener("resize", onResize);
//     }, containerRef);

//     return () => ctxScope.revert();
//   }, [loaded, closed]);

//   /* ─── close handler ─── */
//   const handleClose = () => {
//     killSectionScrollTriggers(containerRef.current);
//     gsap.set(containerRef.current, { clearProps: "all" });
//     setClosed(true);
//     navigate("/");
//   };

//   /* ─── early loader (first visit only) ─── */
//   if (!loaded) {
//     return <div className="frame-loader" />;   // spinner covers viewport
//   }
//   if (closed) return null;

//   /* ─── RENDER ─── */
//   return (
//     <>
//       <div
//         ref={(el) => {
//           containerRef.current = el;
//           if (outerRef) outerRef.current = el;
//         }}
//         className="heed-jet-section"
//       >
//         <button className="close-button-jet" onClick={handleClose}>✕</button>

//         {/* left vertical bar */}
//         <div className="progress-overlay-jet" ref={progressRef}>
//           <img src={lineImg} alt="" />
//         </div>

//         {/* “SCROLL” overlay */}
//         <div ref={overlayRef} className="intro-overlay">
//           <span className="intro-text" style={{ fontFamily: "Ethnocentric" }}>
//             SCROLL
//           </span>
//         </div>

//         <canvas ref={canvasRef} />
//       </div>

//       <section className="data-sheet-section-jet">
//         <h2 style={{ fontSize: "60px" }}>PRODUCT&nbsp;SPECIFICATION</h2>

//         {/* underline bar */}
//         <div className="progress-overlay-under">
//           <img src={lineImg} alt="" />
//         </div>

//         <p style={{ fontFamily: "Meiryo, sans-serif", fontSize: "12px" }}>
//           ACCESS THE TECHNICAL SPEC PDF. SUBMIT YOUR EMAIL BELOW AND WE’LL SEND
//           THE COMPLETE TECHNICAL DOCUMENT STRAIGHT TO YOUR INBOX.
//         </p>

//         {/* newsletter form */}
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
//                 js.success ? "Check your inbox!" : js.error || "Please try again"
//               );
//               if (js.success) e.target.reset();
//             } catch {
//               alert("Something went wrong, please retry.");
//             }
//           }}
//         >
//           <input type="email" name="email" placeholder="YOUR EMAIL" required />
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

// export default EjetSection;




/* ─────────────────────────────────────────────
   EjetSection.js   (Create‑React‑App / Webpack)
───────────────────────────────────────────── */
import React, {
  useLayoutEffect,
  useRef,
  useState,
  forwardRef
} from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import { killSectionScrollTriggers } from "../helpers/gsap-utils";

import "./EjetSection.css";
import lineImg from "../assets/line.gif";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   1. Global PNG‑frame cache (lives as long as tab)
───────────────────────────────────────────── */
const cachedFrames = [];
let   framesReady  = false;

/* ─────────────────────────────────────────────
   2. Constants
───────────────────────────────────────────── */
const FRAME_COUNT     = 100;
const SCROLL_DISTANCE = 4500;  // px of pin duration
const BASE_DAMPING    = 0.3;
const framePath = i =>
  `/images/frames/heed${String(100 + i).padStart(6, "0")}.png`;

/* ─────────────────────────────────────────────
   3. Component
───────────────────────────────────────────── */
const EjetSection = forwardRef((props, outerRef) => {
  /* refs */
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);
  const overlayRef   = useRef(null);
  const progressRef  = useRef(null);
  const images       = useRef([]);

  const navigate = useNavigate();

  /* state */
  const [loaded, setLoaded] = useState(false);
  const [closed, setClosed] = useState(false);

  /* ─── preload PNG frames (once per tab) ─── */
  useLayoutEffect(() => {
    /* 1️⃣ subsequent visit – skip network */
    if (framesReady) {
      images.current = cachedFrames;
      setLoaded(true);
      return;
    }

    /* 2️⃣ first visit – actually load */
    let mounted = true;
    const load = idx =>
      new Promise(res => {
        const img = new Image();
        img.onload  = () => { if (mounted) images.current[idx] = img; res(); };
        img.onerror = res;
        img.decoding = "async";
        img.src = framePath(idx);
      });

    (async () => {
      for (let i = 0; i < FRAME_COUNT; i += 20) {
        await Promise.all(
          Array.from({ length: 20 }, (_, k) =>
            i + k < FRAME_COUNT ? load(i + k) : null
          )
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

  /* ─── GSAP canvas + overlay logic ─── */
  useLayoutEffect(() => {
    if (!loaded || closed) return;

    const ctxScope = gsap.context(() => {
      const canvas  = canvasRef.current;
      const ctx2d   = canvas.getContext("2d");
      const overlay = overlayRef.current;

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

      /* redraw first frame on resize */
      const onResize = () => draw(0);
      window.addEventListener("resize", onResize);
      onResize();

      /* scroll‑scrubbed animation */
      let cur = 0, lastT = 0, lastY = 0, vel = 0;
      gsap.to({ t: 0 }, {
        t: 1,
        ease: "none",
        scrollTrigger: {
          trigger : containerRef.current,
          start   : "top top",
          end     : `+=${SCROLL_DISTANCE}`,
          scrub   : true,
          pin     : true,

          /* NEW: hide section after pin, show on reverse */
          onLeave:     () => gsap.set(containerRef.current, { autoAlpha: 0, pointerEvents: "none" }),
          onEnterBack: () => gsap.set(containerRef.current, { autoAlpha: 1, pointerEvents: "auto" }),

          onUpdate: self => {
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

      /* fade “SCROLL” overlay in first 250 px */
      if (overlay) {
        ScrollTrigger.create({
          start: 0,
          end: 250,
          scrub: true,
          onUpdate: self => gsap.set(overlay, { autoAlpha: 1 - self.progress })
        });
      }

      return () => window.removeEventListener("resize", onResize);
    }, containerRef);

    return () => ctxScope.revert();
  }, [loaded, closed]);

  /* ─── close handler ─── */
  const handleClose = () => {
    killSectionScrollTriggers(containerRef.current);
    gsap.set(containerRef.current, { clearProps: "all" });
    setClosed(true);
    navigate("/");
  };

  /* ─── early loader ─── */
  if (!loaded) return <div className="frame-loader" />;
  if (closed)   return null;

  /* ─── RENDER ─── */
  return (
    <>
      <div
        ref={el => {
          containerRef.current = el;
          if (outerRef) outerRef.current = el;
        }}
        className="heed-jet-section"
      >
        <button className="close-button-jet" onClick={handleClose}>✕</button>

        {/* left vertical bar */}
        <div className="progress-overlay-jet" ref={progressRef}>
          <img src={lineImg} alt="" />
        </div>

        {/* “SCROLL” overlay */}
        <div ref={overlayRef} className="intro-overlay">
          <span className="intro-text" style={{ fontFamily: "Ethnocentric" }}>
            SCROLL
          </span>
        </div>

        <canvas ref={canvasRef} />
      </div>

      <section className="data-sheet-section-jet">
        <h2 className="h2-jet">PRODUCT&nbsp;SPECIFICATION</h2>

        {/* underline bar */}
        <div className="progress-overlay-under">
          <img src={lineImg} alt="" />
        </div>

        <p style={{ fontFamily: "Meiryo, sans-serif", fontSize: "12px" }}>
          ACCESS THE TECHNICAL SPEC PDF. SUBMIT YOUR EMAIL BELOW AND WE’LL SEND
          THE COMPLETE TECHNICAL DOCUMENT STRAIGHT TO YOUR INBOX.
        </p>

        {/* newsletter form */}
        <form
          className="newsletter-form"
          onSubmit={async e => {
            e.preventDefault();
            const email = e.target.email.value;
            try {
              const rsp = await fetch("http://localhost:5000/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email ,type: 'Product-spec'})
              });
              const data  = await rsp.json();  
              alert( rsp.ok && data.id ? "Check your inbox!" : data.error || "Please try again");
              if (data.success) e.target.reset();
            } catch {
              alert("Something went wrong, please retry.");
            }
          }}
        >
          <input type="email" name="email" placeholder="YOUR EMAIL" required />
          <button type="submit" style={{ fontFamily: "OCTA, sans-serif", color: "white" }}>
            Send&nbsp;PDF
          </button>
        </form>
      </section>
    </>
  );
});

export default EjetSection;
