import React from "react";
import useGameState from "./GameState";
import AllPaintings from "../final.json";
import { Painting } from "./questions";
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

export default function Analytics() {
  const { correct, inCorrect, deleteProgress } = useGameState();
  return (
    <div className="my-2">
      <h2 className="font-bold text-xl flex justify-between items-center">
        <div>Progress</div>
        <Dialog>
          <DialogTrigger className="bg-red-800 text-base font-normal text-white px-2 py-1 mx-2 rounded-lg">
            Delete
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure you want to delete all your progress?</DialogTitle>
              <DialogDescription>This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <DialogClose className="flex gap-4 justify-center">
              <Button variant="outline">Cancel</Button>
              <Button
                variant="outline"
                className="bg-red-800 text-white"
                onClick={() => {
                  deleteProgress();
                  window.location.reload();
                }}
              >
                Confirm
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </h2>
      <div className="flex flex-row flex-wrap gap-1 mx-auto my-2 justify-center w-[80%]">
        {AllPaintings.map((painting) => (
          <RenderSquare
            key={painting.src}
            painting={painting}
            correct={correct[painting.src] || 0}
            inCorrect={inCorrect[painting.src] || 0}
          />
        ))}
      </div>
    </div>
  );
}

function squareColor(correct: number, inCorrect: number): string {
  const config: [number, string][] = [
    [-4, "bg-red-900"],
    [-3, "bg-red-600"],
    [-2, "bg-red-400"],
    [-1, "bg-red-200"],
    [0, "bg-gray-200"],
    [1, "bg-green-200"],
    [2, "bg-green-400"],
    [3, "bg-green-600"],
    [4, "bg-green-900"],
  ];
  if (correct - inCorrect <= -4) return config[0][1];
  if (correct - inCorrect >= 4) return config[config.length - 1][1];
  for (let idx = 0; idx < config.length; idx++) {
    if (correct - inCorrect === config[idx][0]) return config[idx][1];
  }
  return config[Math.floor((config.length - 1) / 2)][1];
}

function RenderSquare(props: { painting: Painting; correct: number; inCorrect: number }) {
  return (
    <div
      className={`group opacity-100 cursor-pointer hover:bg-opacity-50 w-[20px] h-[20px] rounded-sm relative ${squareColor(props.correct, props.inCorrect)}`}
    >
      <div
        className={`absolute group-hover:block text-sm hidden z-50 top-[20px] bg-gray-100 rounded-lg w-[150px] p-2 duration-200`}
      >
        <div className="font-bold">{props.painting.artist}</div>
        <a className="italic underline hover:text-blue-900" href={props.painting.src}>
          {props.painting.names[0]}
        </a>
        <div>(painted in {JSON.stringify(props.painting.years)})</div>
        <img className="max-h-[100px]" src={props.painting.src} />
      </div>
    </div>
  );
}
