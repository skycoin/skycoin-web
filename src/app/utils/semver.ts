/**
 * Return true is current is equal or superior to target. The -rc parts are ignored.
 */
export function isEqualOrSuperiorVersion(current: string, target: string): boolean {
  const currentParts = current.split('.');
  if (currentParts.length < 3) { return false; }
  currentParts[2] = currentParts[2].split('-')[0];

  const targetParts = target.split('.');
  if (targetParts.length < 3) { return false; }
  targetParts[2] = targetParts[2].split('-')[0];

  for (let i = 0; i < 3; i++) {
    const currentNumber = Number(currentParts[i]);
    const targetNumber = Number(targetParts[i]);

    if (currentNumber > targetNumber) {
      return true;
    }

    if (currentNumber < targetNumber) {
      return false;
    }
  }

  return true;
}
