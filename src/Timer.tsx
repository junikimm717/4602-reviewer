import React, { useCallback, useEffect, useState } from 'react';
import useTimerState from './TimerState';
import useGameState from './GameState';

export default function Timer() {
  const {
    endTime,
  } = useTimerState();
  const {
    score,
    timeGiven,
  } = useGameState();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const computeTimeLeft = useCallback(() => {
    if (!endTime) return 0;
    const diff = (endTime.getTime() - (new Date()).getTime())/1000;
    return Math.max(0, diff)
  }, [endTime])
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(computeTimeLeft())
    }, 100)
    return () => clearInterval(interval);
  }, [computeTimeLeft])
  return (
    <div className="p-3 rounded-lg bg-gray-100 my-3 grid grid-cols-2 text-xl w-[min(100%,300px)] mx-auto">
      <h1 className="font-bold">Time Given</h1>
      <h1 className="">{timeGiven}s</h1>
      <h1 className="font-bold">Time Left</h1>
      <h1 className="">{timeLeft}</h1>
      <h1 className="font-bold">Score</h1>
      <h1 className="">{score}</h1>
    </div>
  )
}
