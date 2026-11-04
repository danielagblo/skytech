"use client";

import { useState, type SyntheticEvent } from "react";
import { Trash2 } from "lucide-react";

export const CardRemoveButton = ({
  label,
  pending,
  onRemove,
}: {
  label: string;
  pending?: boolean;
  onRemove: () => void;
}) => {
  const [confirming, setConfirming] = useState(false);
  const stop = (event: SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  if (!confirming) {
    return (
      <button
        type="button"
        aria-label={`Remove ${label}`}
        disabled={pending}
        className="inline-flex h-7 items-center gap-1 rounded-md px-1.5 text-[10px] font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/40"
        onPointerDown={stop}
        onClick={(event) => {
          stop(event);
          setConfirming(true);
        }}
      >
        <Trash2 className="h-3.5 w-3.5" />
        Remove
      </button>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1"
      onPointerDown={stop}
      onClick={stop}
    >
      <button
        type="button"
        disabled={pending}
        className="rounded-md bg-red-600 px-2 py-1 text-[10px] font-medium text-white disabled:opacity-50"
        onClick={(event) => {
          stop(event);
          onRemove();
        }}
      >
        {pending ? "Removing…" : "Confirm"}
      </button>
      <button
        type="button"
        className="rounded-md px-2 py-1 text-[10px] font-medium text-muted-foreground hover:bg-muted"
        onClick={(event) => {
          stop(event);
          setConfirming(false);
        }}
      >
        Keep
      </button>
    </span>
  );
};
