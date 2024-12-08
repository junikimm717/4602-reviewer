import React, { useState } from "react";
import useGameState, { RunningGameState } from "./GameState";
import Analytics from "./Analytics";

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
      <div className="mb-3">
        <p>A site to help study image identifications for the upcoming 4.602 final!</p>
        <p>
          Help contribute to this site (and our paintings database) on{" "}
          <a
            href="https://github.com/junikimm717/4602-reviewer"
            className="underline"
            target="_blank"
          >
            GitHub!
          </a>
        </p>
      </div>
      <div className="flex flex-row flex-wrap gap-2 justify-center">
        {timeOptions.map((time, idx: number) => (
          <div key={idx}>
            <button
              className={`rounded-lg font-bold px-2 py-1 duration-200 ${seconds === time[0] ? "bg-black text-white" : "bg-gray-300"}`}
              onClick={() => setSeconds(time[0])}
            >
              {time[1]}
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center">
        <button
          className="bg-green-700 hover:bg-green-900 text-white text-3xl px-4 py-3 my-2 rounded-lg font-bold duration-200"
          onClick={() => startNewGame(seconds)}
        >
          Start!
        </button>
      </div>
      <Analytics />
    </>
  );
}
