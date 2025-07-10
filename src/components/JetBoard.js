// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useLayoutEffect, useRef, useState, forwardRef } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useNavigate } from "react-router-dom";
// import { killSectionScrollTriggers } from "../helpers/gsap-utils";
// import "../components/JetBoard.css";

// gsap.registerPlugin(ScrollTrigger);

// const Jetboard = forwardRef((props, outerRef) => {
//   /* ───────── refs / state ───────── */
//   const canvasRef     = useRef(null);
//   const containerRef  = useRef(null);
//   const overlayRef    = useRef(null);   // ① FULL-SCREEN overlay
//   const images        = useRef([]);
//   const navigate      = useNavigate();

//   const [imagesLoaded, setImagesLoaded] = useState(false);
//   const [isClosed,     setIsClosed]     = useState(false);

//   /* ───────── constants ───────── */
//   const frameCount        = 103;
//   const scrollDistance    = 6500;
//   const baseDampingFactor = 0.3;
//   const currentFrame = (i) =>
//     `/images/jetframes/heed0001_${String(1000 + i).padStart(1, "0")}.png`;

//   /* ───────── preload PNG frames ───────── */
//   useLayoutEffect(() => {
//     let mounted = true;
//     const load = idx =>
//       new Promise(res => {
//         const img = new Image();
//         img.onload  = () => { if (mounted) images.current[idx] = img; res(); };
//         img.onerror = res;
//         img.src     = currentFrame(idx);
//       });

//     (async () => {
//       for (let i = 0; i < frameCount; i += 4) {
//         await Promise.all(
//           Array.from({ length: 4 }, (_, k) => (i + k < frameCount ? load(i + k) : null))
//         );
//       }
//       if (mounted) setImagesLoaded(true);
//     })();

//     return () => { mounted = false; images.current = []; };
//   }, []);

//   /* ───────── GSAP: canvas frames + overlay fade ───────── */
//   useLayoutEffect(() => {
//     if (!imagesLoaded) return;

//     const ctxScope = gsap.context(() => {
//       const canvas = canvasRef.current;
//       const ctx2d  = canvas.getContext("2d");

//       const draw = idx => {
//         const img = images.current[idx % frameCount];
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

//       /* resize => draw first frame */
//       const onResize = () => draw(0);
//       window.addEventListener("resize", onResize);
//       onResize();

//       /* pinned canvas scrolling */
//       let cur = 0, lastT = 0, lastY = 0, vel = 0;
//       gsap.to({ t: 0 }, {
//         t: 1,
//         ease: "none",
//         scrollTrigger: {
//           trigger : containerRef.current,
//           start   : "top top",
//           end     : `+=${scrollDistance}`,
//           scrub   : true,
//           pin     : true,
//           onUpdate:self=>{
//             const now = performance.now();
//             if (lastT){
//               const dt = (now-lastT)/1000;
//               const dy = self.scroll()-lastY;
//               vel = vel*.8 + (dy/dt)*.2;
//             }
//             lastT = now; lastY = self.scroll();

//             const damp   = Math.min(.5, baseDampingFactor + Math.abs(vel)/2000);
//             const target = self.progress * frameCount;
//             cur += (target-cur)*damp;
//             if (Math.abs(target-cur) < .5) cur = target;
//             draw(Math.round(cur));
//           }
//         }
//       });

//       /* full-screen overlay fades in first 250 px of page scroll */
//       ScrollTrigger.create({
//         start : 0,
//         end   : 250,
//         scrub : true,
//         onUpdate:self=>{
//           gsap.set(overlayRef.current,{ autoAlpha: 1 - self.progress });
//         }
//       });

//       return () => window.removeEventListener("resize", onResize);
//     }, containerRef);

//     return () => ctxScope.revert();
//   }, [imagesLoaded]);

//   /* ───────── close handler ───────── */
//   const handleClose = () => {
//     killSectionScrollTriggers(containerRef.current);
//     gsap.set(containerRef.current, { clearProps:"all" });
//     setIsClosed(true);
//     navigate("/");
//   };

//   if (isClosed) return null;

//   /* ───────── JSX ───────── */
//   return (
//     <>
//       {/* 3-D scroll-pinned canvas */}
//       <div
//         ref={el=>{
//           containerRef.current = el;
//           if (outerRef) outerRef.current = el;
//         }}
//         className="heed-ejet-section"
//       >
//         <button className="close-button" onClick={handleClose}>✕</button>

//         {/* FULL-SCREEN OVERLAY (fades out) */}
//         <div ref={overlayRef} className="intro-overlay">
//           <span className="intro-text">SCROLL</span>
//         </div>

//         <canvas ref={canvasRef} />

//       </div>

//       {/* ----- data-sheet signup ----- */}
//       <section className="data-sheet-section">
//         <h2>DATA&nbsp;SHEET</h2>
//         <p>Want the full technical PDF? Drop your email – we’ll send it right away.</p>

