"use client";

import { Checkbox } from "@/components/ui/checkbox";
import type { User } from "@/types/user.types";

export const AssigneePicker = ({
  users,
  value,
  onChange,
  disabled,
}: {
  users: User[];
  value: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
}) => {
  const active = users.filter((user) => user.active);
  const selected = new Set(value);
  const toggle = (id: string, checked: boolean) => {
    onChange(checked ? [...value, id] : value.filter((item) => item !== id));
  };

  if (active.length === 0) {
    return (
      <p className="rounded-lg border px-3 py-2 text-sm text-muted-foreground">
        No agents are available.
      </p>
    );
  }

  return (
    <div className="max-h-44 space-y-2 overflow-y-auto rounded-lg border p-2">
      {active.map((user) => (
        <label
          key={user.id}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
        >
          <Checkbox
            checked={selected.has(user.id)}
            disabled={disabled}
            onCheckedChange={(checked) => toggle(user.id, checked === true)}
          />
          <span>
            {user.firstName} {user.lastName}
          </span>
        </label>
      ))}
    </div>
  );
};
