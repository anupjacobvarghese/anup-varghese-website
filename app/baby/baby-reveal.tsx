"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { BabyBlessing } from "./baby-blessing";

const SECRET = "DANIEL";
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type Particle = {
  id: number;
  kind: "confetti" | "balloon" | "popper";
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  drift: number;
};

const CELEBRATION_COLORS = [
  "#7eb8e8",
  "#f5d76e",
  "#f7b5c8",
  "#9fd4a8",
  "#f0c27a",
  "#a8d4f0",
  "#ffe8a3",
];

function buildParticles(count: number): Particle[] {
  const kinds: Particle["kind"][] = ["confetti", "balloon", "popper"];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    kind: kinds[i % kinds.length]!,
    left: Math.random() * 100,
    delay: Math.random() * 0.9,
    duration: 2.4 + Math.random() * 2.2,
    color: CELEBRATION_COLORS[i % CELEBRATION_COLORS.length]!,
    size: 10 + Math.random() * 16,
    drift: -40 + Math.random() * 80,
  }));
}

export function BabyReveal() {
  const [guessed, setGuessed] = useState<Set<string>>(() => new Set());
  const [wrongFlash, setWrongFlash] = useState(false);
  const [message, setMessage] = useState("Tap a letter to begin");
  const [won, setWon] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [bounceLetters, setBounceLetters] = useState<Set<number>>(
    () => new Set(),
  );
  const [particles, setParticles] = useState<Particle[]>([]);
  const messageTimer = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    return () => {
      if (messageTimer.current) window.clearTimeout(messageTimer.current);
    };
  }, []);

  const slots = useMemo(
    () =>
      SECRET.split("").map((letter, index) => ({
        letter,
        revealed: guessed.has(letter),
        bounce: bounceLetters.has(index),
      })),
    [guessed, bounceLetters],
  );

  const wrongLetters = useMemo(() => {
    const wrong = new Set<string>();
    guessed.forEach((letter) => {
      if (!SECRET.includes(letter)) wrong.add(letter);
    });
    return wrong;
  }, [guessed]);

  const celebrate = useCallback(
    (preferReduced: boolean) => {
      setWon(true);
      setMessage("You’ve unlocked his name!");
      setParticles(preferReduced ? [] : buildParticles(48));
    },
    [],
  );

  const guess = useCallback(
    (raw: string) => {
      if (won) return;
      const letter = raw.toUpperCase();
      if (!/^[A-Z]$/.test(letter) || guessed.has(letter)) return;

      const next = new Set(guessed);
      next.add(letter);
      setGuessed(next);

      if (SECRET.includes(letter)) {
        const bounceIdx = new Set<number>();
        SECRET.split("").forEach((ch, i) => {
          if (ch === letter) bounceIdx.add(i);
        });
        setBounceLetters(bounceIdx);
        window.setTimeout(() => setBounceLetters(new Set()), 650);

        const allFound = SECRET.split("").every((ch) => next.has(ch));
        if (allFound) {
          celebrate(reduceMotion);
        } else {
          setMessage("Nice! Keep going…");
          setWrongFlash(false);
        }
        return;
      }

      setWrongFlash(true);
      setMessage("That letter isn’t in his name — try again");
      if (messageTimer.current) window.clearTimeout(messageTimer.current);
      messageTimer.current = window.setTimeout(() => {
        setWrongFlash(false);
        setMessage("Tap a letter to continue");
      }, 2200);
    },
    [celebrate, guessed, reduceMotion, won],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      guess(event.key);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [guess]);

  return (
    <main className={`baby-page${won ? " is-won" : ""}${reduceMotion ? " reduce-motion" : ""}`}>
      <div className="baby-sky" aria-hidden="true">
        <span className="baby-cloud c1" />
        <span className="baby-cloud c2" />
        <span className="baby-cloud c3" />
        <span className="baby-balloon b1" />
        <span className="baby-balloon b2" />
        <span className="baby-balloon b3" />
        <span className="baby-balloon b4" />
      </div>

      <div className="baby-content">
        <p className="baby-eyebrow">Guess his name</p>
        <h1 className="baby-title">
          {won ? "You’ve unlocked his name!" : "A little surprise"}
        </h1>
        <p className="baby-lead">
          {won
            ? "Six letters, one very special boy."
            : "Six letters. One very special boy. Take a guess."}
        </p>

        {!won ? (
          <>
            <div
              className="baby-slots"
              role="group"
              aria-label="Name letter blanks"
            >
              {slots.map((slot, index) => (
                <span
                  key={index}
                  className={`baby-slot${slot.revealed ? " is-filled" : " is-empty"}${slot.bounce ? " is-bounce" : ""}`}
                  aria-label={
                    slot.revealed
                      ? `Letter ${index + 1}: ${slot.letter}`
                      : `Letter ${index + 1}: blank`
                  }
                >
                  {slot.revealed ? slot.letter : ""}
                </span>
              ))}
            </div>

            <p
              className={`baby-message${wrongFlash ? " is-wrong" : ""}`}
              role="status"
              aria-live="polite"
            >
              {message}
            </p>

            <div className="baby-keyboard" role="group" aria-label="Letter keyboard">
              {ALPHABET.map((letter) => {
                const used = guessed.has(letter);
                const correct = used && SECRET.includes(letter);
                const wrong = used && !SECRET.includes(letter);
                return (
                  <button
                    key={letter}
                    type="button"
                    className={`baby-key${correct ? " is-correct" : ""}${wrong ? " is-wrong" : ""}`}
                    onClick={() => guess(letter)}
                    disabled={used || won}
                    aria-label={
                      wrong
                        ? `${letter}, not in the name`
                        : correct
                          ? `${letter}, found`
                          : `Guess ${letter}`
                    }
                  >
                    {letter}
                  </button>
                );
              })}
            </div>

            {wrongLetters.size > 0 && (
              <p className="baby-misses" aria-live="polite">
                Tried: {[...wrongLetters].sort().join(" · ")}
              </p>
            )}
          </>
        ) : (
          <section className="baby-celebration" aria-live="polite">
            <p className="baby-giant">{SECRET}</p>
            <p className="baby-subtitle">Daniel · our baby boy</p>
            <p className="baby-thanks">Welcome to the world, little one.</p>
          </section>
        )}

        <BabyBlessing />
      </div>

      {won && !reduceMotion && (
        <div className="baby-party" aria-hidden="true">
          {particles.map((p) => (
            <span
              key={p.id}
              className={`party-piece party-${p.kind}`}
              style={
                {
                  left: `${p.left}%`,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                  "--party-color": p.color,
                  "--party-size": `${p.size}px`,
                  "--party-drift": `${p.drift}px`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}
    </main>
  );
}
