"use client";

import Image from "next/image";
import {
  FormEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

const institutions = [
  { src: "/media/logos/gems-our-own-v2.png", alt: "GEMS Our Own English High School, Dubai" },
  { src: "/media/logos/credence-v2.png", alt: "Credence High School" },
  { src: "/media/logos/millennium-v2.png", alt: "The Millennium School" },
  { src: "/media/logos/oxford-v2.png", alt: "University of Oxford" },
  { src: "/media/logos/gems-v2.png", alt: "GEMS Education" },
];

const affiliations = [
  { src: "/media/logos/arthur-d-little-v2.png", alt: "Arthur D. Little" },
  { src: "/media/logos/mckinsey-v2.png", alt: "McKinsey & Company" },
  { src: "/media/logos/beroe-v2.png", alt: "Beroe" },
];

const speakerOfferings = [
  { label: "Motivational talks", icon: "mic" },
  { label: "School & university keynotes", icon: "stage" },
  { label: "Student and career counselling", icon: "compass" },
  { label: "Ask-me-anything sessions", icon: "chat" },
  { label: "Competition judging", icon: "award" },
  { label: "1:1 mentorship", icon: "users" },
  { label: "MBA admissions guidance", icon: "grad" },
  { label: "Mindset & goal-setting", icon: "target" },
];

const speakingPhotos = [
  { src: "/media/speaking/carousel/ask-me-anything.png", alt: "Ask-me-anything session" },
  { src: "/media/speaking/carousel/career-building-workshop.png", alt: "Career building workshop" },
  { src: "/media/speaking/carousel/big-stage.png", alt: "Speaking on a large stage" },
  { src: "/media/speaking/carousel/moderate-stage.png", alt: "Speaking on stage" },
  { src: "/media/speaking/carousel/gems-pic-2.png", alt: "Speaking at GEMS" },
  { src: "/media/speaking/carousel/mid-speech.png", alt: "Mid-speech on stage" },
  { src: "/media/speaking/carousel/audience.png", alt: "With a student audience" },
  { src: "/media/speaking/carousel/img-3584.png", alt: "Speaking engagement" },
  { src: "/media/speaking/carousel/speaking-1.png", alt: "Keynote speaking" },
  { src: "/media/speaking/carousel/flagship-talking.png", alt: "Flagship talk" },
];

const consultingFocusLines = [
  "Holistic Corporate Transformations and EBITDA uplift program",
  "AI & Digital Usecase Design and Implementation",
  "Operating Model and Organizational Revamp",
];

const contactHeadline = {
  line1: "Let's talk about",
  line2Prefix: "what's ",
  possible: "possible.",
} as const;
const contactHeadlineTotal =
  contactHeadline.line1.length +
  contactHeadline.line2Prefix.length +
  contactHeadline.possible.length;

const industries = [
  { name: "Mining", icon: "mining", image: "/media/industries/mining.jpg" },
  { name: "Oil & Gas", icon: "oil", image: "/media/industries/oil-gas.jpg" },
  { name: "Metals", icon: "metals", image: "/media/industries/metals.jpg" },
  { name: "Manufacturing", icon: "manufacturing", image: "/media/industries/manufacturing.jpg" },
  { name: "Energy", icon: "energy", image: "/media/industries/energy.jpg" },
  { name: "Power & Utilities", icon: "power", image: "/media/industries/power.jpg" },
  { name: "Telecom", icon: "telecom", image: "/media/industries/telecom.jpg" },
  { name: "ICT", icon: "ict", image: "/media/industries/ict.jpg" },
  { name: "Banking", icon: "banking", image: "/media/industries/banking.jpg" },
  { name: "Ports", icon: "ports", image: "/media/industries/ports.jpg" },
  { name: "Transport", icon: "transport", image: "/media/industries/transport.jpg" },
  { name: "FMCG", icon: "fmcg", image: "/media/industries/fmcg.jpg" },
];

const consultingMetrics = [
  {
    value: "$1Bn+",
    label: "EBITDA uplift created",
    visual: "bars",
    target: 100,
  },
  {
    value: "30+",
    label: "Clients advised",
    visual: "dots",
    target: 30,
  },
  {
    value: "10+",
    label: "Industries served",
    visual: "ring",
    target: 10,
  },
  {
    value: "6+",
    label: "Countries",
    visual: "columns",
    target: 6,
  },
] as const;

const functionalAreas: {
  label: string;
  icon: string;
  aiEnabled?: boolean;
}[] = [
  { label: "AI use case identification", icon: "ai", aiEnabled: true },
  { label: "Procurement", icon: "cart", aiEnabled: true },
  { label: "Operations", icon: "gear", aiEnabled: true },
  { label: "Finance", icon: "finance", aiEnabled: true },
  { label: "Digitization", icon: "digitize", aiEnabled: true },
  { label: "Revenue generation strategy", icon: "revenue" },
  { label: "Business investment analysis", icon: "invest", aiEnabled: true },
  { label: "Budgeting", icon: "budget" },
  { label: "Forecasting", icon: "forecast", aiEnabled: true },
  { label: "Sales strategy", icon: "sales" },
  { label: "Cost reduction strategy", icon: "cost", aiEnabled: true },
  { label: "Headcount optimization", icon: "people" },
  { label: "Organizational restructuring", icon: "org" },
  { label: "Process & policies revamp", icon: "process" },
  { label: "Investment strategy", icon: "investStrategy", aiEnabled: true },
  { label: "Portfolio optimization", icon: "portfolio", aiEnabled: true },
  { label: "Board and steering committee management", icon: "board" },
  { label: "PMO office setup", icon: "pmo" },
  { label: "Post merger synergy capture", icon: "synergy" },
  { label: "IPO readiness", icon: "ipo" },
  { label: "Due diligence", icon: "diligence" },
];

function OfferingIcon({ icon }: { icon: string }) {
  const paths: Record<string, ReactNode> = {
    mic: (
      <>
        <path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3Z" />
        <path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" />
      </>
    ),
    stage: (
      <>
        <path d="M4 19h16M6 19V9l6-4 6 4v10" />
        <path d="M10 19v-5h4v5" />
      </>
    ),
    compass: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m15.5 8.5-2.2 5.8-5.8 2.2 2.2-5.8Z" />
      </>
    ),
    chat: (
      <>
        <path d="M5 5h14v10H9l-4 4V5Z" />
        <path d="M8 9h8M8 12h5" />
      </>
    ),
    award: (
      <>
        <circle cx="12" cy="9" r="5" />
        <path d="m9 13-1.5 7 4.5-2.5L16.5 20 15 13" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 19c0-3 2.5-5 6-5s6 2 6 5" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M21 19c0-2.5-1.5-4-4-4" />
      </>
    ),
    grad: (
      <>
        <path d="m3 10 9-5 9 5-9 5Z" />
        <path d="M7 12v4c2 1.5 4 2.2 5 2.2S16 17.5 18 16v-4M21 10v6" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
  };

  return (
    <svg className="offering-icon" aria-hidden="true" viewBox="0 0 24 24">
      {paths[icon]}
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

function FunctionIcon({ icon }: { icon: string }) {
  const paths: Record<string, ReactNode> = {
    ai: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
      </>
    ),
    cart: (
      <>
        <path d="M3 5h2l2 10h10l2-7H7" />
        <circle cx="9" cy="19" r="1.2" />
        <circle cx="16" cy="19" r="1.2" />
      </>
    ),
    gear: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6l1.4 1.4m10 10 1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
      </>
    ),
    finance: (
      <>
        <path d="M4 19V5M4 19h16" />
        <path d="M8 15V9M12 15V7M16 15v-3" />
      </>
    ),
    digitize: (
      <>
        <rect x="4" y="5" width="16" height="11" rx="1" />
        <path d="M9 19h6M12 16v3" />
      </>
    ),
    revenue: (
      <>
        <path d="M4 17 10 11l4 4 6-8" />
        <path d="M15 7h5v5" />
      </>
    ),
    invest: <path d="M12 3v18M8 8h7a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h8" />,
    budget: (
      <>
        <rect x="5" y="4" width="14" height="16" rx="1" />
        <path d="M9 9h6M9 13h6M9 17h3" />
      </>
    ),
    forecast: (
      <>
        <path d="M4 18 9 10l4 4 7-9" />
        <path d="M4 18h16" />
      </>
    ),
    sales: (
      <>
        <path d="M5 7h10l4 5-4 5H5l3-5Z" />
        <path d="M8 12h.01" />
      </>
    ),
    cost: (
      <>
        <path d="M12 4v16M8 8h5a2.5 2.5 0 0 1 0 5H9" />
        <path d="m7 16 10-8" />
      </>
    ),
    people: (
      <>
        <circle cx="9" cy="8" r="2.5" />
        <path d="M4 18c0-2.5 2-4.2 5-4.2s5 1.7 5 4.2" />
        <circle cx="16.5" cy="9" r="2" />
        <path d="M20 18c0-2-1.2-3.3-3.5-3.5" />
      </>
    ),
    org: (
      <>
        <rect x="9" y="3" width="6" height="4" rx="0.5" />
        <path d="M12 7v3M7 10h10" />
        <rect x="3" y="13" width="6" height="4" rx="0.5" />
        <rect x="15" y="13" width="6" height="4" rx="0.5" />
        <path d="M6 13v-3M18 13v-3" />
      </>
    ),
    process: (
      <>
        <path d="M4 8h10M14 8l-2-2M14 8l-2 2" />
        <path d="M20 16H10M10 16l2-2M10 16l2 2" />
      </>
    ),
    investStrategy: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
      </>
    ),
    portfolio: (
      <>
        <rect x="3" y="7" width="18" height="12" rx="1" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M3 12h18" />
      </>
    ),
    board: (
      <>
        <rect x="3" y="4" width="18" height="12" rx="1" />
        <path d="M8 20h8M12 16v4" />
        <path d="M7 9h2M11 9h2M15 9h2M7 12h10" />
      </>
    ),
    pmo: (
      <>
        <path d="M4 20V8l8-4 8 4v12" />
        <path d="M9 20v-6h6v6" />
        <path d="M9 11h6" />
      </>
    ),
    synergy: (
      <>
        <circle cx="9" cy="12" r="5" />
        <circle cx="15" cy="12" r="5" />
      </>
    ),
    ipo: (
      <>
        <path d="M4 19V5M4 19h16" />
        <path d="M7 15l4-6 3 3 5-7" />
        <path d="M16 5h3v3" />
      </>
    ),
    diligence: (
      <>
        <circle cx="10" cy="10" r="6" />
        <path d="m14.5 14.5 5 5" />
        <path d="M8 10h4M10 8v4" />
      </>
    ),
  };

  return (
    <svg className="function-icon" aria-hidden="true" viewBox="0 0 24 24">
      {paths[icon]}
    </svg>
  );
}

