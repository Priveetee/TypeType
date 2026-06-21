import { useEffect, useRef, useState } from "react";
import {
  APPEAR_MS,
  advanceDog,
  DOG_DELAY,
  type DogPhase,
  EDGE,
  MOVE_OFF,
  MOVE_ON,
} from "./pixel-dog-motion";
import { PixelFlipbook } from "./pixel-flipbook";

export function PixelDogChase() {
  const [promptVisible, setPromptVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<DogPhase>("intro");
  const [moving, setMoving] = useState(false);
  const phaseRef = useRef<DogPhase>("intro");
  const movingRef = useRef(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const cursor = useRef({ x: -9999, y: -9999 });
  const target = useRef({ x: 0, y: 0 });
  const exitDir = useRef({ x: 0, y: 0 });
  const facing = useRef(1);

  useEffect(() => {
    const promptTimer = window.setTimeout(() => setPromptVisible(true), APPEAR_MS);
    const dogTimer = window.setTimeout(() => {
      pos.current = { x: -EDGE, y: window.innerHeight * 0.5 };
      setVisible(true);
    }, APPEAR_MS + DOG_DELAY);
    return () => {
      window.clearTimeout(promptTimer);
      window.clearTimeout(dogTimer);
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      return;
    }
    const onMove = (event: PointerEvent) => {
      cursor.current = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener("pointermove", onMove);
    const go = (next: DogPhase) => {
      phaseRef.current = next;
      setPhase(next);
    };
    let raf = 0;
    const tick = () => {
      const v = vel.current;
      advanceDog({
        w: window.innerWidth,
        h: window.innerHeight,
        p: pos.current,
        v,
        c: cursor.current,
        ph: phaseRef.current,
        logo: logoRef.current?.getBoundingClientRect(),
        target,
        exitDir,
        go,
      });
      const speed = Math.hypot(v.x, v.y);
      if (!movingRef.current && speed > MOVE_ON) {
        movingRef.current = true;
        setMoving(true);
      } else if (movingRef.current && speed < MOVE_OFF) {
        movingRef.current = false;
        setMoving(false);
      }
      if (Math.abs(v.x) > 1) {
        facing.current = v.x > 0 ? 1 : -1;
      }
      if (wrapRef.current) {
        wrapRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      if (spriteRef.current) {
        spriteRef.current.style.transform = `translate(-50%, -50%) scaleX(${facing.current})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [visible]);

  if (!promptVisible) {
    return null;
  }

  const carrying = phase === "carry" || phase === "exit" || phase === "enter";

  let sprite = (
    <img
      alt=""
      aria-hidden="true"
      src="/pixel/dog-idle.png"
      className="block w-[clamp(100px,11vw,160px)] [image-rendering:pixelated]"
    />
  );
  if (moving && carrying) {
    sprite = (
      <PixelFlipbook
        prefix="dog-carry"
        count={10}
        frameClass="pixel-dog-carry-run"
        cycle={0.6}
        className="block w-[clamp(150px,16vw,232px)]"
      />
    );
  } else if (moving) {
    sprite = (
      <PixelFlipbook
        prefix="dog-run"
        count={5}
        frameClass="pixel-dog-run"
        cycle={0.55}
        className="block w-[clamp(120px,13vw,190px)]"
      />
    );
  } else if (carrying) {
    sprite = (
      <PixelFlipbook
        prefix="dog-rest"
        count={3}
        frameClass="pixel-dog-wag"
        cycle={1.5}
        className="block w-[clamp(118px,12.5vw,186px)]"
      />
    );
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-[26%] z-20 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 px-6">
        <span className="pixel-prompt-drop font-black text-3xl text-white uppercase tracking-[0.16em] drop-shadow-[2px_3px_0_rgba(0,0,0,0.5)] sm:text-5xl">
          Go back to
        </span>
        {!carrying && (
          <img
            ref={logoRef}
            alt=""
            aria-hidden="true"
            src="/logo.svg"
            className="pixel-prompt-drop-logo h-9 w-auto drop-shadow-[2px_3px_0_rgba(0,0,0,0.45)] sm:h-12"
          />
        )}
      </div>
      {visible && (
        <div
          ref={wrapRef}
          className="pointer-events-none fixed top-0 left-0 z-30 will-change-transform"
        >
          <div ref={spriteRef} className="relative will-change-transform">
            {sprite}
          </div>
        </div>
      )}
    </>
  );
}
