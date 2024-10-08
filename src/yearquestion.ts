import { GeneratingProps, pickPainting, Question, QuestionType, sampleYears } from "./questions";

export function pickYearChoiceQuestion(props: GeneratingProps): Question {
  const [painting, _] = pickPainting(props);
  const choices = sampleYears(painting.years, 6);
  // the person will input an artist and the name of the painting.
  const checker = (response: number) => {
    return painting.years.findIndex((o) => o === response) != -1;
  };
  return {
    type: QuestionType.YearChoice,
    answer: painting,
    choices,
    checker,
    points: 1,
  };
}
