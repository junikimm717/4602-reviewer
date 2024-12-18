import React, { createContext, useContext, useEffect, useState } from "react";
import { PickFromProbabilities, Question, QuestionType } from "./questions";
import useTimerState from "./TimerState";
import { pickMultipleChoiceQuestion } from "./multiplechoicequestion";
import { pickFreeQuestion } from "./freequestion";
import { pickYearChoiceQuestion } from "./yearquestion";
import { getStoredInt } from "./utils";
import { pickFreeYearQuestion } from "./freeyear";

const PICKERS = [pickMultipleChoiceQuestion, pickFreeQuestion, pickYearChoiceQuestion, pickFreeYearQuestion]
const PICKER_PROBS = [1, 8, 1, 2]

const ADAPTIVE_TYPES = [QuestionType.FreeResponse]

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
  deleteProgress: () => any;
  score: number;
  questionNumber: number;
  runningState: RunningGameState;
  answeredState: AnsweredState;
  timeGiven: number;
  correct: { [name: string]: number };
  inCorrect: { [name: string]: number };
}

const GameManagerContext = createContext<GameManagerContextType>({
  currentQuestion: undefined,
  newQuestion: () => null,
  answerCurrentQuestion: undefined,
  quitGame: () => null,
  startNewGame: (_) => null,
  score: 0,
  reset: () => null,
  deleteProgress: () => null,
  runningState: 0,
  answeredState: 0,
  timeGiven: 0,
  correct: {},
  inCorrect: {},
  questionNumber: 0,
});

const useGameState = () => useContext(GameManagerContext);

export function GameManagerProvider(props: { children: React.ReactNode }) {
  const { timerGoing, quitNow, startNow } = useTimerState();
  const [correct, setCorrect] = useState<{ [name: string]: number }>(
    JSON.parse(localStorage.getItem("reviewer:responses") || "{}")
  );
  const [inCorrect, setInCorrect] = useState<{ [name: string]: number }>(
    JSON.parse(localStorage.getItem("reviewer:incorrect") || "{}")
  );
  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const [timeGiven, setTimeGiven] = useState<number>(getStoredInt("reviewer:timeGiven"));
  const [currentQuestion, setCurrentQuestion] = useState<Question | undefined>(undefined);
  // score functions
  const [score, setScore] = useState<number>(getStoredInt("reviewer:score"));
  const [runningState, setRunningState] = useState<RunningGameState>(
    getStoredInt("reviewer:gamestate")
  );
  const [answeredState, setAnsweredState] = useState<AnsweredState>(AnsweredState.NotAnswered);

  const newQuestion = () => {
    const generatingProps = {
      correct,
      inCorrect,
    };
    const [picker] = PickFromProbabilities(PICKERS, PICKER_PROBS)
    setCurrentQuestion(picker(generatingProps));
    setAnsweredState(AnsweredState.NotAnswered);
    setQuestionNumber((q) => q + 1);
  };

  const reset = () => {
    setRunningState(RunningGameState.NotStarted);
    setCurrentQuestion(undefined);
  };

  const deleteProgress = () => {
    setCorrect({});
    setInCorrect({});
  };

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
    newQuestion();
    setScore(0);
    localStorage.setItem("reviewer:score", "0");
    localStorage.setItem("reviewer:timeGiven", String(seconds));
  };

  useEffect(() => {
    if (!timerGoing && runningState === RunningGameState.Running) {
      setRunningState(RunningGameState.Ended);
    }
  }, [timerGoing]);

  useEffect(() => {
    if (timerGoing && !currentQuestion) {
      newQuestion();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("reviewer:gamestate", String(runningState));
  }, [runningState]);

  useEffect(() => {
    localStorage.setItem("reviewer:responses", JSON.stringify(correct));
  }, [correct]);

  useEffect(() => {
    localStorage.setItem("reviewer:incorrect", JSON.stringify(inCorrect));
  }, [inCorrect]);

  const answerCurrentQuestion = (response: any) => {
    if (
      !currentQuestion ||
      runningState !== RunningGameState.Running ||
      answeredState !== AnsweredState.NotAnswered
    )
      return;
    const painting = currentQuestion.answer;
    const adaptive = ADAPTIVE_TYPES.findIndex(t => t === currentQuestion.type) !== -1;
    if (currentQuestion.checker(response)) {
      adaptive && setCorrect((c) => ({
        ...c,
        [painting.src]: isNaN(c[painting.src] + 1) ? 1 : c[painting.src] + 1,
      }));
      setScore((s) => {
        localStorage.setItem("reviewer:score", String(s + currentQuestion.points));
        return s + currentQuestion.points;
      });
      setAnsweredState(AnsweredState.Correct);
    } else {
      setInCorrect((ic) => ({
        ...ic,
        [painting.src]: isNaN(ic[painting.src] + 1) ? 1 : ic[painting.src] + 1,
      }));
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
        correct,
        inCorrect,
        deleteProgress,
        questionNumber,
      }}
    >
      {props.children}
    </GameManagerContext.Provider>
  );
}

export default useGameState;
