import { createContext, useContext, useEffect, useState } from "react";

interface TimerContextType {
  endTime: Date | undefined;
  startNow: (seconds: number) => any;
  quitNow: () => any;
  timerGoing: boolean;
}

const TimerContext = createContext<TimerContextType>({
  endTime: undefined,
  startNow: (_: number) => null,
  quitNow: () => null,
  timerGoing: false,
});

const useTimerState = () => useContext(TimerContext);

export default useTimerState;

export const TimerContextProvider = (props: { children: React.ReactNode }) => {
  const [endTime, setEndTime] = useState<Date | undefined>(
    isNaN(Number(localStorage.getItem("reviewer:endTime")))
      ? undefined
      : new Date(Number(localStorage.getItem("reviewer:endTime"))),
  );
  const [timerGoing, setTimerGoing] = useState<boolean>(
    !!endTime && endTime > new Date(),
  );

  useEffect(() => {
    if (!endTime) return;
    setTimerGoing(endTime > new Date());
    const timeout = setTimeout(() => {
      setTimerGoing(false);
    }, endTime.getTime() - new Date().getTime());
    return () => clearTimeout(timeout);
  }, [endTime]);

  const startNow = (seconds: number) => {
    const newTime = new Date(new Date().getTime() + seconds * 1000);
    setEndTime(newTime);
    localStorage.setItem("reviewer:endTime", newTime.getTime().toString());
  };
  const quitNow = () => {
    setEndTime(undefined);
    localStorage.removeItem("reviewer:endTime");
  };
  return (
    <TimerContext.Provider
      value={{
        endTime,
        startNow,
        timerGoing,
        quitNow,
      }}
    >
      {props.children}
    </TimerContext.Provider>
  );
};
