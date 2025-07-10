// // /* eslint-disable react-hooks/exhaustive-deps */
// // import React, { useLayoutEffect, useRef, useState, forwardRef } from "react";
// // import { gsap } from "gsap";
// // import { ScrollTrigger } from "gsap/ScrollTrigger";
// // import { useNavigate } from "react-router-dom";
// // import { killSectionScrollTriggers } from "../helpers/gsap-utils";
// // import "./EjetSection.css";               // <- make sure path is correct

// // gsap.registerPlugin(ScrollTrigger);

// // /* ─── constants ─── */
// // const FRAME_COUNT        = 100;
// // const SCROLL_DISTANCE    = 4500;          // px of pin duration
// // const BASE_DAMPING       = 0.3;
// // const framePath = (i) =>
// //   `/images/frames/heed${String(100 + i).padStart(6, "0")}.png`;

// // const EjetSection = forwardRef((props, outerRef) => {
// //   /* refs */
// //   const containerRef = useRef(null);
// //   const canvasRef    = useRef(null);
// //   const overlayRef   = useRef(null);      // full-page “SCROLL” overlay
// //   const images       = useRef([]);

// //   /* state */
// //   const [loaded, setLoaded] = useState(false);
// //   const [closed, setClosed] = useState(false);
// //   const navigate   = useNavigate();

// //   /* ─── preload PNG frames ─── */
// //   useLayoutEffect(() => {
// //     let mounted = true;
// //     const load = (idx) =>
// //       new Promise((res) => {
// //         const img = new Image();
// //         img.onload  = () => { if (mounted) images.current[idx] = img; res(); };
// //         img.onerror = res;
// //         img.src = framePath(idx);
// //       });

// //     (async () => {
// //       for (let i = 0; i < FRAME_COUNT; i += 4) {
// //         await Promise.all(
// //           Array.from({ length: 4 }, (_, k) =>
// //             i + k < FRAME_COUNT ? load(i + k) : null
// //           )
// //         );
// //       }
// //       if (mounted) setLoaded(true);
// //     })();

// //     return () => (mounted = false);
// //   }, []);

// //   /* ─── GSAP canvas + overlay logic ─── */
// //   useLayoutEffect(() => {
// //     if (!loaded || closed) return;

// //     const ctxScope = gsap.context(() => {
// //       const canvas   = canvasRef.current;
// //       const ctx2d    = canvas.getContext("2d");
// //       const overlay  = overlayRef.current;

// //       /* draw helper */
// //       const draw = (idx) => {
// //         const img = images.current[idx % FRAME_COUNT];
// //         if (!img) return;

// //         const dpr = window.devicePixelRatio || 1;
// //         const cw  = containerRef.current.offsetWidth;
// //         const ch  = containerRef.current.offsetHeight;

// //         canvas.width  = cw * dpr;
// //         canvas.height = ch * dpr;
// //         canvas.style.width  = `${cw}px`;
// //         canvas.style.height = `${ch}px`;
// //         ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);

// //         const scale = Math.min(cw / img.width, ch / img.height);
// //         const x = (cw - img.width  * scale) / 2;
// //         const y = (ch - img.height * scale) / 2;

// //         ctx2d.clearRect(0, 0, cw, ch);
// //         ctx2d.drawImage(img, x, y, img.width * scale, img.height * scale);
// //       };

// //       /* resize => redraw first frame */
// //       const onResize = () => draw(0);
// //       window.addEventListener("resize", onResize);
// //       onResize();

// //       /* scroll-scrubbed frame animation */
// //       let cur = 0, lastT = 0, lastY = 0, vel = 0;
// //       gsap.to({ t: 0 }, {
// //         t: 1,
// //         ease: "none",
// //         scrollTrigger: {
// //           trigger : containerRef.current,
// //           start   : "top top",
// //           end     : `+=${SCROLL_DISTANCE}`,
// //           scrub   : true,
// //           pin     : true,
// //           onUpdate: self => {
// //             const now = performance.now();
// //             if (lastT) {
// //               const dt = (now - lastT) / 1000;
// //               const dy = self.scroll() - lastY;
// //               vel = vel * 0.8 + (dy / dt) * 0.2;
// //             }
// //             lastT = now; lastY = self.scroll();

// //             const damp   = Math.min(0.5, BASE_DAMPING + Math.abs(vel) / 2000);
// //             const target = self.progress * FRAME_COUNT;
// //             cur += (target - cur) * damp;
// //             if (Math.abs(target - cur) < 0.5) cur = target;

// //             draw(Math.round(cur));
// //           }
// //         }
// //       });

// //       /* overlay fade: first 250 px of page scroll */
// //       if (overlay) {
// //         ScrollTrigger.create({
// //           start : 0,
// //           end   : 250,
// //           scrub : true,
// //           onUpdate: self =>
// //             gsap.set(overlay, { autoAlpha: 1 - self.progress })
// //         });
// //       }

// //       return () => window.removeEventListener("resize", onResize);
// //     }, containerRef);

// //     return () => ctxScope.revert();
// //   }, [loaded, closed]);

