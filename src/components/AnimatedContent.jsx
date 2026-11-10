import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function AnimatedContent({
  children,
  container,
  distance = 100,
  direction = 'vertical',
  reverse = false,
  duration = 0.8,
  ease = 'power3.out',
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  blur = 0,
  threshold = 0.1,
  delay = 0,
  stagger = 0.08,
  staggerFrom = 'start',
  once = true,
  className = '',
  style,
  ...props
}) {
  const ref = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let scroller = container || null;
    if (typeof scroller === 'string') scroller = document.querySelector(scroller);

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    const ctx = gsap.context(() => {
      const targets = stagger > 0 && el.children.length ? Array.from(el.children) : [el];
      const horizontal = direction === 'horizontal';
      const axis = horizontal ? 'x' : 'y';
      const sign = reverse ? -1 : 1;

      gsap.set(el, { visibility: 'visible' });

      if (reduce) {
        gsap.set(targets, { opacity: 1, x: 0, y: 0, scale: 1 });
        return;
      }

      const from = {
        [axis]: distance * sign,
        scale,
        opacity: animateOpacity ? initialOpacity : 1
      };

      const to = {
        [axis]: 0,
        scale: 1,
        opacity: 1,
        duration,
        ease
      };

      if (blur > 0) {
        from.filter = `blur(${blur}px)`;
        to.filter = 'blur(0px)';
      }

      if (stagger > 0 && targets.length > 1) {
        to.stagger = { each: stagger, from: staggerFrom };
      }

      const tl = gsap.timeline({
        paused: true,
        delay: Math.max(delay, 0)
      });

      tl.fromTo(targets, from, to);

      const start = `top ${(1 - threshold) * 100}%`;

      ScrollTrigger.create({
        trigger: el,
        scroller,
        start,
        once,
        onEnter: () => tl.play(),
        onLeaveBack: once ? undefined : () => tl.reverse()
      });
    }, el);

    return () => ctx.revert();
  }, [
    container,
    distance,
    direction,
    reverse,
    duration,
    ease,
    initialOpacity,
    animateOpacity,
    scale,
    blur,
    threshold,
    delay,
    stagger,
    staggerFrom,
    once
  ]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ visibility: 'hidden', ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
