function normalizeScores(scores = []) {
  return [...scores]
    .sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime())
    .slice(0, 5);
}

function appendLatestScore(scores = [], nextScore) {
  const merged = [...scores, nextScore]
    .sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime())
    .slice(0, 5);

  return merged;
}

module.exports = { normalizeScores, appendLatestScore };
