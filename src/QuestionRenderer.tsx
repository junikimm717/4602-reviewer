import React, { useRef, useState } from "react";
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
  const disabled = year === undefined || answeredState !== AnsweredState.NotAnswered;
  const submit = () => {
    if (!disabled) {
      answerCurrentQuestion && answerCurrentQuestion(year);
    }
  };
  return (
    <div className="my-5">
      <h1 className="text-2xl">Identify an approximate year in which this artwork was created.</h1>
      <h1 className="text-xl text-gray-800">Answers within the correct decade will be accepted.</h1>
      <Input
        placeholder="year"
        value={year}
        type="number"
        onChange={(e) =>
          setYear(!isNaN(parseInt(e.target.value)) ? parseInt(e.target.value) : undefined)
        }
        className="my-2 text-[16px]"
        autoFocus
        onKeyUp={(e) => {
          if (e.key === "Enter" && answeredState === AnsweredState.NotAnswered) {
            e.stopPropagation()
            submit();
          }
        }}
      />
      <Button onClick={() => submit()} disabled={disabled} className="mt-2">
        Submit
      </Button>
    </div>
  );
}

export function FreeResponseRenderer() {
  const { currentQuestion, answerCurrentQuestion, answeredState } = useGameState();
  const [artist, setArtist] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [year, setYear] = useState<number | undefined>(undefined);

  const artistRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const disabled = !year || !name || !artist || answeredState !== AnsweredState.NotAnswered;
  const submit = () => {
    if (!disabled) {
      answerCurrentQuestion && answerCurrentQuestion([artist, name, year]);
    }
  };
  return (
    <div className="my-5">
      <h1 className="text-2xl">Identify the creator, title, and approximate year of this image.</h1>
      <Input
        placeholder="artist"
        value={artist}
        ref={artistRef}
        onChange={(e) => setArtist(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            titleRef.current && titleRef.current.focus();
          }
        }}
        autoFocus
        className="my-2 text-[16px]"
        key={currentQuestion!.answer.src + "artist"}
      />
      <Input
        placeholder="title"
        value={name}
        ref={titleRef}
        onChange={(e) => setName(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            yearRef.current && yearRef.current.focus();
          }
        }}
        className="my-2 text-[16px]"
        key={currentQuestion!.answer.src + "name"}
      />
      <Input
        placeholder="year"
        value={year}
        ref={yearRef}
        type="number"
        onChange={(e) =>
          setYear(!isNaN(parseInt(e.target.value)) ? parseInt(e.target.value) : undefined)
        }
        onKeyUp={(e) => {
          if (e.key === "Enter" && answeredState === AnsweredState.NotAnswered) {
            e.stopPropagation()
            submit();
          }
        }}
        className="my-2 text-[16px]"
      />
      <Button onClick={submit} disabled={disabled} className="mt-2">
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
        <SelectTrigger className="w-[min(100%,500px)] my-2" autoFocus>
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
