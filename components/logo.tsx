"use client"

import { Gamepad2 } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Gamepad2 className="h-6 w-6 text-primary" />
      <span className="text-2xl font-bold text-primary">AI Miniclip</span>
    </div>
  );
} 