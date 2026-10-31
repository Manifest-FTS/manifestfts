import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Mux + hls.js is ~200KB of JS and an autoplaying stream pulls several MB of
// video; only load either once the player is about to scroll into view.
const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), { ssr: false });

export default function LazyMuxPlayer({ aspectRatio = "16 / 9", ...props }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ aspectRatio }}>
      {visible && <MuxPlayer {...props} />}
    </div>
  );
}
