'use client';

import { useEffect, useRef } from 'react';
import s from './landing.module.css';

// 90s product film (source: promo-video/ Remotion project). Silent, so it can
// play muted inline. Playback follows visibility rather than `autoPlay` alone:
// Chrome suspends muted autoplay video it considers off-screen and never
// resumes it (see VideoDemoSection), which would strand visitors on a still
// frame when they reach the section.
export default function PromoVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // React does not reliably reflect `muted` onto the element property, and
    // an unmuted play() without a user gesture is rejected by autoplay policy.
    video.muted = true;
    video.defaultMuted = true;

    const attemptPlay = () => void video.play().catch(() => {});
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) attemptPlay();
        else video.pause();
      },
      { threshold: 0.35 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="product-film" className={`${s.band} ${s.light}`}>
      <div className={s.wrap}>
        <div className={s.head}>
          <span className={s.eyebrow}>Aivory in 90 seconds</span>
          <h2 className={s.h2}>
            From diagnosis to agents at work
            <br />
            <span className={s.dim}>the whole system, in motion.</span>
          </h2>
        </div>
        <div className={s.film}>
          <video
            ref={videoRef}
            className={s.filmVideo}
            src="/landing/promo/aivory-promo-2026.mp4"
            poster="/landing/promo/aivory-promo-2026-poster.jpg"
            muted
            playsInline
            controls
            preload="metadata"
            width={1920}
            height={1080}
            aria-label="Aivory product film: operations diagnostic, blueprint, roadmap and workflow builder, then Cervo agents delegating work and the Workspace chat, timeline and CRM"
          />
        </div>
      </div>
    </section>
  );
}
