// Constants
const COUNT = 30;
const MIN_VALUE = 1;
const MAX_VALUE = 40;
const DESIRED_AVERAGE = 20;
// Note: the desired average should be below max value to ensure randomized values

// Compute the required sum from average
const TARGET_SUM = COUNT * DESIRED_AVERAGE;

// Generate a random integer between min and max (inclusive)
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateFixedSumInRange(): number[] {
  // Check if sum is possible with given range
  if (COUNT * MIN_VALUE > TARGET_SUM || COUNT * MAX_VALUE < TARGET_SUM) {
    throw new Error("Impossible to satisfy constraints with given range and average.");
  }

  const result: number[] = [];
  let remainingSum = TARGET_SUM;
  let remainingCount = COUNT;

  for (let i = 0; i < COUNT; i++) {
    // Compute feasible bounds for this step so remaining numbers can still be valid
    const minAllowed = Math.max(
      MIN_VALUE,
      remainingSum - (remainingCount - 1) * MAX_VALUE
    );
    const maxAllowed = Math.min(
      MAX_VALUE,
      remainingSum - (remainingCount - 1) * MIN_VALUE
    );

    const value = randomInt(minAllowed, maxAllowed);
    result.push(value);

    remainingSum -= value;
    remainingCount--;
  }

  return result;
}

const numbers = generateFixedSumInRange();
console.log("Generated Numbers:", numbers);
console.log("Sum:", numbers.reduce((sum, n) => sum + n, 0)); // Should be TARGET_SUM