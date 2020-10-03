const sampleArray = require('./sample-array');
const words = require('./resources/words.json');
const chars = require('./resources/chars.json');

module.exports = (count, rng = Math.random) => {
  const result = sampleArray(words, count, { rng, unique: true });
  const noiseProb = rng();
  const noiseFactor = Math.floor(rng() * 10) + 1;
  return result.map((e_) => {
    if (noiseProb >= rng()) {
      return e_;
    }
    const e = e_.split('');
    const noiseCount = Math.floor(e.length * (rng() ** noiseFactor)) + 1;
    const noiseChars = sampleArray(chars, noiseCount, { rng, unique: true });
    const noiseTargets = sampleArray([...Array(e.length).keys()], noiseCount, { rng });
    noiseTargets.forEach((targetIdx, replacementIdx) => {
      e[targetIdx] = noiseChars[replacementIdx];
    });
    return e.join('');
  });
};
