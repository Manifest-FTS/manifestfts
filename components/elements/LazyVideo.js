import { useEffect, useRef, useState } from "react";

// Muted, looping inline video that only fetches its source once it is near
// the viewport, so a multi-MB clip doesn't compete with the page's first paint.
export default function LazyVideo({ src, type = "video/mp4", className, ...props }) {
  const ref = useRef(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setLoad(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (load && ref.current) ref.current.load();
  }, [load]);

  return (
    <video ref={ref} autoPlay loop muted playsInline preload="none" className={className} {...props}>
      {load && <source src={src} type={type} />}
    </video>
  );
}
