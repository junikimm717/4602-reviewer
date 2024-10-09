import React, { useState } from "react";
import useGameState, { AnsweredState } from "./GameState";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Painting } from "./questions";
import { paintingToChoice } from "./multiplechoicequestion";

export function FreeYearRenderer() {
  const { answerCurrentQuestion, answeredState } = useGameState();
  const [year, setYear] = useState<number | undefined>(undefined);
  return (
    <div className="my-5">
      <h1 className="text-2xl">Identify an approximate year in which this artwork was created.</h1>
      <h1 className="text-xl text-gray-800">Answers within the correct decade will be accepted.</h1>
      <Input
        placeholder="year"
        value={year}
        type="number"
        onChange={(e) => setYear(!isNaN(parseInt(e.target.value)) ? parseInt(e.target.value) : undefined)}
        className="my-2 text-[16px]"
      />
      <Button
        onClick={() => answerCurrentQuestion && answerCurrentQuestion(year)}
        disabled={year === undefined || answeredState !== AnsweredState.NotAnswered}
        className="mt-2"
      >
        Submit
      </Button>
    </div>
  );
}

export function FreeResponseRenderer() {
  const { currentQuestion, answerCurrentQuestion, answeredState } = useGameState();
  const [artist, setArtist] = useState<string>("");
  const [name, setName] = useState<string>("");
  return (
    <div className="my-5">
      <h1 className="text-2xl">Identify the author and painting of this image.</h1>
      <Input
        placeholder="artist"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        className="my-2 text-[16px]"
        key={currentQuestion!.answer.src + "artist"}
      />
      <Input
        placeholder="title"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="my-2 text-[16px]"
        key={currentQuestion!.answer.src + "name"}
      />
      <Button
        onClick={() => answerCurrentQuestion && answerCurrentQuestion([artist, name])}
        disabled={!name || !artist || answeredState !== AnsweredState.NotAnswered}
        className="mt-2"
      >
        Submit
      </Button>
    </div>
  );
}

export function MultipleChoiceRenderer() {
  const { currentQuestion, answerCurrentQuestion, answeredState } = useGameState();
  const [response, setResponse] = useState<string | undefined>(undefined);
  return (
    <div className="my-5">
      <h1 className="text-2xl">Identify the author and title of this image.</h1>
      <Select onValueChange={(value) => setResponse(value)}>
        <SelectTrigger className="w-[min(100%,500px)] my-2">
          <SelectValue placeholder="Painting" />
        </SelectTrigger>
        <SelectContent>
          {currentQuestion!.choices!.map((painting: Painting, idx: number) => (
            <SelectItem value={paintingToChoice(painting)} key={idx}>
              {paintingToChoice(painting)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={() => answerCurrentQuestion && answerCurrentQuestion(response)}
        disabled={!response || answeredState !== AnsweredState.NotAnswered}
        className="mt-2"
      >
        Submit
      </Button>
    </div>
  );
}

export function YearChoiceRenderer() {
  const { currentQuestion, answerCurrentQuestion, answeredState } = useGameState();
  const [response, setResponse] = useState<number | undefined>(undefined);
  return (
    <div className="my-5">
      <h1 className="text-2xl">Identify a year in which this painting was painted.</h1>
      <Select
        onValueChange={(value) => setResponse(isNaN(parseInt(value)) ? undefined : parseInt(value))}
      >
        <SelectTrigger className="w-[180px] my-2">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {currentQuestion!.choices!.sort().map((year: number, idx: number) => (
            <SelectItem value={String(year)} key={idx}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={() => answerCurrentQuestion && answerCurrentQuestion(response)}
        disabled={!response || answeredState !== AnsweredState.NotAnswered}
        className="mt-2"
      >
        Submit
      </Button>
    </div>
  );
}
