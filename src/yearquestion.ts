import {
  GeneratingProps,
  pickPainting,
  Question,
  QuestionType,
  sampleYears,
} from "./questions";

export function pickYearChoiceQuestion(props: GeneratingProps): Question {
  const [painting, _] = pickPainting(props);
  const choices = sampleYears(painting.years, 5);
  // the person will input an artist and the name of the painting.
  const checker = (response: number) => {
    return painting.years.findIndex(o => o === response) != -1;
  };
  return {
    type: QuestionType.YearChoice,
    answer: painting,
    choices,
    correctResponse: choices.find(year => painting.years.findIndex(o => o === year) != -1),
    checker,
  };
}