// //   /* ─── close handler ─── */
// //   const handleClose = () => {
// //     killSectionScrollTriggers(containerRef.current);
// //     gsap.set(containerRef.current, { clearProps: "all" });
// //     setClosed(true);
// //     navigate("/");
// //   };

// //   if (closed) return null;

// //   /* ─── JSX ─── */
// //   return (
// //     <>
// //     <div
// //       ref={(el) => {
// //         containerRef.current = el;
// //         if (outerRef) outerRef.current = el;
// //       }}
// //       className="heed-jet-section"
// //     >
// //       <button className="close-button-jet" onClick={handleClose}>
// //         ✕
// //       </button>

// //       {/* full-screen overlay */}
// //       <div ref={overlayRef} className="intro-overlay">
// //         <span className="intro-text">SCROLL</span>
// //       </div>

// //       <canvas ref={canvasRef} />
// //     </div>
// //      <section className="data-sheet-section-jet">
// //         <h2>DATA&nbsp;SHEET</h2>
// //         <p>Want the full technical PDF? Drop your email – we’ll send it right away.</p>

// //         <form
// //           className="newsletter-form"
// //           onSubmit={async e=>{
// //             e.preventDefault();
// //             const email = e.target.email.value;
// //             try{
// //               const rsp = await fetch("http://heedjetboards.com:3000/users",{
// //                 method:"POST",
// //                 headers:{ "Content-Type":"application/json" },
// //                 body:JSON.stringify({ email })
// //               });
// //               const js = await rsp.json();
// //               alert(js.success ? "Check your inbox!" : (js.error||"Please try again"));
// //               if (js.success) e.target.reset();
// //             }catch{ alert("Something went wrong, please retry."); }
// //           }}
// //         >
// //           <input type="email" name="email" placeholder="Your email" required/>
// //           <button type="submit">Send&nbsp;PDF</button>
// //         </form>
// //       </section>

// //     </>
// //   );
// // });

// // export default EjetSection;

// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useLayoutEffect, useRef, useState, forwardRef } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useNavigate } from "react-router-dom";
// import { killSectionScrollTriggers } from "../helpers/gsap-utils";
// import "./EjetSection.css";               // <- make sure path is correct

// gsap.registerPlugin(ScrollTrigger);

// /* ─── constants ─── */
// const FRAME_COUNT        = 100;
// const SCROLL_DISTANCE    = 4500;          // px of pin duration
// const BASE_DAMPING       = 0.3;
// const framePath = (i) =>
//   `/images/frames/heed${String(100 + i).padStart(6, "0")}.png`;

// const EjetSection = forwardRef((props, outerRef) => {
//   /* refs */
//   const containerRef = useRef(null);
//   const canvasRef    = useRef(null);
//   const overlayRef   = useRef(null);
//   const images       = useRef([]);
//   const navigate     = useNavigate();

//   /* state */
//   const [loaded, setLoaded] = useState(false);
//   const [closed, setClosed] = useState(false);

//   /* ─── preload PNG frames ─── */
//   useLayoutEffect(() => {
//     let mounted = true;
//     const load = (idx) =>
//       new Promise((res) => {
//         const img = new Image();
//         img.onload  = () => { if (mounted) images.current[idx] = img; res(); };
//         img.onerror = res;
//         img.src = framePath(idx);
//       });

//     (async () => {
//       for (let i = 0; i < FRAME_COUNT; i += 4) {
//         await Promise.all(
//           Array.from({ length: 4 }, (_, k) =>
//             i + k < FRAME_COUNT ? load(i + k) : null
//           )
//         );
//       }
//       if (mounted) setLoaded(true);
//     })();

//     return () => (mounted = false);
//   }, []);

//   /* ─── GSAP canvas + overlay logic ─── */
//   useLayoutEffect(() => {
//     if (!loaded || closed) return;

//     const ctxScope = gsap.context(() => {
//       const canvas   = canvasRef.current;
//       const ctx2d    = canvas.getContext("2d");
//       const overlay  = overlayRef.current;

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

//       /* resize => redraw first frame */
//       const onResize = () => draw(0);
//       window.addEventListener("resize", onResize);
//       onResize();

//       /* scroll-scrubbed frame animation */
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

//       /* overlay fade: first 250 px of page scroll */
//       if (overlay) {
//         ScrollTrigger.create({
//           start : 0,
//           end   : 250,
//           scrub : true,
//           onUpdate: self =>
//             gsap.set(overlay, { autoAlpha: 1 - self.progress })
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

//   /* ─── scroll-to-top ─── */
//   const scrollToTop = () =>
//     window.scrollTo({ top: 0, behavior: "smooth" });

//   if (closed) return null;

//   return (
//     <>
//       <div
//         ref={(el) => {
//           containerRef.current = el;
//           if (outerRef) outerRef.current = el;
//         }}
//         className="heed-jet-section"
//       >
//         <button className="close-button-jet" onClick={handleClose}>
//           ✕
//         </button>

//         <div ref={overlayRef} className="intro-overlay">
//           <span className="intro-text">SCROLL</span>
//         </div>

