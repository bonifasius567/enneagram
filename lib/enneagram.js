export function calculateResult(weights) {
  const scores = {};

  for (const w of weights) {
    if (!scores[w.enneagram_type]) {
      scores[w.enneagram_type] = 0;
    }
    scores[w.enneagram_type] += w.weight;
  }

  let maxType = null;
  let maxScore = -Infinity;

  for (const type in scores) {
    if (scores[type] > maxScore) {
      maxScore = scores[type];
      maxType = type;
    }
  }

  return {
    primary_type: maxType,
    scores,
  };
}