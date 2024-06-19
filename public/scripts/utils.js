export const isValidPosition = (newX, newY, existingDots, minDistance) => {
  return existingDots.every(dot => {
    const xDistance = newX - dot.x;
    const yDistance = newY - dot.y;
    return Math.sqrt(xDistance * xDistance + yDistance * yDistance) >= minDistance;
  });
};
