import AllPaintings from "../allpaintings.json";

export enum QuestionType {
  MultipleChoice = 0,
  FreeResponse = 1,
  YearChoice = 2,
  FreeYear = 3,
}

export interface Painting {
  src: string;
  artist: string;
  names: string[];
  years: number[];
}

export interface Question {
  type: QuestionType;
  answer: Painting;
  choices?: any[];
  // check whether the response we put is actually correct.
  checker: (response: any) => boolean;
  // points per question
  points: number;
}

export interface GeneratingProps {
  correct: {
    [name: string]: number;
  };
  inCorrect: {
    [name: string]: number;
  };
}

// takes in an array of elements and a set of probabilities that an element
// could be picked (not necessarily summing to 1)
// returns a randomly picked element.
export function PickFromProbabilities<T>(arr: T[], probabilities: number[]): [T, number] {
  const probsum = probabilities.reduce((a, b) => a + b, 0);
  const randomNumber = Math.random() * probsum;
  let cursum = 0;
  for (let idx = 0; idx < probabilities.length; idx++) {
    if (cursum < randomNumber && randomNumber < cursum + probabilities[idx]) {
      return [arr[idx], idx];
    } else {
      cursum += probabilities[idx];
    }
  }
  return [arr[arr.length - 1], arr.length - 1];
}

const YEARS_DELTA = 5;
const allYears: number[] = (() => {
  const presentYears = AllPaintings.map((x) => x.years).reduce((a, b) => a.concat(b), []);
  const moreOptions = presentYears
    .map((x) =>
      Array(2 * YEARS_DELTA + 3)
        .fill(0)
        .map((_, idx) => x + idx - YEARS_DELTA)
    )
    .reduce((a, b) => a.concat(b), [])
    .sort();
  const distinctOptions = moreOptions.filter(
    (val, idx) => idx === 0 || val != moreOptions[idx - 1]
  );
  return distinctOptions;
})();

function scrambleArray(arr: any[]): any[] {
  return arr
    .map((x) => [Math.random(), x])
    .sort((a, b) => a[0] - b[0])
    .map((x) => x[1]);
}

export function sampleNPaintings(answerIndex: number, choices: number): Painting[] {
  const options = [answerIndex];
  for (let i = 0; i < choices - 1; i++) {
    while (true) {
      const option = Math.floor(Math.random() * AllPaintings.length);
      if (options.findIndex((o) => o === option) === -1) {
        options.push(option);
        break;
      }
    }
  }
  return scrambleArray(options.map((idx) => AllPaintings[idx]));
}

export function sampleYears(years: number[], choices: number): number[] {
  const options = [years[Math.floor(Math.random() * years.length)]];
  for (let i = 0; i < choices - 1; i++) {
    while (true) {
      const option = allYears[Math.floor(Math.random() * allYears.length)];
      if (
        years.findIndex((o) => o === option) === -1 &&
        options.findIndex((o) => o === option) === -1
      ) {
        options.push(option);
        break;
      }
    }
  }
  return scrambleArray(options);
}

export function pickPainting(props: GeneratingProps): [Painting, number] {
  const { correct, inCorrect } = props;
  const probabilities = AllPaintings.map((painting) => {
    if ((inCorrect[painting.src] || 0) + (correct[painting.src] || 0) <= 3) return 10;
    return (
      (1 + 3 * Math.max(inCorrect[painting.src] || 0, 0)) /
      (1 + Math.max(correct[painting.src] || 0, 0))
    );
  });
  return PickFromProbabilities(AllPaintings, probabilities);
}
