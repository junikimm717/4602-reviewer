import React, { createContext, useContext, useEffect, useState } from "react";
import { Question, QuestionType } from "./questions";
import useTimerState from "./TimerState";
import { pickMultipleChoiceQuestion } from "./multiplechoicequestion";
import { pickFreeQuestion } from "./freequestion";
import { pickYearChoiceQuestion } from "./yearquestion";
import { getStoredInt } from "./utils";

export enum RunningGameState {
  NotStarted = 0,
  Running = 1,
  Ended = 2,
}

export enum AnsweredState {
  NotAnswered = 0,
  Correct = 1,
  Incorrect = 2,
}

interface GameManagerContextType {
  currentQuestion: Question | undefined;
  newQuestion: () => any;
  answerCurrentQuestion: ((response: any) => any) | undefined;
  quitGame: () => any;
  startNewGame: (seconds: number) => any;
  reset: () => any;
  score: number;
  runningState: RunningGameState;
  answeredState: AnsweredState;
  timeGiven: number;
}

const GameManagerContext = createContext<GameManagerContextType>({
  currentQuestion: undefined,
  newQuestion: () => null,
  answerCurrentQuestion: undefined,
  quitGame: () => null,
  startNewGame: (_) => null,
  score: 0,
  reset: () => null,
  runningState: 0,
  answeredState: 0,
  timeGiven: 0,
});

const useGameState = () => useContext(GameManagerContext);

export function GameManagerProvider(props: { children: React.ReactNode }) {
  const { timerGoing, quitNow, startNow } = useTimerState();
  const [responses, setResponses] = useState<{ [name: string]: number }>({});
  const [timeGiven, setTimeGiven] = useState<number>(getStoredInt("reviewer:timeGiven"));
  const [currentQuestion, setCurrentQuestion] = useState<Question | undefined>(
    undefined,
  );
  // score functions
  const [score, setScore] = useState<number>(getStoredInt("reviewer:score"));
  const [runningState, setRunningState] = useState<RunningGameState>(
    getStoredInt("reviewer:gamestate"),
  );
  const [answeredState, setAnsweredState] = useState<AnsweredState>(
    AnsweredState.NotAnswered,
  );

  const newQuestion = () => {
    const generatingProps = {
      responses,
    };
    switch (Math.floor(3 * Math.random())) {
      case 0:
        setCurrentQuestion(pickMultipleChoiceQuestion(generatingProps));
        break;
      case 1:
        setCurrentQuestion(pickFreeQuestion(generatingProps));
        break;
      default:
        setCurrentQuestion(pickYearChoiceQuestion(generatingProps));
    }
    setAnsweredState(AnsweredState.NotAnswered);
  };

  const reset = () => {
    setRunningState(RunningGameState.NotStarted);
    setCurrentQuestion(undefined);
    setResponses({});
  }

  const quitGame = () => {
    if (runningState !== RunningGameState.Running) return;
    quitNow();
    setRunningState(RunningGameState.Ended);
  };

  const startNewGame = (seconds: number) => {
    if (runningState === RunningGameState.Running) return;
    // the timer must be called immediately
    startNow(seconds);
    setTimeGiven(seconds);
    setRunningState(RunningGameState.Running);
    setResponses({});
    newQuestion();
    setScore(0);
    localStorage.setItem("reviewer:score", "0");
    localStorage.setItem("reviewer:timeGiven", String(seconds));
  };

  useEffect(() => {
    if (!timerGoing && runningState === RunningGameState.Running) {
      setRunningState(RunningGameState.Ended);
    }
  }, [timerGoing])

  useEffect(() => {
    if (timerGoing && !currentQuestion) {
      newQuestion();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("reviewer:gamestate", String(runningState));
  }, [runningState]);

  useEffect(() => {
    localStorage.setItem("reviewer:responses", JSON.stringify(responses));
  }, [responses]);

  const answerCurrentQuestion = (response: any) => {
    if (!currentQuestion || runningState !== RunningGameState.Running || answeredState !== AnsweredState.NotAnswered) return;
    const painting = currentQuestion.answer;
    if (currentQuestion.checker(response)) {
      setResponses({
        ...response,
        [painting.src]: isNaN(response[painting.src] + 1)
          ? 1
          : response[painting.src] + 1,
      });
      const multiplier = currentQuestion.type === QuestionType.FreeResponse ? 3 : 1;
      setScore((s) => {
        localStorage.setItem("reviewer:score", String(s + multiplier));
        return s + multiplier;
      });
      setAnsweredState(AnsweredState.Correct);
    } else {
      setAnsweredState(AnsweredState.Incorrect);
    }
  };

  return (
    <GameManagerContext.Provider
      value={{
        newQuestion,
        currentQuestion,
        answerCurrentQuestion,
        quitGame,
        startNewGame,
        score,
        runningState,
        answeredState,
        reset,
        timeGiven,
      }}
    >
      {props.children}
    </GameManagerContext.Provider>
  );
}

export default useGameState;
