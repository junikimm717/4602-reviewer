import { GeneratingProps, pickPainting, Question, QuestionType, sampleYears } from "./questions";

export function pickFreeYearQuestion(props: GeneratingProps): Question {
  const [painting, _] = pickPainting(props);
  const choices = sampleYears(painting.years, 6);
  const checker = (response: number) => {
    return painting.years.findIndex((o) => Math.floor(o/10) === Math.floor(response/10)) != -1;
  };
  return {
    type: QuestionType.FreeYear,
    answer: painting,
    choices,
    checker,
    points: 2,
  };
}
