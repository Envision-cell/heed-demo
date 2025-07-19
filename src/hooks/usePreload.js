import { useEffect, useState } from "react";

export function usePreload(srcList = []) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = (src) =>
      new Promise((res) => {
        // 🅰️ VIDEO or IMAGE branch
        if (/\.(mp4|webm|ogg|png|jpe?g|gif)$/i.test(src)) {
          const el = /\.(mp4|webm|ogg)$/i.test(src)
            ? document.createElement("video")
            : new Image();
          el.onload = el.oncanplaythrough = res;
          el.onerror = res;
          el.src = src;
          return;
        }

        // 🅱️ FONT branch
        if (/\.(woff2?|ttf|otf)$/i.test(src)) {
          const font = new FontFace(src, `url(${src})`);
          font.load().catch(() => {}).finally(() => {
            // add to document.fonts so <p style={{fontFamily:'…'}}> works
            try { document.fonts.add(font); } catch { /* safari */ }
            res();
          });
          return;
        }

        // default fallback (immediately resolve)
        res();
      });

    (async () => {
      await Promise.all(srcList.map(load));
      if (mounted) setReady(true);
    })();

    return () => (mounted = false);
  }, [srcList]);

  return ready;
}