//         <form
//           className="newsletter-form"
//           onSubmit={async e=>{
//             e.preventDefault();
//             const email = e.target.email.value;
//             try{
//               const rsp = await fetch("http://heedjetboards.com:3000/users",{
//                 method:"POST",
//                 headers:{ "Content-Type":"application/json" },
//                 body:JSON.stringify({ email })
//               });
//               const js = await rsp.json();
//               alert(js.success ? "Check your inbox!" : (js.error||"Please try again"));
//               if (js.success) e.target.reset();
//             }catch{ alert("Something went wrong, please retry."); }
//           }}
//         >
//           <input type="email" name="email" placeholder="Your email" required/>
//           <button type="submit">Send&nbsp;PDF</button>
//         </form>
//       </section>

//     </>
//   );
// });

// export default Jetboard;


/* eslint-disable react-hooks/exhaustive-deps */
import React, { useLayoutEffect, useRef, useState, forwardRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import { killSectionScrollTriggers } from "../helpers/gsap-utils";
import "../components/JetBoard.css";

gsap.registerPlugin(ScrollTrigger);

const Jetboard = forwardRef((props, outerRef) => {
  /* ───────── refs / state ───────── */
  const canvasRef    = useRef(null);
  const containerRef = useRef(null);
  const overlayRef   = useRef(null);
  const images       = useRef([]);
  const navigate     = useNavigate();

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isClosed,     setIsClosed]     = useState(false);

  /* ───────── constants ───────── */
  const frameCount        = 103;
  const scrollDistance    = 6500;
  const baseDampingFactor = 0.3;
  const currentFrame = i =>
    `/images/jetframes/heed0001_${String(1000 + i).padStart(1, "0")}.png`;

  /* ───────── preload PNG frames ───────── */
  useLayoutEffect(() => {
    let mounted = true;
    const load = idx =>
      new Promise(res => {
        const img = new Image();
        img.onload  = () => { if (mounted) images.current[idx] = img; res(); };
        img.onerror = res;
        img.src     = currentFrame(idx);
      });

    (async () => {
      for (let i = 0; i < frameCount; i += 4) {
        await Promise.all(
          Array.from({ length: 4 }, (_, k) =>
            i + k < frameCount ? load(i + k) : null
          )
        );
      }
      if (mounted) setImagesLoaded(true);
    })();

    return () => { mounted = false; images.current = []; };
  }, []);

  /* ───────── GSAP: canvas frames + overlay fade ───────── */
  useLayoutEffect(() => {
    if (!imagesLoaded) return;

    const ctxScope = gsap.context(() => {
      const canvas = canvasRef.current;
      const ctx2d  = canvas.getContext("2d");

      const draw = idx => {
        const img = images.current[idx % frameCount];
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

      /* resize => draw first frame */
      const onResize = () => draw(0);
      window.addEventListener("resize", onResize);
      onResize();

      /* pinned canvas scrolling */
      let cur = 0, lastT = 0, lastY = 0, vel = 0;
      gsap.to({ t: 0 }, {
        t: 1,
        ease: "none",
        scrollTrigger: {
          trigger : containerRef.current,
          start   : "top top",
          end     : `+=${scrollDistance}`,
          scrub   : true,
          pin     : true,
          onUpdate(self) {
            const now = performance.now();
            if (lastT) {
              const dt = (now - lastT) / 1000;
              const dy = self.scroll() - lastY;
              vel = vel * .8 + (dy / dt) * .2;
            }
            lastT = now; lastY = self.scroll();

            const damp   = Math.min(.5, baseDampingFactor + Math.abs(vel) / 2000);
            const target = self.progress * frameCount;
            cur += (target - cur) * damp;
            if (Math.abs(target - cur) < .5) cur = target;
            draw(Math.round(cur));
          }
        }
      });

      /* overlay fades out over first 250px */
      ScrollTrigger.create({
        start  : 0,
        end    : 250,
        scrub  : true,
        onUpdate(self) {
          gsap.set(overlayRef.current, { autoAlpha: 1 - self.progress });
        }
      });

      return () => window.removeEventListener("resize", onResize);
    }, containerRef);

    return () => ctxScope.revert();
  }, [imagesLoaded]);

  /* ───────── close handler ───────── */
  const handleClose = () => {
    killSectionScrollTriggers(containerRef.current);
    gsap.set(containerRef.current, { clearProps: "all" });
    setIsClosed(true);
    navigate("/");
  };

  /* ───────── scroll-to-top ───────── */
  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  if (isClosed) return null;

  return (
    <>
      {/* 3-D scroll-pinned canvas */}
      <div
        ref={el => {
          containerRef.current = el;
          if (outerRef) outerRef.current = el;
        }}
        className="heed-ejet-section"
      >
        <button className="close-button-ejet" onClick={handleClose}>✕</button>
        <div ref={overlayRef} className="intro-overlay">
          <span className="intro-text">SCROLL</span>
        </div>
        <canvas ref={canvasRef} />
      </div>

      {/* ----- data-sheet signup ----- */}
      <section className="data-sheet-section">
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

      {/* ───── Scroll-to-Top Button ───── */}
      <button
        className="scroll-top-button"
        onClick={scrollToTop}
        aria-label="Back to top"
      />
    </>
  );
});

export default Jetboard;
