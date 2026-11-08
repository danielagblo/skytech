export const NOTIFICATION_TONE_KEY = "skytech-notification-tone";
export const NOTIFICATION_VOLUME_KEY = "skytech-notification-volume";
export const NOTIFICATION_REPEATS_KEY = "skytech-notification-repeats";

export type NotificationTone = {
  id: string;
  name: string;
  description: string;
};

export const NOTIFICATION_TONES: NotificationTone[] = [
  { id: "pulse", name: "Pulse", description: "Strong vibrating buzz" },
  { id: "crystal", name: "Crystal", description: "Bright three-note bell" },
  { id: "radar", name: "Radar", description: "Rising scan, then a lock" },
  { id: "sonar", name: "Sonar", description: "Deep ping with an echo" },
  { id: "coin", name: "Coin", description: "Short arcade pickup" },
  { id: "marimba", name: "Marimba", description: "Warm wooden steps" },
  { id: "neon", name: "Neon", description: "Synth falling through light" },
  { id: "heartbeat", name: "Heartbeat", description: "Two low thumps" },
  { id: "spark", name: "Spark", description: "Tiny high flash" },
  { id: "orbit", name: "Orbit", description: "A tone that lifts and settles" },
  { id: "chimes", name: "Chimes", description: "Soft high bells in a row" },
  { id: "knock", name: "Knock", description: "Three firm taps" },
  { id: "siren", name: "Siren", description: "Quick rise and fall" },
  { id: "drop", name: "Drop", description: "A note that falls away" },
  { id: "ping", name: "Ping", description: "One clean lasting tone" },
];

const DEFAULT_TONE = "pulse";
const DEFAULT_VOLUME = 100;
const DEFAULT_REPEATS = 3;

let sharedAudio: AudioContext | null = null;
let masterGain: GainNode | null = null;
let booster: GainNode | null = null;
let previewTimer: number | null = null;
const LOUDNESS = 8;

export function notificationAudio() {
  const AudioCtx =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudio || sharedAudio.state === "closed") sharedAudio = new AudioCtx();
  return sharedAudio;
}

export function readNotificationTone() {
  try {
    const stored = localStorage.getItem(NOTIFICATION_TONE_KEY);
    if (stored && NOTIFICATION_TONES.some((tone) => tone.id === stored)) return stored;
  } catch {
    return DEFAULT_TONE;
  }
  return DEFAULT_TONE;
}

export function saveNotificationTone(id: string) {
  if (!NOTIFICATION_TONES.some((tone) => tone.id === id)) return;
  localStorage.setItem(NOTIFICATION_TONE_KEY, id);
}

