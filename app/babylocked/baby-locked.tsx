"use client";

import { useEffect, useMemo, useState } from "react";
import { BabyBlessing } from "../baby/baby-blessing";

/** Saturday 28 Nov 2026, 11:00 AM Asia/Dubai (UTC+4) */
const REVEAL_AT_MS = Date.parse("2026-11-28T11:00:00+04:00");

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
};

function getRemaining(now: number): Remaining {
  const totalMs = Math.max(0, REVEAL_AT_MS - now);
  const totalSeconds = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, totalMs };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function BabyLocked() {
  const [now, setNow] = useState<number | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const hydrated = now !== null;
  const remaining = useMemo(
    () => getRemaining(now ?? Date.now()),
    [now],
  );
  const ready = hydrated && remaining.totalMs <= 0;

  const units = [
    { label: "Days", value: remaining.days, wide: true },
    { label: "Hours", value: remaining.hours },
    { label: "Minutes", value: remaining.minutes },
    { label: "Seconds", value: remaining.seconds },
  ];

  return (
    <main
      className={`baby-page baby-locked-page${reduceMotion ? " reduce-motion" : ""}`}
    >
      <div className="baby-sky" aria-hidden="true">
        <span className="baby-cloud c1" />
        <span className="baby-cloud c2" />
        <span className="baby-cloud c3" />
        <span className="baby-balloon b1" />
        <span className="baby-balloon b2" />
        <span className="baby-balloon b3" />
        <span className="baby-balloon b4" />
      </div>

      <div className="baby-content baby-locked-content">
        <p className="baby-eyebrow">Almost time</p>
        <h1 className="baby-title">
          {ready ? "His name is ready" : "A baby name to be released"}
        </h1>
        <p className="baby-lead">
          {ready
            ? "The wait is over — the surprise can be opened."
            : "This Saturday · 11:00 AM Dubai time"}
        </p>

        {!ready ? (
          <div
            className={`baby-countdown${hydrated ? " is-live" : ""}`}
            role="timer"
            aria-live="polite"
            aria-atomic="true"
            aria-label={
              hydrated
                ? `${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes, ${remaining.seconds} seconds remaining`
                : "Countdown loading"
            }
          >
            {units.map((unit) => (
              <div
                key={unit.label}
                className={`baby-count-unit${unit.wide ? " is-days" : ""}`}
              >
                <span className="baby-count-value">
                  {hydrated
                    ? unit.wide
                      ? String(unit.value)
                      : pad(unit.value)
                    : "––"}
                </span>
                <span className="baby-count-label">{unit.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="baby-locked-ready">Welcome to the world, little one.</p>
        )}

        <BabyBlessing />
      </div>
    </main>
  );
}