function MetricVisual({
  visual,
  active,
}: {
  visual: (typeof consultingMetrics)[number]["visual"];
  active: boolean;
}) {
  if (visual === "bars") {
    const heights = [28, 38, 48, 58, 68];
    return (
      <svg className="metric-visual" viewBox="0 0 120 72" aria-hidden="true">
        {heights.map((height, index) => (
          <rect
            key={height}
            className="metric-bar"
            x={12 + index * 20}
            y={66 - height}
            width="12"
            height={height}
            style={{ transitionDelay: active ? `${120 + index * 90}ms` : "0ms" }}
            data-active={active ? "true" : "false"}
          />
        ))}
        <line x1="6" y1="66" x2="114" y2="66" className="metric-axis" />
      </svg>
    );
  }

  if (visual === "dots") {
    return (
      <svg className="metric-visual" viewBox="0 0 120 72" aria-hidden="true">
        {Array.from({ length: 30 }, (_, index) => {
          const col = index % 6;
          const row = Math.floor(index / 6);
          return (
            <circle
              key={index}
              className="metric-dot"
              cx={14 + col * 18}
              cy={12 + row * 12}
              r="3.2"
              style={{ transitionDelay: active ? `${80 + index * 28}ms` : "0ms" }}
              data-active={active ? "true" : "false"}
            />
          );
        })}
      </svg>
    );
  }

  if (visual === "ring") {
    const radius = 26;
    const circumference = 2 * Math.PI * radius;
    const progress = (10 / 12) * circumference;
    return (
      <svg className="metric-visual" viewBox="0 0 120 72" aria-hidden="true">
        <circle className="metric-ring-track" cx="60" cy="36" r={radius} />
        <circle
          className="metric-ring-value"
          cx="60"
          cy="36"
          r={radius}
          strokeDasharray={`${circumference}`}
          strokeDashoffset={active ? circumference - progress : circumference}
        />
        {Array.from({ length: 12 }, (_, index) => {
          const angle = ((index / 12) * 360 - 90) * (Math.PI / 180);
          const x = 60 + Math.cos(angle) * 26;
          const y = 36 + Math.sin(angle) * 26;
          return (
            <circle
              key={index}
              className="metric-ring-tick"
              cx={x}
              cy={y}
              r="1.6"
              data-lit={active && index < 10 ? "true" : "false"}
              style={{ transitionDelay: active ? `${100 + index * 60}ms` : "0ms" }}
            />
          );
        })}
      </svg>
    );
  }

  const columnHeights = [22, 32, 42, 52, 58, 64];
  return (
    <svg className="metric-visual" viewBox="0 0 120 72" aria-hidden="true">
      {columnHeights.map((height, index) => (
        <rect
          key={height}
          className="metric-column"
          x={14 + index * 16}
          y={66 - height}
          width="10"
          height={height}
          style={{ transitionDelay: active ? `${100 + index * 80}ms` : "0ms" }}
          data-active={active ? "true" : "false"}
        />
      ))}
      <line x1="8" y1="66" x2="112" y2="66" className="metric-axis" />
    </svg>
  );
}