function clampNumber(value: number, min: number, max: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function readNotificationVolume() {
  try {
    return clampNumber(Number(localStorage.getItem(NOTIFICATION_VOLUME_KEY)), 0, 100, DEFAULT_VOLUME);
  } catch {
    return DEFAULT_VOLUME;
  }
}

export function saveNotificationVolume(volume: number) {
  localStorage.setItem(
    NOTIFICATION_VOLUME_KEY,
    String(clampNumber(volume, 0, 100, DEFAULT_VOLUME)),
  );
  applyVolume();
}

export function readNotificationRepeats() {
  try {
    return clampNumber(Number(localStorage.getItem(NOTIFICATION_REPEATS_KEY)), 1, 15, DEFAULT_REPEATS);
  } catch {
    return DEFAULT_REPEATS;
  }
}

export function saveNotificationRepeats(repeats: number) {
  localStorage.setItem(
    NOTIFICATION_REPEATS_KEY,
    String(clampNumber(repeats, 1, 15, DEFAULT_REPEATS)),
  );
}

function output(context: AudioContext) {
  if (!masterGain || masterGain.context !== context) {
    masterGain = context.createGain();
    booster = context.createGain();
    const limiter = context.createDynamicsCompressor();
    limiter.threshold.value = -6;
    limiter.knee.value = 4;
    limiter.ratio.value = 14;
    limiter.attack.value = 0.002;
    limiter.release.value = 0.08;
    masterGain.connect(booster);
    booster.connect(limiter);
    limiter.connect(context.destination);
  }
  applyVolume();
  return masterGain;
}

function applyVolume() {
  if (!masterGain || !booster) return;
  const level = readNotificationVolume() / 100;
  masterGain.gain.value = level * level;
  booster.gain.value = LOUDNESS;
}

function voice(
  context: AudioContext,
  options: {
    type: OscillatorType;
    frequency: number;
    endFrequency?: number;
    start: number;
    duration: number;
    peak: number;
    delay?: number;
    filterHz?: number;
  },
) {
  const start = options.start + (options.delay ?? 0);
  const tone = context.createOscillator();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  tone.type = options.type;
  tone.frequency.setValueAtTime(Math.max(40, options.frequency), start);
  if (options.endFrequency) {
    tone.frequency.exponentialRampToValueAtTime(
      Math.max(40, options.endFrequency),
      start + options.duration,
    );
  }
  filter.type = "lowpass";
  filter.frequency.value =
    options.filterHz ??
    (options.type === "sawtooth" ? 900 : options.type === "square" ? 1400 : 6400);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(options.peak, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + options.duration);
  tone.connect(filter);
  filter.connect(gain);
  gain.connect(output(context));
  tone.start(start);
  tone.stop(start + options.duration + 0.03);
}

function pulse(context: AudioContext, now: number) {
  const pulses = 8;
  const on = 0.034;
  const gap = 0.018;
  for (let index = 0; index < pulses; index += 1) {
    const start = now + index * (on + gap);
    voice(context, { type: "square", frequency: 86, start, duration: on, peak: 0.5, filterHz: 240 });
    voice(context, { type: "square", frequency: 172, start, duration: on, peak: 0.28, filterHz: 240 });
  }
  if (
    readNotificationVolume() > 0 &&
    typeof navigator !== "undefined" &&
    typeof navigator.vibrate === "function"
  ) {
    navigator.vibrate([240, 70, 240]);
  }
}

const players: Record<string, (context: AudioContext, now: number) => void> = {
  pulse,
  crystal: (context, now) => {
    voice(context, { type: "sine", frequency: 523, start: now, duration: 0.55, peak: 0.22 });
    voice(context, { type: "sine", frequency: 659, start: now, duration: 0.48, peak: 0.12, delay: 0.03 });
    voice(context, { type: "sine", frequency: 784, start: now, duration: 0.42, peak: 0.08, delay: 0.06 });
  },
  radar: (context, now) => {
    voice(context, { type: "sine", frequency: 420, endFrequency: 980, start: now, duration: 0.22, peak: 0.26 });
    voice(context, { type: "sine", frequency: 980, start: now, duration: 0.2, peak: 0.14, delay: 0.2 });
  },
  sonar: (context, now) => {
    voice(context, { type: "sine", frequency: 196, start: now, duration: 0.34, peak: 0.38 });
    voice(context, { type: "sine", frequency: 196, start: now, duration: 0.28, peak: 0.16, delay: 0.22 });
  },
  coin: (context, now) => {
    voice(context, { type: "square", frequency: 988, start: now, duration: 0.09, peak: 0.16 });
    voice(context, { type: "square", frequency: 1319, start: now, duration: 0.18, peak: 0.14, delay: 0.09 });
  },
  marimba: (context, now) => {
    voice(context, { type: "triangle", frequency: 392, start: now, duration: 0.2, peak: 0.28 });
    voice(context, { type: "triangle", frequency: 494, start: now, duration: 0.2, peak: 0.24, delay: 0.12 });
    voice(context, { type: "triangle", frequency: 587, start: now, duration: 0.32, peak: 0.2, delay: 0.24 });
  },
  neon: (context, now) => {
    voice(context, { type: "sawtooth", frequency: 660, endFrequency: 180, start: now, duration: 0.46, peak: 0.12 });
  },
  heartbeat: (context, now) => {
    voice(context, { type: "sine", frequency: 62, start: now, duration: 0.12, peak: 0.62 });
    voice(context, { type: "sine", frequency: 48, start: now, duration: 0.16, peak: 0.58, delay: 0.16 });
  },
  spark: (context, now) => {
    voice(context, { type: "sine", frequency: 1760, start: now, duration: 0.12, peak: 0.12 });
    voice(context, { type: "triangle", frequency: 2637, start: now, duration: 0.2, peak: 0.05, delay: 0.02 });
  },
  orbit: (context, now) => {
    voice(context, { type: "triangle", frequency: 330, endFrequency: 660, start: now, duration: 0.2, peak: 0.22 });
    voice(context, { type: "triangle", frequency: 660, endFrequency: 440, start: now, duration: 0.24, peak: 0.18, delay: 0.18 });
  },
  chimes: (context, now) => {
    voice(context, { type: "sine", frequency: 1046, start: now, duration: 0.42, peak: 0.12 });
    voice(context, { type: "sine", frequency: 1318, start: now, duration: 0.36, peak: 0.08, delay: 0.08 });
    voice(context, { type: "sine", frequency: 1568, start: now, duration: 0.32, peak: 0.06, delay: 0.16 });
  },
  knock: (context, now) => {
    voice(context, { type: "triangle", frequency: 140, start: now, duration: 0.07, peak: 0.42 });
    voice(context, { type: "triangle", frequency: 120, start: now, duration: 0.07, peak: 0.38, delay: 0.1 });
    voice(context, { type: "triangle", frequency: 100, start: now, duration: 0.1, peak: 0.36, delay: 0.2 });
  },
  siren: (context, now) => {
    voice(context, { type: "sine", frequency: 520, endFrequency: 880, start: now, duration: 0.16, peak: 0.22 });
    voice(context, { type: "sine", frequency: 880, endFrequency: 520, start: now, duration: 0.18, peak: 0.18, delay: 0.14 });
  },
  drop: (context, now) => {
    voice(context, { type: "sawtooth", frequency: 740, endFrequency: 90, start: now, duration: 0.42, peak: 0.14 });
  },
  ping: (context, now) => {
    voice(context, { type: "sine", frequency: 880, start: now, duration: 0.55, peak: 0.2 });
    voice(context, { type: "sine", frequency: 1760, start: now, duration: 0.28, peak: 0.04 });
  },
};

export function playNotificationTone(id = readNotificationTone()) {
  const context = notificationAudio();
  if (!context || context.state !== "running") return false;
  const play = players[id] ?? players[DEFAULT_TONE];
  play(context, context.currentTime);
  return true;
}

export function stopNotificationPreview() {
  if (previewTimer !== null) {
    window.clearTimeout(previewTimer);
    previewTimer = null;
  }
}

export function playNotificationSequence(id = readNotificationTone(), repeats = readNotificationRepeats()) {
  stopNotificationPreview();
  const times = clampNumber(repeats, 1, 15, DEFAULT_REPEATS);
  const run = (left: number) => {
    playNotificationTone(id);
    if (left <= 1) return;
    previewTimer = window.setTimeout(() => run(left - 1), 780);
  };
  run(times);
  return times;
}

export async function previewNotificationTone(id: string, repeats = readNotificationRepeats()) {
  const context = notificationAudio();
  if (!context) return 0;
  if (context.state === "suspended") await context.resume();
  if (context.state !== "running") return 0;
  return playNotificationSequence(id, repeats);
}
