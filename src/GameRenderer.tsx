import React, { useState } from "react";
import useGameState, { AnsweredState, RunningGameState } from "./GameState";
import HomePage from "./HomePage";
import Timer from "./Timer";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { QuestionType } from "./questions";
import {
  FreeResponseRenderer,
  MultipleChoiceRenderer,
  YearChoiceRenderer,
} from "./QuestionRenderer";

export default function GameRenderer() {
  const {
    runningState,
    currentQuestion,
    newQuestion,
    quitGame,
    reset,
    answeredState,
  } = useGameState();
  if (runningState === RunningGameState.NotStarted) {
    return <HomePage />;
  }
  return (
    <>
      <Timer />
      <>
        <div className="mx-auto">
          {currentQuestion && runningState === RunningGameState.Running && (
            <>
              <img
                src={currentQuestion.answer.src}
                className="max-h-[300px] mx-auto"
              />
              {currentQuestion.type === QuestionType.FreeResponse ? (
                <FreeResponseRenderer />
              ) : currentQuestion.type === QuestionType.YearChoice ? (
                <YearChoiceRenderer />
              ) : (
                <MultipleChoiceRenderer />
              )}
              {answeredState === AnsweredState.NotAnswered ? null : (
                <div className="text-base my-2">
                  {answeredState === AnsweredState.Correct ? (
                    <div className="font-bold text-green-800 text-base">
                      Correct!
                    </div>
                  ) : (
                    <div className="font-bold text-red-800">Incorrect!</div>
                  )}
                  <div>
                    {currentQuestion?.answer.artist},{" "}
                    <em>{currentQuestion?.answer.names[0]}</em>, painted in{" "}
                    {JSON.stringify(currentQuestion?.answer.years)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex gap-2 justify-start items-center my-0">
          {runningState === RunningGameState.Running && (
            <Button
              onClick={() => newQuestion()}
              disabled={
                answeredState === AnsweredState.NotAnswered ||
                runningState !== RunningGameState.Running
              }
            >
              Next Question
            </Button>
          )}
          {runningState === RunningGameState.Ended && (
            <Button onClick={() => reset()}>Reset</Button>
          )}
          {runningState === RunningGameState.Running && (
            <Dialog>
              <DialogTrigger className="bg-red-800 text-white px-3 py-2 rounded-lg">
                Quit
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Are you sure you want to quit this game?
                  </DialogTitle>
                  <DialogDescription>
                    This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogClose className="flex gap-4 justify-center">
                  <Button variant="outline">Cancel</Button>
                  <Button
                    variant="outline"
                    className="bg-red-800 text-white"
                    onClick={() => {
                      quitGame();
                    }}
                  >
                    Confirm
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </>
    </>
  );
  // if we're playing the game, render the image and use a corresponding
  // question renderer.
  // if we just eneded the game, render the score.
}