function IndustryIcon({ icon }: { icon: string }) {
  const paths: Record<string, ReactNode> = {
    mining: <><path d="M4 20 14 10" /><path d="M7 6c4-3 9-2 13 2l-3 3c-3-3-7-4-11-2Z" /></>,
    oil: <path d="M12 2S6 9 6 14a6 6 0 0 0 12 0c0-5-6-12-6-12Z" />,
    metals: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9Z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></>,
    manufacturing: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M19 5l-2 2M7 17l-2 2" /></>,
    energy: <path d="m13 2-8 12h6l-1 8 9-13h-6Z" />,
    power: <><path d="M4 20h16M6 20V10l6-6 6 6v10" /><path d="M10 20v-5h4v5" /></>,
    telecom: <><path d="M5 19a10 10 0 0 1 14 0M8 16a6 6 0 0 1 8 0M11 13a2 2 0 0 1 2 0" /><circle cx="12" cy="20" r="1" /></>,
    ict: <><rect x="3" y="4" width="18" height="12" rx="1" /><path d="M8 20h8M12 16v4" /></>,
    banking: <><path d="m3 9 9-6 9 6M4 21h16M6 9v9m4-9v9m4-9v9m4-9v9" /></>,
    ports: <><circle cx="12" cy="5" r="2" /><path d="M12 7v14M5 12h14M5 16c1 4 4 5 7 5s6-1 7-5" /></>,
    transport: <><path d="M3 17h13V7H3Z" /><path d="M16 10h3l2 3v4h-5Z" /><circle cx="6.5" cy="17.5" r="1.5" /><circle cx="18.5" cy="17.5" r="1.5" /></>,
    fmcg: <><path d="M5 8h14l-1 13H6Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      {paths[icon]}
    </svg>
  );
}

function Mark() {
  return (
    <span className="mark">
      <Image
        src="/media/signature-transparent.png"
        alt="Anup Varghese"
        width={744}
        height={248}
        priority
      />
    </span>
  );
}

type SubmitState = "idle" | "sending" | "sent" | "error";

function formatStat(value: number) {
  return `${Math.round(value).toLocaleString("en-US")}+`;
}

function SpeakingStats() {
  const rowRef = useRef<HTMLDivElement>(null);
  const [students, setStudents] = useState(0);
  const [mentored, setMentored] = useState(0);

  useEffect(() => {
    const node = rowRef.current;
    if (!node) return;

    const STUDENTS = 5000;
    const MENTORED = 500;
    const DURATION_MS = 1500;

    const finish = () => {
      setStudents(STUDENTS);
      setMentored(MENTORED);
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      finish();
      return;
    }

    let raf = 0;

    const animate = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION_MS);
        const eased = 1 - (1 - t) ** 3;
        setStudents(STUDENTS * eased);
        setMentored(MENTORED * eased);
        if (t < 1) {
          raf = window.requestAnimationFrame(tick);
        } else {
          finish();
        }
      };
      raf = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="stat-row" ref={rowRef}>
      <div>
        <strong>{formatStat(students)}</strong>
        <span>students reached</span>
      </div>
      <div>
        <strong>{formatStat(mentored)}</strong>
        <span>young professionals mentored</span>
      </div>
    </div>
  );
}

