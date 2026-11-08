"use client";

import { useRef, useState } from "react";

type SoundId = "motor" | "phone" | "rattle" | "throb" | "stutter";

const OPTIONS: Array<{
  id: SoundId;
  name: string;
  detail: string;
}> = [
  {
    id: "motor",
    name: "1 · Heavy motor",
    detail: "Low, thick buzz. Closest to a phone sitting on a table.",
  },
  {
    id: "phone",
    name: "2 · Double vibrate",
    detail: "Two short deep bursts, the way a handset vibrates twice.",
  },
  {
    id: "rattle",
    name: "3 · Fast rattle",
    detail: "Quick tight ticks. Sharper and easier to hear across a room.",
  },
  {
    id: "throb",
    name: "4 · Deep throb",
    detail: "Slow, heavy pulses. More rumble than buzz.",
  },
  {
    id: "stutter",
    name: "5 · Rising stutter",
    detail: "Three buzzes in a row, each a bit higher and stronger.",
  },
];

function audioContext() {
  const AudioCtx =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return null;
  const context = new AudioCtx();
  return context;
}

function pulse(
  context: AudioContext,
  start: number,
  frequency: number,
  peak: number,
  length: number,
  type: OscillatorType,
  cutoff: number,
) {
  const tone = context.createOscillator();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  tone.type = type;
  tone.frequency.setValueAtTime(frequency, start);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(cutoff, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(Math.max(peak, 0.001), start + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  tone.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  tone.start(start);
  tone.stop(start + length + 0.02);
}

function schedule(id: SoundId, context: AudioContext, start: number) {
  if (id === "motor") {
    const on = 0.034;
    const gap = 0.018;
    for (let index = 0; index < 8; index += 1) {
      const at = start + index * (on + gap);
      pulse(context, at, 86, 0.62, on, "square", 240);
      pulse(context, at, 172, 0.34, on, "square", 240);
    }
    return 0.42;
  }
  if (id === "phone") {
    const burst = (from: number) => {
      for (let index = 0; index < 5; index += 1) {
        const at = from + index * 0.036;
        pulse(context, at, 62, 0.7, 0.022, "sawtooth", 180);
        pulse(context, at, 124, 0.28, 0.022, "square", 220);
      }
    };
    burst(start);
    burst(start + 0.28);
    return 0.5;
  }
  if (id === "rattle") {
    for (let index = 0; index < 16; index += 1) {
      const at = start + index * 0.028;
      pulse(context, at, 210, 0.42, 0.012, "square", 900);
      pulse(context, at, 105, 0.22, 0.012, "square", 400);
    }
    return 0.46;
  }
  if (id === "throb") {
    for (let index = 0; index < 4; index += 1) {
      const at = start + index * 0.16;
      pulse(context, at, 48, 0.75, 0.09, "sawtooth", 140);
      pulse(context, at, 96, 0.3, 0.09, "triangle", 180);
    }
    return 0.64;
  }
  const steps = [140, 186, 248];
  steps.forEach((frequency, step) => {
    const from = start + step * 0.2;
    for (let index = 0; index < 4; index += 1) {
      const at = from + index * 0.032;
      pulse(context, at, frequency, 0.28 + step * 0.12, 0.02, "square", 700);
    }
  });
  return 0.62;
}

export function AlertSoundPreview() {
  const [playing, setPlaying] = useState<string | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const stopRef = useRef<number | null>(null);

  const play = async (id: SoundId, times: number) => {
    if (!contextRef.current || contextRef.current.state === "closed") {
      contextRef.current = audioContext();
    }
    const context = contextRef.current;
    if (!context) return;
    if (context.state === "suspended") await context.resume();
    if (stopRef.current !== null) window.clearTimeout(stopRef.current);
    const start = context.currentTime + 0.02;
    let cursor = 0;
    for (let index = 0; index < times; index += 1) {
      const length = schedule(id, context, start + cursor);
      cursor += length + 0.28;
    }
    const key = `${id}-${times}`;
    setPlaying(key);
    stopRef.current = window.setTimeout(() => {
      setPlaying((current) => (current === key ? null : current));
    }, cursor * 1000);
    return cursor;
  };

  const playAll = async () => {
    if (!contextRef.current || contextRef.current.state === "closed") {
      contextRef.current = audioContext();
    }
    const context = contextRef.current;
    if (!context) return;
    if (context.state === "suspended") await context.resume();
    if (stopRef.current !== null) window.clearTimeout(stopRef.current);
    let cursor = 0.05;
    const marks: Array<{ id: SoundId; at: number }> = [];
    for (const option of OPTIONS) {
      marks.push({ id: option.id, at: cursor });
      const length = schedule(option.id, context, context.currentTime + cursor);
      cursor += length + 0.85;
    }
    const show = (index: number) => {
      const mark = marks[index];
      if (!mark) {
        setPlaying(null);
        return;
      }
      setPlaying(`${mark.id}-1`);
      const next = marks[index + 1];
      const wait = ((next ? next.at : cursor) - mark.at) * 1000;
      stopRef.current = window.setTimeout(() => show(index + 1), wait);
    };
    show(0);
  };

  return (
    <main className="mx-auto min-h-screen max-w-xl px-5 py-10 text-slate-100">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
        Follow-up alert
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Pick a vibration sound
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        Play each one. “Three times” is how the bell repeats for a new follow-up.
        Tell me the number you want on the notification.
      </p>
      <button
        type="button"
        onClick={() => void playAll()}
        className="mt-6 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950"
      >
        Play all five
      </button>
      <div className="mt-8 space-y-3">
        {OPTIONS.map((option) => (
          <section
            key={option.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <h2 className="text-base font-semibold">{option.name}</h2>
            <p className="mt-1 text-sm text-slate-300">{option.detail}</p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => void play(option.id, 1)}
                className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950"
              >
                {playing === `${option.id}-1` ? "Playing…" : "Play once"}
              </button>
              <button
                type="button"
                onClick={() => void play(option.id, 3)}
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold"
              >
                {playing === `${option.id}-3` ? "Playing…" : "Three times"}
              </button>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
