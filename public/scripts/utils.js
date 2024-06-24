export const isValidPosition = (newX, newY, existingDots, minDistance) => {
  return existingDots.every(dot => {
    const xDistance = newX - dot.x;
    const yDistance = newY - dot.y;
    return Math.sqrt(xDistance * xDistance + yDistance * yDistance) >= minDistance;
  });
};

// Fisher-Yates array shuffle algortihm
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}