export function Website() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroMuted, setHeroMuted] = useState(false);
  const [formState, setFormState] = useState<SubmitState>("idle");
  const [notifyState, setNotifyState] = useState<SubmitState>("idle");
  const [industryIndex, setIndustryIndex] = useState(0);
  const [speakingIndex, setSpeakingIndex] = useState(0);
  const [metricsVisible, setMetricsVisible] = useState(false);
  const [releaseCelebrate, setReleaseCelebrate] = useState(false);
  const [bookReveal, setBookReveal] = useState<"pending" | "entered" | "settled">(
    "pending",
  );
  const [swimTitleVisible, setSwimTitleVisible] = useState(false);
  const [speakingCtaVisible, setSpeakingCtaVisible] = useState(false);
  const [offeringsVisible, setOfferingsVisible] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const [contactHeadlineChars, setContactHeadlineChars] = useState(0);
  const [contactHeadlineDone, setContactHeadlineDone] = useState(false);
  const [focusText, setFocusText] = useState("");
  const [focusTyping, setFocusTyping] = useState(true);
  const [focusAnnounce, setFocusAnnounce] = useState("");
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const heroAudioUnlockCleanupRef = useRef<(() => void) | null>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const launchDateRef = useRef<HTMLDivElement>(null);
  const bookSectionRef = useRef<HTMLElement>(null);
  const bookJacketRef = useRef<HTMLElement>(null);
  const speakingActionsRef = useRef<HTMLDivElement>(null);
  const offeringListRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    const SESSION_KEY = "av-hero-audio-handled";
    const markHandled = () => {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* private mode / blocked storage */
      }
    };
    const wasHandled = (() => {
      try {
        return sessionStorage.getItem(SESSION_KEY) === "1";
      } catch {
        return false;
      }
    })();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const playMuted = () => {
      video.muted = true;
      setHeroMuted(true);
      return video.play().catch(() => undefined);
    };

    const disarmGestureUnlock = () => {
      heroAudioUnlockCleanupRef.current?.();
      heroAudioUnlockCleanupRef.current = null;
    };

    const unlockAudio = () => {
      disarmGestureUnlock();
      video.muted = false;
      setHeroMuted(false);
      void video.play().catch(() => undefined);
      markHandled();
    };

    const armGestureUnlock = () => {
      disarmGestureUnlock();
      const events = ["pointerdown", "keydown", "scroll"] as const;
      const onGesture = (event: Event) => {
        if (event.type === "scroll") {
          // Scroll usually is not a media user-gesture; only commit on success.
          video.muted = false;
          setHeroMuted(false);
          void video
            .play()
            .then(() => {
              disarmGestureUnlock();
              markHandled();
            })
            .catch(() => {
              video.muted = true;
              setHeroMuted(true);
            });
          return;
        }

        const target = event.target;
        if (target instanceof Element && target.closest(".video-control")) {
          return;
        }
        unlockAudio();
      };
      for (const type of events) {
        window.addEventListener(type, onGesture, {
          capture: true,
          passive: true,
        });
      }
      heroAudioUnlockCleanupRef.current = () => {
        for (const type of events) {
          window.removeEventListener(type, onGesture, true);
        }
      };
    };

    if (reduceMotion || wasHandled) {
      void playMuted();
      return () => disarmGestureUnlock();
    }

    video.muted = false;
    setHeroMuted(false);
    void video
      .play()
      .then(() => {
        markHandled();
      })
      .catch(() => {
        void playMuted().then(() => {
          armGestureUnlock();
        });
      });

    return () => disarmGestureUnlock();
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndustryIndex((current) => (current + 1) % industries.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSpeakingIndex((current) => (current + 1) % speakingPhotos.length);
    }, 2500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const TYPE_MS = 42;
    const DELETE_MS = 26;
    const HOLD_MS = 2000;
    const PAUSE_MS = 380;
    let cancelled = false;
    let timeout = 0;
    let lineIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const schedule = (fn: () => void, ms: number) => {
      timeout = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
    };

    const tick = () => {
      const full = consultingFocusLines[lineIndex];

      if (!deleting) {
        if (charIndex < full.length) {
          charIndex += 1;
          setFocusText(full.slice(0, charIndex));
          setFocusTyping(true);
          schedule(tick, TYPE_MS);
          return;
        }

        setFocusAnnounce(full);
        setFocusTyping(false);
        schedule(() => {
          deleting = true;
          setFocusTyping(true);
          tick();
        }, HOLD_MS);
        return;
      }

      if (charIndex > 0) {
        charIndex -= 1;
        setFocusText(full.slice(0, charIndex));
        schedule(tick, DELETE_MS);
        return;
      }

      deleting = false;
      lineIndex = (lineIndex + 1) % consultingFocusLines.length;
      schedule(tick, PAUSE_MS);
    };

    schedule(tick, 280);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const labels = Array.from(
      document.querySelectorAll<HTMLElement>(".domain-label"),
    );
    if (labels.length === 0) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      labels.forEach((label) => label.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.45, rootMargin: "0px 0px -8% 0px" },
    );

    labels.forEach((label) => observer.observe(label));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = metricsRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setMetricsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = speakingActionsRef.current;
    if (!node) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      setSpeakingCtaVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSpeakingCtaVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.45, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = offeringListRef.current;
    if (!node) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      setOfferingsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setOfferingsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = contactRef.current;
    if (!node) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      setContactVisible(true);
      setContactHeadlineChars(contactHeadlineTotal);
      setContactHeadlineDone(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setContactVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.28, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!contactVisible || contactHeadlineDone) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      setContactHeadlineChars(contactHeadlineTotal);
      setContactHeadlineDone(true);
      return;
    }

    const TYPE_MS = 56;
    const LINE_PAUSE_MS = 320;
    const START_DELAY_MS = 380;
    let charIndex = 0;
    let timeout = 0;
    let cancelled = false;

    const schedule = (fn: () => void, ms: number) => {
      timeout = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
    };

    const tick = () => {
      charIndex += 1;
      setContactHeadlineChars(charIndex);
      if (charIndex >= contactHeadlineTotal) {
        setContactHeadlineDone(true);
        return;
      }
      const delay =
        charIndex === contactHeadline.line1.length ? LINE_PAUSE_MS : TYPE_MS;
      schedule(tick, delay);
    };

    schedule(tick, START_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [contactVisible, contactHeadlineDone]);

  useEffect(() => {
    const node = launchDateRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setReleaseCelebrate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.55 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = bookSectionRef.current;
    if (!section) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      setBookReveal("settled");
      setSwimTitleVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setBookReveal("entered");
          setSwimTitleVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.22, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (bookReveal !== "entered") return;

    const jacket = bookJacketRef.current;
    if (!jacket) {
      setBookReveal("settled");
      return;
    }

    const settle = (event?: AnimationEvent) => {
      if (event && event.target !== jacket) return;
      if (event?.animationName && event.animationName !== "book-jacket-enter") {
        return;
      }
      setBookReveal("settled");
    };

    jacket.addEventListener("animationend", settle);
    const fallback = window.setTimeout(() => settle(), 1300);
    return () => {
      jacket.removeEventListener("animationend", settle);
      window.clearTimeout(fallback);
    };
  }, [bookReveal]);

  useEffect(() => {
    const section = bookSectionRef.current;
    const jacket = bookJacketRef.current;
    if (!section || !jacket) return;
    if (bookReveal !== "settled") return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    let ticking = false;

    const updateParallax = () => {
      ticking = false;
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      if (rect.bottom < 0 || rect.top > viewH) return;

      const center = rect.top + rect.height / 2;
      const progress = Math.max(-1, Math.min(1, (center - viewH / 2) / viewH));
      // Subtle drift only — keep the full jacket in frame (no X shift).
      jacket.style.setProperty("--book-py", `${(progress * -12).toFixed(2)}px`);
      jacket.style.setProperty("--book-ry", `${(progress * 2.2).toFixed(2)}deg`);
      jacket.style.setProperty("--book-rz", `${(progress * 0.55).toFixed(2)}deg`);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [bookReveal]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const close = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  function toggleHeroSound() {
    const video = heroVideoRef.current;
    if (!video) return;
    heroAudioUnlockCleanupRef.current?.();
    heroAudioUnlockCleanupRef.current = null;
    try {
      sessionStorage.setItem("av-hero-audio-handled", "1");
    } catch {
      /* private mode / blocked storage */
    }
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setHeroMuted(nextMuted);
    if (!nextMuted) void video.play().catch(() => undefined);
  }

  function replayHeroMuted() {
    const video = heroVideoRef.current;
    if (!video) return;
    video.muted = true;
    video.currentTime = 0;
    setHeroMuted(true);
    void video.play().catch(() => undefined);
  }

  function skipHeroEnding() {
    const video = heroVideoRef.current;
    if (!video) return;
    if (!video.duration || !Number.isFinite(video.duration)) return;
    if (video.currentTime < video.duration - 1) return;
    replayHeroMuted();
  }

  async function sendForm(
    event: FormEvent<HTMLFormElement>,
    kind: "contact" | "book",
  ) {
    event.preventDefault();
    const form = event.currentTarget;
    const setter = kind === "contact" ? setFormState : setNotifyState;
    setter("sending");

    try {
      const payload = Object.fromEntries(new FormData(form).entries());
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, kind }),
      });
      if (!response.ok) throw new Error("Request failed");
      setter("sent");
      form.reset();
    } catch {
      setter("error");
    }
  }

  const contactLine1Shown = contactHeadline.line1.slice(
    0,
    Math.min(contactHeadlineChars, contactHeadline.line1.length),
  );
  const contactAfterLine1 = Math.max(
    0,
    contactHeadlineChars - contactHeadline.line1.length,
  );
  const contactPrefixShown = contactHeadline.line2Prefix.slice(
    0,
    Math.min(contactAfterLine1, contactHeadline.line2Prefix.length),
  );
  const contactAfterPrefix = Math.max(
    0,
    contactAfterLine1 - contactHeadline.line2Prefix.length,
  );
  const contactPossibleShown = contactHeadline.possible.slice(
    0,
    Math.min(contactAfterPrefix, contactHeadline.possible.length),
  );
  const showContactLineBreak =
    contactHeadlineDone ||
    contactHeadlineChars > contactHeadline.line1.length;

  return (
    <main>
      <a className="skip-link" href="#content">
        Skip to content
      </a>

      <header className="site-header">
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#consulting">Strategic Advisor</a>
          <a href="#speaking">Speaker & Counsellor</a>
        </nav>
        <a className="header-cta" href="#contact">
          Start a conversation <ArrowIcon />
        </a>
        <button
          className={`menu-button ${menuOpen ? "is-open" : ""}`}
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </header>

      <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`}>
        {(
          [
            { id: "consulting", label: "Strategic Advisor" },
            { id: "speaking", label: "Speaker & Counsellor" },
            { id: "contact", label: "Contact" },
          ] as const
        ).map((item, index) => (
          <a
            href={`#${item.id}`}
            key={item.id}
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
          >
            <span>0{index + 1}</span>
            {item.label}
          </a>
        ))}
      </div>

      <section className="hero" id="top" aria-label="Introduction">
        <div className="hero-content">
          <p className="eyebrow reveal">
            Strategic advisor · Motivational speaker
          </p>
          <h1 className="hero-title reveal">
            Ambition,
            <br />
            <em>architected.</em>
          </h1>
          <div className="hero-bottom reveal">
            <p>
              Enabling leaders to turn{" "}
              <strong className="hero-emphasis">
                strategy into implementation.
              </strong>
              <br />
              Enabling people to turn{" "}
              <strong className="hero-emphasis">ambition into direction.</strong>
            </p>
            <div className="hero-actions">
              <a className="button button-light" href="#paths">
                Explore my work <ArrowIcon />
              </a>
              <a className="text-link" href="#contact">
                Get in touch
              </a>
            </div>
          </div>
        </div>
        <div className="hero-media">
          <video
            className="hero-video"
            autoPlay
            muted={heroMuted}
            playsInline
            poster="/media/speaking/featured-speaker.png"
            ref={heroVideoRef}
            onEnded={replayHeroMuted}
            onTimeUpdate={skipHeroEnding}
          >
            <source src="/media/video/anup-speaking-reel.mp4" type="video/mp4" />
          </video>
          <div className="hero-media-shade" />
          <a className="hero-logo" href="#top" aria-label="Anup Varghese home">
            <Mark />
          </a>
          <button
            className={`video-control${heroMuted ? " is-inviting" : ""}`}
            type="button"
            onClick={toggleHeroSound}
            aria-label={heroMuted ? "Play video audio" : "Mute video audio"}
          >
            {heroMuted ? "Play audio" : "Mute audio"}
            <span>{heroMuted ? "♪" : "×"}</span>
          </button>
        </div>
        <div className="scroll-cue" aria-hidden="true">
          Scroll to discover <span />
        </div>
      </section>

      <div id="content">
        <section className="paths" id="paths">
          <div className="path-grid">
            <a className="path-card path-consultant" href="#consulting">
              <span className="path-card-visual" aria-hidden="true">
                <Image
                  src="/media/portraits/consulting-landscape.png"
                  alt=""
                  fill
                  sizes="(max-width: 760px) 100vw, 50vw"
                />
              </span>
              <span className="path-index">01</span>
              <div>
                <p className="eyebrow">For leaders & organizations</p>
                <h3>
                  Strategic
                  <br />
                  Advisor
                </h3>
                <p>
                  For the past 15 years, I have enabled senior leaders—CEOs,
                  CCOs, CDOs, VPs, GMs and rulers—to optimize the bottom line,
                  grow the top line and navigate the era of digital and
                  AI-driven change.
                </p>
              </div>
              <div className="path-affiliations">
                <p className="eyebrow">Affiliations</p>
                <div className="path-affiliation-logos">
                  {affiliations.map((logo) => {
                    const key = logo.src.includes("arthur")
                      ? "adl"
                      : logo.src.includes("mckinsey")
                        ? "mckinsey"
                        : logo.src.includes("beroe")
                          ? "beroe"
                          : undefined;
                    return (
                      <span
                        className="path-affiliation-logo"
                        data-logo={key}
                        key={logo.src}
                      >
                        <Image
                          src={logo.src}
                          alt={logo.alt}
                          width={160}
                          height={48}
                          className="path-affiliation-logo-img"
                        />
                      </span>
                    );
                  })}
                </div>
              </div>
              <span className="circle-arrow">
                <ArrowIcon />
              </span>
            </a>
            <a className="path-card path-speaker" href="#speaking">
              <span className="path-card-visual" aria-hidden="true">
                <Image
                  src="/media/speaking/featured-speaker.png"
                  alt=""
                  fill
                  sizes="(max-width: 760px) 100vw, 50vw"
                />
              </span>
              <span className="path-index">02</span>
              <div>
                <p className="eyebrow">For people & potential</p>
                <h3>
                  Speaker &
                  <br />
                  Counsellor
                </h3>
                <p>
                  Inspiring students and young professionals to unlock their
                  full potential, define the future they want and build a
                  practical roadmap to achieve it.
                </p>
              </div>
              <div className="path-affiliations">
                <p className="eyebrow">Collaborations include</p>
                <div className="path-affiliation-logos">
                  {institutions.map((logo) => {
                    const logoKey = logo.src.includes("oxford")
                      ? "oxford"
                      : logo.src.includes("gems.png")
                        ? "gems"
                        : undefined;
                    return (
                      <span
                        className="path-affiliation-logo"
                        data-logo={logoKey}
                        key={logo.src}
                      >
                        <Image
                          src={logo.src}
                          alt={logo.alt}
                          width={180}
                          height={56}
                          className="path-affiliation-logo-img"
                        />
                      </span>
                    );
                  })}
                </div>
              </div>
              <span className="circle-arrow">
                <ArrowIcon />
              </span>
            </a>
          </div>
        </section>

        <section className="book section-pad" id="book" ref={bookSectionRef}>
          <div className="book-art">
            <figure
              className={`book-jacket${
                bookReveal === "entered"
                  ? " is-entered"
                  : bookReveal === "settled"
                    ? " is-settled"
                    : ""
              }`}
              ref={bookJacketRef}
              aria-label="Swimming in the MIDDLE book cover"
            >
              <Image
                src="/media/book-jacket-black.png"
                alt="Swimming in the MIDDLE — A Middle-Bencher's Guide to Survival, by Anup Varghese and Nipun Varma"
                width={1015}
                height={706}
                sizes="(max-width: 760px) 100vw, 70vw"
              />
            </figure>
            <div className="publisher-credit">
              <Image
                src="/media/readomania-logo-gold.png"
                alt=""
                width={216}
                height={108}
                className="publisher-logo"
                sizes="13.5rem"
              />
              <span>Traditionally published by Readomania</span>
            </div>
          </div>
          <div className="book-copy">
            <p className="eyebrow gold">New Book Release</p>
            <h2>
              <span
                className={`swim-title${swimTitleVisible ? " is-visible" : ""}`}
                aria-label="Swimming"
              >
                {"Swimming".split("").map((letter, index) => (
                  <span
                    className="swim-letter"
                    key={`${letter}-${index}`}
                    style={{ ["--swim-i" as string]: index }}
                    aria-hidden="true"
                  >
                    {letter}
                  </span>
                ))}
              </span>{" "}
              in the
              <br />
              <em>MIDDLE.</em>
            </h2>
            <p>
              A motivational book for anyone who knows they are capable of
              more—and needs a practical, witty roadmap to get there.
              Co-authored with Nipun Varma.
            </p>
            <div
              className={`launch-date${releaseCelebrate ? " is-celebrating" : ""}`}
              ref={launchDateRef}
            >
              <span>Releasing</span>
              <strong>1 January 2027</strong>
              <span className="launch-sparks" aria-hidden="true">
                <i /><i /><i /><i /><i />
              </span>
            </div>
            <form className="notify-form" onSubmit={(event) => sendForm(event, "book")}>
              <label className="sr-only" htmlFor="notify-email">Email address</label>
              <input id="notify-email" name="email" type="email" placeholder="Your email address" required />
              <button type="submit" disabled={notifyState === "sending"}>
                {notifyState === "sending" ? "Sending…" : "Notify me when released"} <ArrowIcon />
              </button>
            </form>
            <div aria-live="polite">
              {notifyState === "sent" && <p className="form-note success">You’re on the launch list.</p>}
              {notifyState === "error" && <p className="form-note">Email signup needs to be connected before launch.</p>}
            </div>
          </div>
        </section>

        <section className="consulting section-pad" id="consulting">
          <header className="consulting-top">
            <p className="domain-label">For leaders & organizations</p>
            <p className="consulting-lede">
              Fifteen years helping senior leaders turn strategy into
              measurable results—across industries, markets, and inflection points.
            </p>
          </header>

          <div className="consulting-stage">
            <div className="industry-showcase" aria-live="polite">
              {industries.map((industry, index) => (
                <div
                  className={`industry-slide${index === industryIndex ? " is-active" : ""}`}
                  key={industry.name}
                >
                  <Image
                    src={industry.image}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 100vw, 58vw"
                    priority={index === 0}
                  />
                </div>
              ))}
              <div className="industry-showcase-shade" />
              <div className="industry-showcase-copy">
                <p className="eyebrow">Industries served</p>
                <h3>{industries[industryIndex].name}</h3>
                <p>
                  {industryIndex + 1} / {industries.length}
                </p>
              </div>
              <div className="industry-dots" role="tablist" aria-label="Industries">
                {industries.map((industry, index) => (
                  <button
                    key={industry.name}
                    type="button"
                    role="tab"
                    aria-selected={index === industryIndex}
                    aria-label={industry.name}
                    className={index === industryIndex ? "is-active" : undefined}
                    onClick={() => setIndustryIndex(index)}
                  />
                ))}
              </div>
              <div
                className={`metric-banner${metricsVisible ? " is-visible" : ""}`}
                ref={metricsRef}
              >
                {consultingMetrics.map((metric) => (
                  <div className="metric" key={metric.label}>
                    <MetricVisual visual={metric.visual} active={metricsVisible} />
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="consulting-side">
              <div className="consulting-focus">
                <span className="sr-only" aria-live="polite">
                  {focusAnnounce}
                </span>
                <p
                  className="consulting-focus-line"
                  data-typing={focusTyping ? "true" : "false"}
                  aria-hidden="true"
                >
                  {focusText}
                </p>
              </div>
            </div>
          </div>

          <div className="expertise">
            <div className="expertise-column expertise-functions">
              <p className="eyebrow gold">Functional areas optimized</p>
              <ul className="function-list">
                {functionalAreas.map((area) => (
                  <li key={area.label}>
                    <FunctionIcon icon={area.icon} />
                    <span className="function-label">
                      {area.label}
                      {area.aiEnabled ? (
                        <span className="ai-enabled-badge" title="AI-Enabled">
                          <svg
                            className="ai-enabled-glyph"
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                          >
                            <path d="M8 1.2l.85 3.35L12.2 5.4l-3.35.85L8 9.6l-.85-3.35L3.8 5.4l3.35-.85L8 1.2Z" />
                            <path d="M12.6 9.2l.45 1.75 1.75.45-1.75.45-.45 1.75-.45-1.75-1.75-.45 1.75-.45.45-1.75Z" />
                          </svg>
                          AI-Enabled
                        </span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="domain-break" aria-hidden="true" />

        <section className="speaking section-pad" id="speaking">
          <p className="domain-label">For people & motivation</p>
          <div className="speaking-panel">
            <div className="speaking-backdrop" aria-hidden="true">
              <Image
                src="/media/speaking/audience-backdrop.png"
                alt=""
                fill
                sizes="100vw"
                priority={false}
              />
            </div>
            <div className="speaking-content">
              <div className="speaking-main">
                <div className="section-number light">03 / Speaker & Counsellor</div>
                <p className="eyebrow">Grounded inspiration</p>
                <h2>
                  Build the ambition.
                  <br />
                  Then build the <em>roadmap.</em>
                </h2>
                <p className="lead">
                  Inspiration matters. But it matters most when it becomes
                  direction. I help young people see what is possible—and leave
                  with practical next steps to move toward it.
                </p>
                <p className="speaker-caption-inline">
                  Inspiring thousands of students and young professionals
                </p>
                <SpeakingStats />
                <div
                  className={`speaking-actions${speakingCtaVisible ? " is-visible" : ""}`}
                  ref={speakingActionsRef}
                >
                  <a className="button button-coral" href="#contact">
                    Invite Anup to speak <ArrowIcon />
                  </a>
                </div>
              </div>
              <div className="speaking-aside">
                <div
                  className="speaking-carousel"
                  aria-live="polite"
                  aria-label="Speaking photos"
                >
                  {speakingPhotos.map((photo, index) => (
                    <div
                      className={`speaking-carousel-slide${index === speakingIndex ? " is-active" : ""}`}
                      key={photo.src}
                    >
                      <Image
                        src={photo.src}
                        alt={index === speakingIndex ? photo.alt : ""}
                        fill
                        sizes="(max-width: 900px) 70vw, 432px"
                        priority={false}
                      />
                    </div>
                  ))}
                </div>
                <div
                  className={`offering-list${offeringsVisible ? " is-visible" : ""}`}
                  ref={offeringListRef}
                >
                  {speakerOfferings.map((item) => (
                    <div key={item.label}>
                      <OfferingIcon icon={item.icon} />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className={`contact section-pad${contactVisible ? " is-visible" : ""}`}
          id="contact"
          ref={contactRef}
        >
          <div className="contact-intro">
            <div className="section-number light">04 / Start a conversation</div>
            <p className="eyebrow gold">What meaningful change are you here to make?</p>
            <h2
              className={`contact-headline${contactHeadlineDone ? " is-complete" : ""}`}
            >
              <span className="sr-only">
                Let&apos;s talk about what&apos;s possible.
              </span>
              <span className="contact-headline-measure" aria-hidden="true">
                Let&apos;s talk about
                <br />
                what&apos;s <em className="contact-possible">possible.</em>
              </span>
              <span className="contact-headline-typed" aria-hidden="true">
                {contactLine1Shown}
                {showContactLineBreak ? <br /> : null}
                {contactPrefixShown}
                {contactPossibleShown ? (
                  <em
                    className={`contact-possible${contactHeadlineDone ? " is-typed" : ""}`}
                  >
                    {contactPossibleShown}
                  </em>
                ) : null}
                {contactVisible && !contactHeadlineDone ? (
                  <span className="contact-headline-caret" />
                ) : null}
              </span>
            </h2>
            <p>
              Bring a strategic challenge, invite me to speak, or ask about
              counselling. Tell me what is on your mind.
            </p>
            <div className="contact-emails">
              <a className="contact-email" href="mailto:contact@anupvarghese.com">
                contact@anupvarghese.com
              </a>
              <a className="contact-email" href="mailto:anup.jv@gmail.com">
                anup.jv@gmail.com
              </a>
            </div>
            <div className="contact-portrait-row">
              <div className="contact-portrait">
                <Image
                  src="/media/portraits/contact-portrait.png"
                  alt="Anup Varghese in Paris"
                  fill
                  sizes="9rem"
                />
              </div>
              <a
                className="contact-linkedin"
                href="https://www.linkedin.com/in/anup-varghese/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Image
                  src="/media/icons/linkedin.png"
                  alt=""
                  width={40}
                  height={40}
                />
              </a>
            </div>
          </div>
          <form className="contact-form" onSubmit={(event) => sendForm(event, "contact")}>
            <input className="honeypot" name="company_website" tabIndex={-1} autoComplete="off" />
            <label>
              <span>Your name</span>
              <input name="name" type="text" placeholder="How should I address you?" required />
            </label>
            <label>
              <span>Email address</span>
              <input name="email" type="email" placeholder="you@company.com" required />
            </label>
            <label>
              <span>Contact number</span>
              <input name="phone" type="tel" placeholder="+971 00 000 0000" />
            </label>
            <fieldset>
              <legend>I&apos;m interested in</legend>
              <label><input type="radio" name="interest" value="Consulting" required /><span>Consulting</span></label>
              <label><input type="radio" name="interest" value="Speaking" /><span>Speaking</span></label>
              <label><input type="radio" name="interest" value="Counselling" /><span>Counselling</span></label>
              <label><input type="radio" name="interest" value="Other" /><span>Other</span></label>
            </fieldset>
            <label>
              <span>How can I help?</span>
              <textarea name="message" rows={4} placeholder="A little context goes a long way…" required />
            </label>
            <button className="button button-coral submit-button" type="submit" disabled={formState === "sending"}>
              {formState === "sending" ? "Sending…" : "Send enquiry"} <ArrowIcon />
            </button>
            <div aria-live="polite">
              {formState === "sent" && <p className="form-note success">Thank you. Your note is on its way.</p>}
              {formState === "error" && <p className="form-note">Something went wrong. Please email anup.jv@gmail.com.</p>}
            </div>
          </form>
        </section>
      </div>

      <footer>
        <a href="#top"><Mark /></a>
        <span>© {new Date().getFullYear()} Anup Varghese</span>
      </footer>
    </main>
  );
}
