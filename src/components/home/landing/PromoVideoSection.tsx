'use client';

import { useEffect, useRef } from 'react';
import s from './landing.module.css';

// 93s walkthrough film (2026-11, source: promo-video/ Remotion project, WalkthroughH):
// the problem (apps that don't talk, data that doesn't match), then Deep Diagnostic,
// Blueprint + Roadmap, Workflow Builder, Cervo and the Workspace. It has a sound
// track, but it always starts muted inline; visitors unmute it with the controls.
// Playback follows visibility rather than `autoPlay` alone:
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
            From analysis to agents at work
            <br />
            <span className={s.dim}>the whole system, in motion.</span>
          </h2>
        </div>
        <div className={s.film}>
          <video
            ref={videoRef}
            className={s.filmVideo}
            src="/landing/promo/aivory-walkthrough-2026-11-14.mp4"
            poster="/landing/promo/aivory-walkthrough-2026-11-14-poster.jpg"
            muted
            playsInline
            controls
            preload="metadata"
            width={1920}
            height={1080}
            aria-label="Aivory walkthrough film: scattered apps and data that do not match, then the Deep Diagnostic chat, the Transformation Blueprint and Roadmap, the Workflow Builder testing and repairing a flow, Cervo agents chatting, delegating and working in 100+ apps, and the Workspace where people and agents meet"
          />
        </div>
      </div>
    </section>
  );
}
