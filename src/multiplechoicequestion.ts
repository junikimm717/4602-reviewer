import {
  GeneratingProps,
  Painting,
  pickPainting,
  Question,
  QuestionType,
  sampleNPaintings,
} from "./questions";

export const paintingToChoice = (p: Painting) => {
  return p.artist + ", " + p.names[0];
};

export function pickMultipleChoiceQuestion(props: GeneratingProps): Question {
  const [painting, paintingIndex] = pickPainting(props);
  const choices = sampleNPaintings(paintingIndex, 5);
  // the person will input an artist and the name of the painting.
  const checker = (response: string) => {
    return response === paintingToChoice(painting);
  };
  return {
    type: QuestionType.MultipleChoice,
    answer: painting,
    choices,
    checker,
    points: 1,
  };
}
