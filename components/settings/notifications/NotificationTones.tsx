"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Volume2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  NOTIFICATION_TONES,
  previewNotificationTone,
  readNotificationRepeats,
  readNotificationTone,
  readNotificationVolume,
  saveNotificationRepeats,
  saveNotificationTone,
  saveNotificationVolume,
} from "@/lib/notification-tones";

export const NotificationTones = () => {
  const [selected, setSelected] = useState("pulse");
  const [volume, setVolume] = useState(100);
  const [repeats, setRepeats] = useState(3);
  const [playing, setPlaying] = useState<string | null>(null);

  useEffect(() => {
    setSelected(readNotificationTone());
    setVolume(readNotificationVolume());
    setRepeats(readNotificationRepeats());
  }, []);

  const play = async (id: string, times = repeats) => {
    setPlaying(id);
    const count = await previewNotificationTone(id, times);
    window.setTimeout(() => {
      setPlaying((current) => (current === id ? null : current));
    }, Math.max(700, count * 780));
  };

  const choose = async (id: string) => {
    saveNotificationTone(id);
    setSelected(id);
    await play(id);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Notification tone"
        description="Preview a sound, set how loud it is, and choose how many times each follow-up alert plays it."
      />
      <div className="surface grid gap-6 p-5 sm:grid-cols-2">
        <label className="block">
          <span className="flex items-center justify-between text-sm font-semibold">
            Volume
            <span className="font-medium text-muted-foreground">{volume}%</span>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            className="mt-3 w-full accent-green-700"
            onChange={(event) => {
              const next = Number(event.target.value);
              setVolume(next);
              saveNotificationVolume(next);
            }}
            onPointerUp={() => void play(selected, 1)}
          />
        </label>
        <label className="block">
          <span className="flex items-center justify-between text-sm font-semibold">
            Play length
            <span className="font-medium text-muted-foreground">
              {repeats} {repeats === 1 ? "time" : "times"}
            </span>
          </span>
          <input
            type="range"
            min={1}
            max={15}
            value={repeats}
            className="mt-3 w-full accent-green-700"
            onChange={(event) => {
              const next = Number(event.target.value);
              setRepeats(next);
              saveNotificationRepeats(next);
            }}
            onPointerUp={(event) => void play(selected, Number(event.currentTarget.value))}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Raise this to keep the alert playing longer.
          </p>
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {NOTIFICATION_TONES.map((tone) => {
          const active = selected === tone.id;
          return (
            <div
              key={tone.id}
              className={cn(
                "surface flex flex-col p-4",
                active && "ring-2 ring-green-600",
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "inline-flex rounded-xl p-2.5",
                    active ? "bg-green-600 text-white" : "bg-green-50 text-green-700",
                  )}
                >
                  <Bell className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <h2 className="font-semibold">{tone.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{tone.description}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => void play(tone.id)}
                >
                  <Volume2 className="h-4 w-4" />
                  {playing === tone.id ? "Playing" : "Play"}
                </Button>
                <Button
                  type="button"
                  variant={active ? "secondary" : "default"}
                  className="flex-1"
                  onClick={() => void choose(tone.id)}
                >
                  {active ? <Check className="h-4 w-4" /> : null}
                  {active ? "Selected" : "Use tone"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