//         <canvas ref={canvasRef} />
//       </div>

//       <section className="data-sheet-section-jet">
//         <h2>DATA&nbsp;SHEET</h2>
//         <p>Want the full technical PDF? Drop your email – we’ll send it right away.</p>

//         <form
//           className="newsletter-form"
//           onSubmit={async e => {
//             e.preventDefault();
//             const email = e.target.email.value;
//             try {
//               const rsp = await fetch("http://heedjetboards.com:3000/users", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email })
//               });
//               const js = await rsp.json();
//               alert(js.success ? "Check your inbox!" : js.error || "Please try again");
//               if (js.success) e.target.reset();
//             } catch {
//               alert("Something went wrong, please retry.");
//             }
//           }}
//         >
//           <input type="email" name="email" placeholder="Your email" required/>
//           <button type="submit">Send&nbsp;PDF</button>
//         </form>
//       </section>

//       {/* ─── Scroll-to-Top Button ─── */}
//       <button
//         className="scroll-top-button"
//         onClick={scrollToTop}
//         aria-label="Back to top"
//       />
//     </>
//   );
// });

// export default EjetSection;



/* eslint-disable react-hooks/exhaustive-deps */
import React, { useLayoutEffect, useRef, useState, forwardRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import { killSectionScrollTriggers } from "../helpers/gsap-utils";
import "./EjetSection.css";               // <- make sure path is correct

gsap.registerPlugin(ScrollTrigger);

/* ─── constants ─── */
const FRAME_COUNT        = 100;
const SCROLL_DISTANCE    = 4500;          // px of pin duration
const BASE_DAMPING       = 0.3;
const framePath = (i) =>
  `/images/frames/heed${String(100 + i).padStart(6, "0")}.png`;

const EjetSection = forwardRef((props, outerRef) => {
  /* refs */
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);
  const overlayRef   = useRef(null);
  const images       = useRef([]);
  const navigate     = useNavigate();

  /* state */
  const [loaded, setLoaded] = useState(false);
  const [closed, setClosed] = useState(false);

  /* ─── preload PNG frames ─── */
  useLayoutEffect(() => {
    let mounted = true;
    const load = (idx) =>
      new Promise((res) => {
        const img = new Image();
        img.onload  = () => { if (mounted) images.current[idx] = img; res(); };
        img.onerror = res;
        img.src = framePath(idx);
      });

    (async () => {
      for (let i = 0; i < FRAME_COUNT; i += 4) {
        await Promise.all(
          Array.from({ length: 4 }, (_, k) =>
            i + k < FRAME_COUNT ? load(i + k) : null
          )
        );
      }
      if (mounted) setLoaded(true);
    })();

    return () => (mounted = false);
  }, []);

  /* ─── GSAP canvas + overlay logic ─── */
  useLayoutEffect(() => {
    if (!loaded || closed) return;

    const ctxScope = gsap.context(() => {
      const canvas   = canvasRef.current;
      const ctx2d    = canvas.getContext("2d");
      const overlay  = overlayRef.current;

      /* draw helper */
      const draw = (idx) => {
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

      /* resize => redraw first frame */
      const onResize = () => draw(0);
      window.addEventListener("resize", onResize);
      onResize();

      /* scroll-scrubbed frame animation */
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

      /* overlay fade: first 250 px of page scroll */
      if (overlay) {
        ScrollTrigger.create({
          start : 0,
          end   : 250,
          scrub : true,
          onUpdate: self =>
            gsap.set(overlay, { autoAlpha: 1 - self.progress })
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

  /* ─── scroll-to-top ─── */
  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  if (closed) return null;

  return (
    <>
      <div
        ref={(el) => {
          containerRef.current = el;
          if (outerRef) outerRef.current = el;
        }}
        className="heed-jet-section"
      >
        <button className="close-button-jet" onClick={handleClose}>
          ✕
        </button>

        <div ref={overlayRef} className="intro-overlay">
          <span className="intro-text">SCROLL</span>
        </div>

        <canvas ref={canvasRef} />
      </div>

      <section className="data-sheet-section-jet">
        <h2>DATA&nbsp;SHEET</h2>
        <p>Want the full technical PDF? Drop your email – we’ll send it right away.</p>

        <form
          className="newsletter-form"
          onSubmit={async e => {
            e.preventDefault();
            const email = e.target.email.value;
            try {
              const rsp = await fetch("http://heedjetboards.com:3000/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
              });
              const js = await rsp.json();
              alert(js.success ? "Check your inbox!" : js.error || "Please try again");
              if (js.success) e.target.reset();
            } catch {
              alert("Something went wrong, please retry.");
            }
          }}
        >
          <input type="email" name="email" placeholder="Your email" required/>
          <button type="submit">Send&nbsp;PDF</button>
        </form>
      </section>

      {/* ─── Scroll-to-Top Button ─── */}
      <button
        className="scroll-top-button"
        onClick={scrollToTop}
        aria-label="Back to top"
      />
    </>
  );
});

export default EjetSection;
