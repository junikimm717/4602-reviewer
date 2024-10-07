import React, { useState } from "react";
import useGameState, { RunningGameState } from "./GameState";

const timeOptions: [number, string][] = [
  [60, "1 minute"],
  [180, "3 minutes"],
  [300, "5 minutes"],
  [600, "10 minutes"],
];

export default function HomePage() {
  const { runningState, startNewGame } = useGameState();
  const [seconds, setSeconds] = useState<number>(timeOptions[0][0]);
  if (runningState === RunningGameState.Running) return null;
  return (
    <>
      <div className="flex flex-row flex-wrap gap-2">
        {timeOptions.map((time, idx: number) => (
          <div key={idx}>
            <button
              className={`rounded-lg font-bold px-2 py-1 ${seconds === time[0] ? "bg-blue-300" : "bg-gray-300"}`}
              onClick={() => setSeconds(time[0])}
            >
              {time[1]}
            </button>
          </div>
        ))}
      </div>
      <div>
        <button
          className="bg-green-800 hover:bg-green-700 text-white text-3xl px-4 py-3 my-2 rounded-lg font-bold"
          onClick={() => startNewGame(seconds)}
        >
          Start!
        </button>
      </div>
    </>
  );
}
