//tslint:disable:no-console
import { loadModule, enableLogger } from 'hunspell-asm';

enableLogger(console.log.bind(console));

let affFile = null;
let dictFile = null;

const getHunspellInstance = async (affUrl: string, dictUrl: string) => {
  const hunspellFactory = await loadModule();

  if (affFile) {
    hunspellFactory.unmount(affFile);
  }

  if (dictFile) {
    hunspellFactory.unmount(dictFile);
  }


  const aff = await fetch(affUrl);
  const affBuffer = new Uint8Array(await aff.arrayBuffer());
  const affUrlParts = affUrl.split('/')
  affFile = hunspellFactory.mountBuffer(affBuffer, affUrlParts[affUrlParts.length-1]);

  const dic = await fetch(dictUrl);
  const dicBuffer = new Uint8Array(await dic.arrayBuffer());
  const dictUrlParts = dictUrl.split('/')
  dictFile = hunspellFactory.mountBuffer(dicBuffer, dictUrlParts[dictUrlParts.length-1]);

  return hunspellFactory.create(affFile, dictFile);
};

const run = (hunspell: Hunspell, query: string) => {
  const spellStart = performance.now()
  const isSpelledCorrectly = hunspell.spell(query);
  const spellEnd = performance.now()

  const suggestStart = performance.now()
  const suggestions = hunspell.suggest(query);
  const suggestEnd = performance.now()

  return {
    spellDuration: (spellEnd - spellStart).toFixed(3),
    suggestDuration: (suggestEnd - suggestStart).toFixed(3),
    isSpelledCorrectly,
    suggestions
  }
}

export { getHunspellInstance, run }