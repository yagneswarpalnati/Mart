/* eslint-disable */
'use client';

import React, { useEffect, useRef } from 'react';


interface SpringyCursorProps {
  icons?: string[];
  wrapperElement?: HTMLElement;
}

const SpringyCursor: React.FC<SpringyCursorProps> = ({
  icons = [ '/icons/icecream.svg','/icons/avacado.svg', '/icons/onion.svg','/icons/kiwi.svg','/icons/corn.svg','/icons/mango.svg'],
  wrapperElement,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<any[]>([]);
  const cursorRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);

  const nDots = 7;
  const DELTAT = 0.01;
  const SEGLEN = 10;
  const SPRINGK = 10;
  const MASS = 1;
  const GRAVITY = 50;
  const RESISTANCE = 10;
  const STOPVEL = 0.1;
  const STOPACC = 0.1;
  const DOTSIZE = 11;
  const BOUNCE = 0.7;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );
    let canvas: HTMLCanvasElement | null = null;
    let context: CanvasRenderingContext2D | null = null;

    const init = () => {
      if (prefersReducedMotion.matches) {
        console.log(
          "This browser has prefers reduced motion turned on, so the cursor did not init"
        );
        return false;
      }

      canvas = canvasRef.current;
      if (!canvas) return;

      context = canvas.getContext("2d");
      if (!context) return;

      canvas.style.top = "0px";
      canvas.style.left = "0px";
      canvas.style.pointerEvents = "none";

      canvas.style.position = "fixed";
      canvas.style.top = "0px";
      canvas.style.left = "0px";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "9999";

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;


      // 🔥 Load SVG icons
      const loadedImages: HTMLImageElement[] = [];
      let loadedCount = 0;

      const iconSources = icons;

      iconSources.forEach((src) => {
        const img = new Image();
        img.src = src;

        img.onload = () => {
          loadedCount++;

          if (loadedCount === iconSources.length) {
            // Safety guard (TypeScript strict mode)
            if (loadedImages.length === 0) return;

            for (let i = 0; i < nDots; i++) {
              const imgIndex = i % loadedImages.length;

              // Direct indexed access after length guard
              particlesRef.current[i] = new Particle(
                loadedImages[imgIndex] as HTMLImageElement
              );
            }


            bindEvents();
            loop();
          }
        };


        img.onerror = () => {
          console.error("Failed to load icon:", src);
        };

        loadedImages.push(img);
      });
    };


    const bindEvents = () => {
      const element = wrapperElement || document.body;
      element.addEventListener('mousemove', onMouseMove);
      element.addEventListener('touchmove', onTouchMove, { passive: true });
      element.addEventListener('touchstart', onTouchMove, { passive: true });
      window.addEventListener('resize', onWindowResize);
    };

    const onWindowResize = () => {
      if (!canvasRef.current) return;

      if (wrapperElement) {
        canvasRef.current.width = wrapperElement.clientWidth;
        canvasRef.current.height = wrapperElement.clientHeight;
      } else {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        if (wrapperElement) {
          const boundingRect = wrapperElement.getBoundingClientRect();
          cursorRef.current.x = e.touches[0].clientX - boundingRect.left;
          cursorRef.current.y = e.touches[0].clientY - boundingRect.top;
        } else {
          cursorRef.current.x = e.touches[0].clientX;
          cursorRef.current.y = e.touches[0].clientY;
        }
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (wrapperElement) {
        const boundingRect = wrapperElement.getBoundingClientRect();
        cursorRef.current.x = e.clientX - boundingRect.left;
        cursorRef.current.y = e.clientY - boundingRect.top;
      } else {
        cursorRef.current.x = e.clientX;
        cursorRef.current.y = e.clientY;
      }
    };

    const updateParticles = () => {
      if (!canvasRef.current || !context) return;

      canvasRef.current.width = canvasRef.current.width;

      // follow mouse
      particlesRef.current[0].position.x = cursorRef.current.x;
      particlesRef.current[0].position.y = cursorRef.current.y;

      // Start from 2nd dot
      for (let i = 1; i < nDots; i++) {
        let spring = new Vec(0, 0);

        if (i > 0) {
          springForce(i - 1, i, spring);
        }

        if (i < nDots - 1) {
          springForce(i + 1, i, spring);
        }

        let resist = new Vec(
          -particlesRef.current[i].velocity.x * RESISTANCE,
          -particlesRef.current[i].velocity.y * RESISTANCE
        );

        let accel = new Vec(
          (spring.X + resist.X) / MASS,
          (spring.Y + resist.Y) / MASS + GRAVITY
        );

        particlesRef.current[i].velocity.x += DELTAT * accel.X;
        particlesRef.current[i].velocity.y += DELTAT * accel.Y;

        if (
          Math.abs(particlesRef.current[i].velocity.x) < STOPVEL &&
          Math.abs(particlesRef.current[i].velocity.y) < STOPVEL &&
          Math.abs(accel.X) < STOPACC &&
          Math.abs(accel.Y) < STOPACC
        ) {
          particlesRef.current[i].velocity.x = 0;
          particlesRef.current[i].velocity.y = 0;
        }

        particlesRef.current[i].position.x +=
          particlesRef.current[i].velocity.x;
        particlesRef.current[i].position.y +=
          particlesRef.current[i].velocity.y;

        let height = canvasRef.current.clientHeight;
        let width = canvasRef.current.clientWidth;

        if (particlesRef.current[i].position.y >= height - DOTSIZE - 1) {
          if (particlesRef.current[i].velocity.y > 0) {
            particlesRef.current[i].velocity.y =
              BOUNCE * -particlesRef.current[i].velocity.y;
          }
          particlesRef.current[i].position.y = height - DOTSIZE - 1;
        }

        if (particlesRef.current[i].position.x >= width - DOTSIZE) {
          if (particlesRef.current[i].velocity.x > 0) {
            particlesRef.current[i].velocity.x =
              BOUNCE * -particlesRef.current[i].velocity.x;
          }
          particlesRef.current[i].position.x = width - DOTSIZE - 1;
        }

        if (particlesRef.current[i].position.x < 0) {
          if (particlesRef.current[i].velocity.x < 0) {
            particlesRef.current[i].velocity.x =
              BOUNCE * -particlesRef.current[i].velocity.x;
          }
          particlesRef.current[i].position.x = 0;
        }

        particlesRef.current[i].draw(context);
      }
    };

    const loop = () => {
      updateParticles();
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    class Vec {
      X: number;
      Y: number;

      constructor(X: number, Y: number) {
        this.X = X;
        this.Y = Y;
      }
    }

    function springForce(i: number, j: number, spring: Vec) {
      let dx =
        particlesRef.current[i].position.x - particlesRef.current[j].position.x;
      let dy =
        particlesRef.current[i].position.y - particlesRef.current[j].position.y;
      let len = Math.sqrt(dx * dx + dy * dy);
      if (len > SEGLEN) {
        let springF = SPRINGK * (len - SEGLEN);
        spring.X += (dx / len) * springF;
        spring.Y += (dy / len) * springF;
      }
    }
    class Particle {
      position: { x: number; y: number };
      velocity: { x: number; y: number };
      img: HTMLImageElement;

      constructor(imageItem: HTMLImageElement) {
        this.position = { x: cursorRef.current.x, y: cursorRef.current.y };
        this.velocity = { x: 0, y: 0 };
        this.img = imageItem;
      }

      draw(context: CanvasRenderingContext2D) {
        const size = 18; // fixed size for all icons

        context.drawImage(
          this.img,
          this.position.x - size / 2,
          this.position.y - size / 2,
          size,
          size
        );
      }
    }

    init();

    
    return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        const element = wrapperElement || document.body;
        element.removeEventListener("mousemove", onMouseMove);
        element.removeEventListener("touchmove", onTouchMove);
        element.removeEventListener("touchstart", onTouchMove);
        window.removeEventListener("resize", onWindowResize);
      };

  }, [icons, wrapperElement]);

  return <canvas ref={canvasRef} />;
};

export default SpringyCursor;
