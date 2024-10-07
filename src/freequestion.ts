import {
  GeneratingProps,
  pickPainting,
  Question,
  QuestionType,
} from "./questions";
import stopWords from '../stopwords.json';

const stopWordsMap = new Set<string>(stopWords);

const preprocess = (str: string) => str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()

function checkName(response: string, name: string) {
  const nameComps = preprocess(name).split(/\s+/).filter(x => !stopWordsMap.has(x));
  const responseComps = preprocess(response).split(/\s+/).filter(x => !stopWordsMap.has(x));
  if (nameComps.length !== responseComps.length) {
    return false;
  }
  for (let i = 0; i < responseComps.length; i++) {
    if (nameComps[i] !== responseComps[i])
      return false;
  }
  return true;
}

function checkArtist(response: string, artist: string) {
  const artistComps = preprocess(artist).split(/\s+/).filter(x => !stopWordsMap.has(x));
  const responseComps = preprocess(response).split(/\s+/).filter(x => !stopWordsMap.has(x));

  return artistComps.pop() === responseComps.pop();
}

export function pickFreeQuestion(props: GeneratingProps): Question {
  const painting = pickPainting(props);
  // the person will input an artist and the name of the painting.
  const checker = (response: [string, string]) => {
    const [artist, name] = response;
    name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (!checkArtist(artist, painting[0].artist)) return false;
    for (let idx = 0; idx < painting[0].names.length; idx++) {
      if (checkName(name, painting[0].names[idx])) return true;
    }
    return false;
  };

  return {
    type: QuestionType.FreeResponse,
    answer: painting[0],
    correctResponse: [painting[0].artist, painting[0].names[0]],
    checker,
  };
}
