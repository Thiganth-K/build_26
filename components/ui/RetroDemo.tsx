"use client";

import React from "react";
import { Button, Card, ProgressBar, Bubble } from "pixel-retroui";

export function RetroDemo() {
  const [progress, setProgress] = React.useState(75);

  return (
    <div className="p-6 space-y-4">
      <Card bg="#ffffff" borderColor="#111111" shadowColor="#5E56E7" className="p-6 space-y-4">
        <h2 className="text-xl font-minecraft text-[#111111]">
          🕹️ BUILD26 RETRO UI INTEGRATION
        </h2>
        <p className="text-xs text-secondary font-sans leading-relaxed">
          Pixel-RetroUI has been successfully installed and configured with Next.js, Tailwind CSS, and the Minecraft pixel font.
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-minecraft">
            <span>TEAM CONSENSUS PROGRESS</span>
            <span>{progress}%</span>
          </div>
          <ProgressBar
            progress={progress}
            size="md"
            color="#10B981"
            borderColor="#111111"
          />
        </div>

        <div className="pt-2 flex items-center gap-3 flex-wrap">
          <Button
            bg="#5E56E7"
            textColor="#ffffff"
            shadow="#111111"
            className="px-5 py-2 font-minecraft text-xs"
            onClick={() => setProgress((prev) => Math.min(100, prev + 25))}
          >
            [ VOTE APPROVE +25% ]
          </Button>

          <Button
            bg="#f1f1ef"
            textColor="#111111"
            shadow="#6B6B6B"
            className="px-5 py-2 font-minecraft text-xs"
            onClick={() => setProgress(0)}
          >
            [ RESET ]
          </Button>
        </div>

        <div className="pt-2">
          <Bubble direction="left" bg="#EEEDFD" borderColor="#5E56E7" className="text-xs font-minecraft text-[#111111]">
            Pixel speech bubble: Day 1 PPT consensus reached! Ready for Evaluators.
          </Bubble>
        </div>
      </Card>
    </div>
  );
}

export default RetroDemo;
